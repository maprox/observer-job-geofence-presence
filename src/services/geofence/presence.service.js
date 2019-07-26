const db = require('../database/database.service');

async function getGeofencePresence(geofenceId, deviceId, time, edt) {
  const prevState = db.query(
    `
      select * from mon_geofence_presence
      where id_geofence = $1
        and id_device = $2
        and sdt <= $3
      order by sdt desc
      limit 1
    `,
    [geofenceId, deviceId, time.toISOString()],
  );

  const nextStates = edt
    ? db.query(
      `
        select * from mon_geofence_presence
        where id_geofence = $1
          and id_device = $2
          and sdt > $3 and sdt < $4
        order by sdt desc
      `,
      [geofenceId, deviceId, time.toISOString(), edt.toISOString()],
    )
    : db.query(
      `
        select * from mon_geofence_presence
        where id_geofence = $1
          and id_device = $2
          and sdt > $3
        order by sdt desc
      `,
      [geofenceId, deviceId, time.toISOString()],
    );

  return [].concat(
    (await nextStates).rows,
    (await prevState).rows,
  );
}

async function insertPresence(geofenceId, deviceId, state, time) {
  const res = await db.query(
    `
      insert into mon_geofence_presence (id_geofence, id_device, state, sdt)
      values ($1, $2, $3, $4)
      returning id
    `,
    [geofenceId, deviceId, state, time.toISOString()],
  );

  const [{ id }] = res.rows;
  return id;
}

async function updatePresence(id, time) {
  return db.query(
    `
      update mon_geofence_presence
      set sdt = $2
      where id = $1
    `,
    [id, time.toISOString()],
  );
}

class PresenceService {
  constructor() {
    this.states = {};
  }

  /**
   * @param {Geofence} geofence
   * @param {Packet} packet
   * @return {Array}
   */
  async getPresenceList(geofence, packet) {
    this.states[geofence.id] = this.states[geofence.id] || {};
    this.states[geofence.id][packet.deviceId] = this.states[geofence.id][packet.deviceId] || [];

    const list = this.states[geofence.id][packet.deviceId];
    const prevState = list.find(row => row.sdt < packet.time);
    if (!prevState) {
      const lastState = list.length && list[list.length - 1];
      const rows = await getGeofencePresence(
        geofence.id,
        packet.deviceId,
        packet.time,
        lastState && lastState.sdt,
      );
      this.states[geofence.id][packet.deviceId] = list.concat(rows);
    }

    return this.states[geofence.id][packet.deviceId];
  }

  /**
   * @param {Geofence} geofence
   * @param {Packet} packet
   * @return {Promise}
   */
  async handle(geofence, packet) {
    const presenceList = await this.getPresenceList(geofence, packet);
    const prevStateIndex = presenceList.findIndex(row => row.sdt < packet.time);
    const prevState = presenceList[prevStateIndex] || {};
    const isInside = geofence.isPacketInside(packet);
    const wasInside = !!prevState.state;
    if (prevState.state !== undefined && isInside === wasInside) {
      return;
    }

    const nextState = presenceList[prevStateIndex - 1] || {};
    if (nextState.state === undefined) {
      const id = await insertPresence(
        geofence.id,
        packet.deviceId,
        isInside ? 1 : 0,
        packet.time,
      );
      presenceList.unshift({
        id,
        id_geofence: geofence.id,
        id_device: packet.deviceId,
        state: isInside,
        sdt: packet.time,
      });
    } else {
      await updatePresence(nextState.id, packet.time);
      nextState.sdt = packet.time;
    }
  }
}

module.exports = new PresenceService();
