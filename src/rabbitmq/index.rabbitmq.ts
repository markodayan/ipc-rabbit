import amqplib from 'amqplib';
import * as dotenv from 'dotenv';
dotenv.config();

import { asyncRetry } from 'src/utils/index.utils';
import { CustomError } from 'src/error/index.error';
import { EXCHANGES, QUEUES, ROUTING_KEYS } from 'src/rabbitmq/config.rabbitmq';

const container_name = 'rabbitmq';

const settings = {
  // url: `amqp://admin:admin@${container_name}:5672`,
  url: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${container_name}:5672`,
};

class RabbitMQ {
  private static instance: RabbitMQ;
  public connection: amqplib.Connection;
  public channel: amqplib.Channel;
  public exchange: amqplib.Replies.AssertExchange;
  public queue: amqplib.Replies.AssertQueue;
  public routingKey: string;
  public url: string;

  private constructor() {
    this.init();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQ();
    }

    return this.instance;
  }

  private async init() {
    const { url } = settings;

    // Connect to RabbitMQ server
    this.connection = await asyncRetry<any>(async () => await this.connect(url), {
      delay_time: 3000,
      retries: 5,
    });

    // Create a channel
    this.channel = await this.connection.createChannel();

    // Create exchange (or assert that it exists) [Idempotent operation]
    this.exchange = await this.channel.assertExchange(EXCHANGES.READY_EXCHANGE, 'direct', { durable: true });

    // Create queue (or assert that it exists) [Idempotent operation]
    this.queue = await this.channel.assertQueue(QUEUES.READY_QUEUE, { durable: true });

    // Bind the queue to the exchange with the routing key
    await this.channel.bindQueue(QUEUES.READY_QUEUE, EXCHANGES.READY_EXCHANGE, ROUTING_KEYS.FOO_READY_KEY);
    console.log(
      `Exchange '${EXCHANGES.READY_EXCHANGE}' and queues '${QUEUES.READY_QUEUE}' and '${ROUTING_KEYS.FOO_READY_KEY}' created and bound successfully.`
    );
    await this.channel.bindQueue(QUEUES.READY_QUEUE, EXCHANGES.READY_EXCHANGE, ROUTING_KEYS.BAR_READY_KEY);
    console.log(
      `Exchange '${EXCHANGES.READY_EXCHANGE}' and queues '${QUEUES.READY_QUEUE}' and '${ROUTING_KEYS.BAR_READY_KEY}' created and bound successfully.`
    );
    await this.channel.bindQueue(QUEUES.READY_QUEUE, EXCHANGES.READY_EXCHANGE, ROUTING_KEYS.BAZ_READY_KEY);
    console.log(
      `Exchange '${EXCHANGES.READY_EXCHANGE}' and queues '${QUEUES.READY_QUEUE}' and '${ROUTING_KEYS.BAZ_READY_KEY}' created and bound successfully.`
    );
  }

  public async connect(url: string): Promise<amqplib.Connection> {
    try {
      return await amqplib.connect(url);
    } catch (error: any) {
      throw new CustomError(error.syscall, error.code, error.errno);
    }
  }

  public async publish(message: string) {}

  public async consume(message: string) {}
}

export default RabbitMQ;
