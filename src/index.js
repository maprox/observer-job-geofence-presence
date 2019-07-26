const Packet = require('./model/packet');

const config = require('./config');
const broker = require('./services/broker/broker.service');

const db = require('./services/database/database.service');
const presenceService = require('./services/geofence/presence.service');
const geofenceList = require('./services/geofence/geofence-list.service');

async function getPacketById(packetId) {
  const res = await db.query(
    `
      select id, state, id_device, time, latitude, longitude
      from mon_packet
      where id = $1
    `,
    [packetId],
  );

  return res.rows.map(row => Packet.getInstance(row));
}

function dumpError(err) {
  if (typeof err === 'object') {
    if (err.message) {
      console.log(`\nMessage: ${err.message}`);
    }
    if (err.stack) {
      console.log('\nStacktrace:');
      console.log('====================');
      console.log(err.stack);
    }
  } else {
    console.log('dumpError :: argument is not an object');
  }
}

broker.receive(config.amqp.queue, async (data, message, channel) => {
  try {
    const packetId = data.id;
    const [packet] = await getPacketById(packetId);
    if (!packet || packet.isDeleted()) {
      channel.ack(message);
      return;
    }

    (await geofenceList.load())
      .filter(geofence => geofence.isEnabled())
      .forEach(geofence => presenceService.handle(geofence, packet));

    await broker.send(
      'x.notification',
      'notification.process.onpacket',
      data,
    );

    channel.ack(message);
  } catch (e) {
    dumpError(e);
  }
});
