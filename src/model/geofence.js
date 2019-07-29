const turf = require('@turf/turf');

const Item = require('./item');
const Packet = require('./packet');

module.exports = class Geofence extends Item {
  /**
   * @param {string} [id]
   * @param {number} [state]
   * @param {Packet[]} [packets]
   */
  constructor(id, state, packets) {
    super(id, state);
    this.packets = packets || [];
  }

  /**
   * @param {Packet} packet
   * @return {boolean}
   */
  isPacketInside(packet) {
    const polygon = turf.polygon([this.packets.map(p => [p.latitude, p.longitude])]);
    const point = turf.point([packet.latitude, packet.longitude]);

    return turf.booleanPointInPolygon(point, polygon);
  }

  /**
   * @param {{id, state, coords_cache}} json
   * @return {module.Geofence}
   */
  static getInstance(json) {
    const packets = (!json || !json.coords_cache) ? [] : json.coords_cache
      .split(', ')
      .map((coords) => {
        const [longitude, latitude] = coords.split(' ');
        return new Packet(
          undefined,
          undefined,
          undefined,
          undefined,
          latitude,
          longitude,
        );
      });

    return new Geofence(json.id, json.state, packets);
  }
};
