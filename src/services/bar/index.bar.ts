import express, { Express } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import Broker from 'src/rascal/broker';
import { waitForPort } from 'src/utils/port.utils';

async function run() {
  const service_name = process.env.SERVICE_NAME;
  const app: Express = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const PORT = process.env.SERVICE_PORT;

  // Instantiate Broker
  const rabbit_wrapper = new Broker();

  // Wait for RabbitMQ Server to be up and running
  await waitForPort(5672);
  //Option 1: Wait for foo service (port 5000) to be up and running
  await waitForPort(5000);

  // Option 2: receive message from RabbitMQ showing that foo is ready

  try {
    await rabbit_wrapper.init();
    const { broker } = rabbit_wrapper;
    const subscription = await broker.subscribe('foo_ready');

    subscription.on('message', (message, content, ackOrNack) => {
      console.log(`[${process.env.SERVICE_NAME}] ${content}`);
      app.listen(PORT, () => {
        console.log(`[${service_name}] Service running on port ${PORT}`);
      });

      process.on('exit', (code) => {
        console.log(`[${service_name}] About to exit with code: ${code}`);
      });

      ackOrNack();
    });
  } catch (error: any) {
    console.error(error);
  }
}

export { run };
