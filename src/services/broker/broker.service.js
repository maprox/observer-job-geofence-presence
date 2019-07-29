const amqp = require('amqplib');
const config = require('../../config');

const getExchangeName = () => config.amqp.exchange;
const getExchange = channel => channel.assertExchange(
  getExchangeName(),
  'topic',
  { durable: true },
);

let channelInstance;

async function getChannel() {
  if (!channelInstance) {
    console.log(' [-] Connecting to %s', config.amqp.connection);
    const connection = await amqp.connect(config.amqp.connection);
    channelInstance = await connection.createChannel();
    console.log(' [+] Connected');
    await getExchange(channelInstance);
  }

  return channelInstance;
}

module.exports = {
  /**
   * Waiting for data
   *
   * @param {Object} queueData
   * @param {Function} callback
   */
  async receive(queueData, callback) {
    const channel = await getChannel();
    const qok = await channel.assertQueue(
      queueData.name,
      queueData.options || { durable: true },
    );
    const { queue } = await channel.bindQueue(
      qok.queue,
      getExchangeName(),
      qok.queue.routingKey,
    );

    console.log(' [+] Awaiting for data...');

    return channel.consume(queue, (message) => {
      try {
        const data = JSON.parse(message.content.toString());
        callback(data, message, channel);
      } catch (e) {
        channel.ack(message);
        console.error(message.content.toString(), e);
      }
    });
  },

  /**
   * Sends a message to AMQP
   *
   * @param {string} exchange
   * @param {string} routingKey
   * @param {Object} data
   * @return {Promise}
   */
  async send(exchange, routingKey, data) {
    (await getChannel()).publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(data)),
      {
        contentType: 'application/json',
        timestamp: new Date().getTime(),
      },
    );

    console.log(' [>] Sent %s to %s', data, routingKey);
  },
};
