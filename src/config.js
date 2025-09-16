module.exports = {
  /**
   * AMQP connection parameters
   * Currently tested and supported only RabbitMQ server
   *
   * @type {Object}
   */
  amqp: {
    host: process.env.AMQP_HOST || '127.0.0.1',
    port: process.env.AMQP_PORT || '5672',
    username: process.env.AMQP_USERNAME || 'guest',
    password: process.env.AMQP_PASSWORD || 'guest',
    exchange: process.env.AMQP_EXCHANGE,
    messagesCountLimit: process.env.AMQP_MESSAGES_COUNT_LIMIT,
    queue: {
      name: process.env.AMQP_QUEUE_NAME,
      routingKey: process.env.AMQP_QUEUE_ROUTING_KEY,
    },
    outbound: {
      exchange: process.env.AMQP_OUTBOUND_EXCHANGE,
      routingKey: process.env.AMQP_OUTBOUND_ROUTING_KEY,
    },
  },

  query: {
    limit: process.env.QUERY_LIMIT,
    offset: process.env.QUERY_OFFSET,
  },
};
