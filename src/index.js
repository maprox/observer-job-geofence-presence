const broker = require('./services/broker/broker.service');
const config = require('./config');
const dumpError = require('./utils');
const job = require('./job');

broker.receive(config.amqp.queue, async (data, message, channel) => {
  try {
    console.log('received', data);

    await job.handle(data);

    await broker.send(
      config.amqp.outbound.exchange,
      config.amqp.outbound.routingKey,
      data,
    );

    console.log('sent', data);
    channel.ack(message);
  } catch (e) {
    dumpError(e);
  }
});
