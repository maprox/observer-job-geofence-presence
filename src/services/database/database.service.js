const { Pool } = require('pg');

class DatabaseService {
  /**
   * @param {PG.Pool} pool
   */
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * @param {string} text
   * @param {Object} [params]
   * @param {Function} [callback]
   * @return {Promise}
   */
  query(text, params, callback) {
    return this.pool.query(text, params, callback);
  }
}

module.exports = new DatabaseService(new Pool());
