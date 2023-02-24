import rascal from 'rascal';
import * as dotenv from 'dotenv';
dotenv.config();

const container_name = 'rabbitmq';

const config: rascal.BrokerConfig = {
  vhosts: {
    '/': {
      connection: {
        url: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${container_name}:5672`,
      },
      exchanges: ['ready-exchange'],
      queues: {
        'foo-queue': {
          assert: true,
          options: { durable: true },
        },
        'bar-queue': {
          assert: true,
          options: { durable: true },
        },
        'baz-queue': {
          assert: true,
          options: { durable: true },
        },
      },
      bindings: [
        'ready-exchange[foo] -> foo-queue',
        'ready-exchange[bar] -> bar-queue',
        'ready-exchange[baz] -> baz-queue',
      ],
      publications: {
        foo_ready: {
          exchange: 'ready-exchange',
          routingKey: 'foo',
          options: {
            persistent: true,
          },
        },
        bar_ready: {
          exchange: 'ready-exchange',
          routingKey: 'bar',
          options: {
            persistent: true,
          },
        },
        baz_ready: {
          exchange: 'ready-exchange',
          routingKey: 'baz',
          options: {
            persistent: true,
          },
        },
      },
      subscriptions: {
        foo_ready: {
          queue: 'foo-queue',
        },
        bar_ready: {
          queue: 'bar-queue',
        },
        baz_ready: {
          queue: 'baz-queue',
        },
      },
    },
  },
};

export { config };
