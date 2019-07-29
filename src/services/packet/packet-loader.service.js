const db = require('../database/database.service');
const Packet = require('../../model/packet');

class PacketLoader {
  constructor(database) {
    this.db = database;
  }

  async getPacketById(packetId) {
    const res = await this.db.query(
      `
        select id, state, id_device, time, latitude, longitude
        from mon_packet
        where id = $1
      `,
      [packetId],
    );

    return res.rows.map(row => Packet.getInstance(row));
  }
}

module.exports = new PacketLoader(db);
