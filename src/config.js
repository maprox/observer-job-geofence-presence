module.exports = {
  /**
   * AMQP connection string
   * Currently tested and supported only RabbitMQ server
   *
   * @type {*|string}
   */
  amqp: {
    exchange: process.env.AMQP_EXCHANGE,
    connection: process.env.AMQP_CONNECTION || 'amqp://guest:guest@127.0.0.1//',
    queue: {
      name: process.env.AMQP_QUEUE_NAME,
      routingKey: process.env.AMQP_QUEUE_ROUTING_KEY,
    },
  },

  query: {
    limit: process.env.QUERY_LIMIT,
    offset: process.env.QUERY_OFFSET,
  },
};
