const Item = require('./item');

module.exports = class Packet extends Item {
  /**
   * @param {string} [id]
   * @param {number} [state]
   * @param {number} [deviceId]
   * @param {Date} [time]
   * @param {string|number} [latitude]
   * @param {string|number} [longitude]
   */
  constructor(id, state, deviceId, time, latitude, longitude) {
    super(id, state);
    this.deviceId = deviceId;
    this.time = time;
    this.latitude = +latitude;
    this.longitude = +longitude;
  }

  /**
   * @param {{id, state, id_device, time, latitude, longitude}} json
   * @return {module.Packet}
   */
  static getInstance(json) {
    return new Packet(
      json.id,
      json.state,
      json.id_device,
      json.time,
      json.latitude,
      json.longitude,
    );
  }
};
