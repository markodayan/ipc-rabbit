import express, { Express } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import Broker from 'src/rascal/broker.rascal';
import { waitForPort } from 'src/utils/port.utils';

async function run() {
  const service_name = process.env.SERVICE_NAME;
  const app: Express = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Port 5002
  const PORT = process.env.SERVICE_PORT;

  // Instantiate Broker
  const rabbit_wrapper = new Broker();

  // Wait for RabbitMQ Server to be up and running
  await waitForPort(5672);

  /**
   * In this block we:
   * - initialise the message broker
   * - subscribe to the bar-queue (and wait for a ready message)
   * - start the server (on port 5002)
   * - publish to the baz-queue to signal that bar service is ready
   */
  try {
    await rabbit_wrapper.init();
    const { broker } = rabbit_wrapper;
    const subscription = await broker.subscribe('bar_ready');

    subscription.on('message', async (message, content, ackOrNack) => {
      console.log('baz service received:', content);

      app.listen(PORT, async () => {
        console.log(`[${service_name}] Service running on port ${PORT}`);

        await broker.publish(`${service_name}_ready`, service_name, { routingKey: service_name });
      });

      process.on('exit', (code) => {
        console.log(`[${service_name}] About to exit with code: ${code}`);

        ackOrNack();
      });
    });
  } catch (err: any) {
    console.log(`[${service_name}] top-level error (broker-related likely)`);
  }
}

export { run };
