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
        'ready-queue': {
          assert: true,
          options: { durable: true },
        },
      },
      bindings: [
        'ready-exchange[foo] -> ready-queue',
        'ready-exchange[bar] -> ready-queue',
        'ready-exchange[baz] -> ready-queue',
        'ready-exchange[car] -> ready-queue',
      ],
      publications: {},
      subscriptions: {
        foo_sub: {
          queue: 'ready-queue',
        },
      },
    },
  },
};

export { config };
