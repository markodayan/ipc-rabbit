# Asynchronous Service Communication via RabbitMQ

> Facilitate distributed system state transitions via RabbitMQ messaging

We have 3 services named `foo`, `bar`, and `baz`. We would like to spin them up in a specific order to mimic inter-service dependency, the order is depicted below

```haskell
foo -> bar -> baz
```

<br>

- We will make use of <b>RabbitMQ</b> and message queues to manage inter-process communication.
- We will run the services (`foo`, `bar`, `baz`) using the <b>PM2 process manager</b>.
  - Each service is running its own express server.
- We will make use of <b>Docker Compose</b> to spin up a <b>RabbitMQ server</b> container as well as an application container to host our 3 services.

Running the project will yield the simple outcome above, where <b><u>the express apps start in the correct logical order guided by asynchronous IPC</u></b>. This is just a demo of basic functionality of asynchronous messaging.

To test it out, install the dependencies, make sure you have Docker, then simply run:

```bash
npm run compose
```
