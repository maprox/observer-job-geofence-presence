const geofenceLoader = require('./services/geofence/geofence-loader.service');
const packetLoader = require('./services/packet/packet-loader.service');
const presenceService = require('./services/geofence/presence.service');

class Job {
  constructor(
    packetLoaderInstance,
    presenceServiceInstance,
    geofenceLoaderInstance,
  ) {
    this.packetLoader = packetLoaderInstance;
    this.presenceService = presenceServiceInstance;
    this.geofenceLoader = geofenceLoaderInstance;
  }

  /**
   * @param {{id: number}} data
   * @return {Promise<boolean>}
   */
  async handle(data) {
    const packetId = data.id;
    console.log(' ~ loading packet %s', packetId);
    const [packet] = await this.packetLoader.getPacketById(packetId);
    if (!packet || packet.isDeleted()) {
      console.log('[!] packet is not found or deleted');
      return true;
    }

    console.log(' ~ loading geofence list');
    (await this.geofenceLoader.load())
      .filter(geofence => geofence.isEnabled())
      .forEach(geofence => this.presenceService.handle(geofence, packet));

    return true;
  }
}

module.exports = new Job(
  packetLoader,
  presenceService,
  geofenceLoader,
);
