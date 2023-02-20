import * as dotenv from 'dotenv';
dotenv.config();

import amqplib from 'amqplib';
import { asyncRetry } from 'src/utils/index.utils';

const container_name = 'rabbitmq';

const settings = {
  exchange: 'my-direct-exchange',
  queue: 'my-queue',
  routingKey: 'my-routing-key',
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
    const { exchange, queue, routingKey, url } = settings;

    // Connect to RabbitMQ server
    this.connection = await asyncRetry<any>(async () => await this.connect(url), {
      delay_time: 2000,
      retries: 3,
    });
    // Create a channel
    this.channel = await this.connection.createChannel();

    // Create exchange (or assert that it exists) [Idempotent operation]
    this.exchange = await this.channel.assertExchange(exchange, 'direct', { durable: true });

    // Create queue (or assert that it exists) [Idempotent operation]
    this.queue = await this.channel.assertQueue(queue, { durable: true });

    // Bind the queue to the exchange with the routing key
    await this.channel.bindQueue(queue, exchange, routingKey);
    console.log(`Exchange '${exchange}' and queue '${queue}' created and bound successfully`);
  }

  public async connect(url: string): Promise<amqplib.Connection> {
    try {
      return await amqplib.connect(url);
    } catch (error) {
      console.log(error);
      throw new Error('error in connect');
    }
  }
}

export default RabbitMQ;
