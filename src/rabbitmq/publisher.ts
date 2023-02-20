import amqplib from 'amqplib';

const container_name = 'rabbitmq';

const settings = {
  exchange: 'my-direct-exchange',
  queue: 'my-queue',
  routingKey: 'my-routing-key',
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
    this.connection = await amqplib.connect(url as string, {});
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
}

export default RabbitMQ;
