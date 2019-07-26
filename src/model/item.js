const STATE_ACTIVE = 1;
const STATE_DELETED = 3;

module.exports = class Item {
  /**
   * @param {string} [id]
   * @param {number} [state]
   */
  constructor(id, state) {
    this.id = id;
    this.state = state;
  }

  /**
   * @return {boolean}
   */
  isEnabled() {
    return this.state === STATE_ACTIVE;
  }

  /**
   * @return {boolean}
   */
  isDeleted() {
    return this.state === STATE_DELETED;
  }
};
