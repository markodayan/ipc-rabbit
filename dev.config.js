module.exports = {
  apps: [
    {
      name: 'foo',
      script: './src/index.ts',
      watch: false,
      interpreter: './node_modules/.bin/ts-node',
      node_args: '-r tsconfig-paths/register ./src/index.ts foo',
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        SERVICE_NAME: 'foo',
        SERVICE_PORT: 5000,
      },
    },
    {
      name: 'bar',
      script: './src/index.ts',
      watch: false,
      interpreter: './node_modules/.bin/ts-node',
      node_args: '-r tsconfig-paths/register ./src/index.ts bar',
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        SERVICE_NAME: 'bar',
        SERVICE_PORT: 5001,
      },
    },
    {
      name: 'baz',
      script: './src/index.ts',
      watch: false,
      interpreter: './node_modules/.bin/ts-node',
      node_args: '-r tsconfig-paths/register ./src/index.ts baz',
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        SERVICE_NAME: 'baz',
        SERVICE_PORT: 5002,
      },
    },
  ],
};
