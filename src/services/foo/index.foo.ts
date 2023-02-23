import express, { Express } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import RabbitMQ from 'src/rabbitmq/index.rabbitmq';
import Consumer from 'src/rascal/consumer.rascal';
import Broker from 'src/rascal/broker.rascal';
import { waitForPort } from 'src/utils/port.utils';

async function run() {
  const service_name = process.env.SERVICE_NAME;
  const app: Express = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const PORT = process.env.SERVICE_PORT;

  const broker = Broker.getInstance();

  // Wait for RabbitMQ server to be up and running
  await waitForPort(5672);

  app.listen(PORT, () => {
    console.log(`[${service_name}] Service running on port ${PORT}`);
  });

  process.on('exit', (code) => {
    console.log(`[${service_name}] About to exit with code: ${code}`);
  });
}

export { run };
