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

  // Instantiate broker singleton
  const rabbit_wrapper = new Broker();

  // Wait for RabbitMQ server to be up and running
  await waitForPort(5672);

  try {
    await rabbit_wrapper.init();
    const { broker } = rabbit_wrapper;
    await broker.publish('foo_ready', 'Foo service is ready');

    app.listen(PORT, () => {
      console.log(`[${service_name}] Service running on port ${PORT}`);
    });

    process.on('exit', (code) => {
      console.log(`[${service_name}] About to exit with code: ${code}`);
    });
  } catch (err: any) {
    console.log('ola:', err);
  }
}

export { run };
