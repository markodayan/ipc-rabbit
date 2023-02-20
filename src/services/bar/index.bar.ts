import express, { Express } from 'express';

async function run() {
  const service_name = process.env.SERVICE_NAME;
  const app: Express = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const PORT = process.env.SERVICE_PORT;

  app.listen(PORT, () => {
    console.log(`[${service_name}] Service running on port ${PORT}`);
  });

  process.on('exit', (code) => {
    console.log(`[${service_name}] About to exit with code: ${code}`);
  });
}

export { run };
