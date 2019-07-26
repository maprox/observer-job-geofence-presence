const db = require('../database/database.service');
const config = require('../../config');
const Geofence = require('../../model/geofence');

// const UPDATE_INTERVAL = 10000;

async function getGeofences(limit, offset) {
  const res = limit
    ? await db.query(
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
    : await db.query(
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

class GeofenceList {
  constructor(limit, offset) {
    this.limit = limit;
    this.offset = offset;
  }

  init() {
    return this.update();
    // setInterval(() => this.update(), UPDATE_INTERVAL);
  }

  async update() {
    // get new geofences from db
    this.list = await getGeofences(this.limit, this.offset);
    // if (this.list.length >= this.limit) {
    //   // stop update interval
    //   // spawn new instance of the job
    // }
    console.log('geofence list has %s items', this.list.length);
    return this.list;
  }

  async load() {
    return this.list || this.init();
  }
}

module.exports = new GeofenceList(
  config.query.limit,
  config.query.offset,
);
