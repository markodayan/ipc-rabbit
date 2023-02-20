import rascal from 'rascal';
import { config as CONFIG } from './config.rascal';

class Publisher {
  private static instance: Publisher;
  private broker: rascal.BrokerAsPromised;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Publisher();
    }

    return this.instance;
  }

  private constructor() {
    this.init();
  }

  private async init() {
    this.broker = await rascal.BrokerAsPromised.create(CONFIG);

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
}

export default Publisher;
