import express, { Express } from 'express';
import RabbitMQ from 'src/rabbitmq/index.rabbitmq';
import Consumer from 'src/rascal/consumer.rascal';

async function run() {
  const service_name = process.env.SERVICE_NAME;
  const app: Express = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const PORT = process.env.SERVICE_PORT;

  // const rabbit = RabbitMQ.getInstance();
  const consumer = Consumer.getInstance();

  app.listen(PORT, () => {
    console.log(`[${service_name}] Service running on port ${PORT}`);
  });

  process.on('exit', (code) => {
    console.log(`[${service_name}] About to exit with code: ${code}`);
  });
}

export { run };
