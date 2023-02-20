const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

declare type AsyncToWrap = (...args: any[]) => Promise<any>;
interface RetryOptions {
  retries?: number;
  delay_time?: number;
}

const asyncRetry = async <T extends AsyncToWrap>(fn: T, options: RetryOptions = {}): Promise<T> => {
  let { retries = 3, delay_time = 2000 } = options;

  try {
    console.log(`retries left: ${retries}`);
    return await fn();
  } catch (err) {
    console.log(err);
    if (retries === 0) {
      throw new Error('Retries exhausted');
    }

    await delay(delay_time);
    return await asyncRetry(fn, { retries: retries - 1, delay_time });
  }
};

export { delay, asyncRetry };
