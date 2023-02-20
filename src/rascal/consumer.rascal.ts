import rascal from 'rascal';
import { config as CONFIG } from './config.rascal';
import { asyncRetry } from 'src/utils/index.utils';
import { CustomError } from 'src/error/index.error';

class Consumer {
  private static instance: Consumer;
  private broker: rascal.BrokerAsPromised;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Consumer();
    }

    return this.instance;
  }

  private constructor() {
    this.init();
  }

  private async init() {
    this.broker = await asyncRetry<any>(async () => await this.connect(), {
      delay_time: 3000,
      retries: 5,
    });

    this.broker.on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });

    this.broker.on('warning', (warning) => {
      console.warn(`Warning: ${warning.message}`);
    });

    this.broker.on('ready', () => {
      console.log('publisher ready');
    });
  }

  private async connect() {
    try {
      return await rascal.BrokerAsPromised.create(CONFIG);
    } catch (error: any) {
      throw new CustomError(error.syscall, error.code, error.errno);
    }
  }
}

export default Consumer;
