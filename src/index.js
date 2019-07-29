const config = require('./config');
const broker = require('./services/broker/broker.service');
const dumpError = require('./utils');
const geofenceLoader = require('./services/geofence/geofence-loader.service');
const packetLoader = require('./services/packet/packet-loader.service');
const presenceService = require('./services/geofence/presence.service');

broker.receive(config.amqp.queue, async (data, message, channel) => {
  try {
    const packetId = data.id;
    const [packet] = await packetLoader.getPacketById(packetId);
    if (!packet || packet.isDeleted()) {
      channel.ack(message);
      return;
    }

    (await geofenceLoader.load())
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
