const db = require('../database/database.service');
const config = require('../../config');
const Geofence = require('../../model/geofence');

const UPDATE_EACH = 60; // in seconds

class GeofenceLoader {
  constructor(database, limit, offset) {
    this.db = database;
    this.limit = limit;
    this.offset = offset;
  }

  init() {
    setInterval(() => this.update(), UPDATE_EACH * 1000);
    return this.update();
  }

  async update() {
    this.list = await this.getGeofences(this.limit, this.offset);
    console.log('geofence list has %s items', this.list.length);
    return this.list;
  }

  async load() {
    return this.list || this.init();
  }

  async getGeofences(limit, offset) {
    const res = limit
      ? await this.db.query(
        `
          select id, state, coords_cache
          from mon_geofence
          where state = 1
            and coords_cache is not null
          order by id
          limit $1
          offset $2
        `,
        [limit, offset || 0],
      )
      : await this.db.query(
        `
          select id, state, coords_cache
          from mon_geofence
          where state = 1
            and coords_cache is not null
          order by id
        `,
      );

    return res.rows.map(row => Geofence.getInstance(row));
  }
}

module.exports = new GeofenceLoader(
  db,
  config.query.limit,
  config.query.offset,
);
