const broker = require('./services/broker/broker.service');
const config = require('./config');
const dumpError = require('./utils');
const job = require('./job');

broker.receive(config.amqp.queue, async (data, message, channel) => {
  try {
    await job.handle(data);

    await broker.send(
      config.amqp.notification.exchange,
      config.amqp.notification.routingKey,
      data,
    );

    channel.ack(message);
  } catch (e) {
    dumpError(e);
  }
});
