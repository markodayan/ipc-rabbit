import rascal from 'rascal';
import { config as CONFIG } from './config.rascal';
import { asyncRetry } from 'src/utils/index.utils';
import { CustomError } from 'src/error/index.error';

class Broker {
  private static instance: Broker;
  private broker: rascal.BrokerAsPromised;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Broker();
    }

    return this.instance;
  }

  private constructor() {
    this.init();
  }

  private async init() {
    // Retry Logic
    this.broker = await asyncRetry<any>(async () => await this.connect(), {
      delay_time: 3000,
      retries: 5,
    });

    await this.subscribe('foo_ready');

    // await this.publish('hello world message');
    // await this.publish('hello world message');
    // await this.publish('hello world message');
    // await this.publish('hello world message');
    // await this.publish('hello world message');
    // await this.publish('hello world message');

    this.broker.on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });

    this.broker.on('warning', (warning) => {
      console.warn(`Warning: ${warning.message}`);
    });

    this.broker.on('connection', () => {
      console.log('Broker ready');
    });
  }

  private async connect() {
    try {
      return await rascal.BrokerAsPromised.create(CONFIG);
    } catch (error: any) {
      throw new CustomError(error.syscall, error.code, error.errno);
    }
  }

  public async publish(pub_name: string, message: string) {
    console.log(`[${process.env.SERVICE_NAME}] publishing message...`);
    await this.broker.publish(pub_name, message);
  }

  public async subscribe(pub_name: string) {
    try {
      const subscription = await this.broker.subscribe(pub_name);

      subscription.on('message', (message, content, ackorNack) => {
        console.log(content);
        ackorNack();
      });
    } catch (error: any) {
      console.error(error);
    }
  }
}

export default Broker;
