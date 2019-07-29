# Maprox Observer Is-Packet-In-Geofence Job

## Requirements

* [Node.JS](https://nodejs.org)
* Some AMQP server (tested only with [RabbitMQ](https://www.rabbitmq.com),
  but theoretically can work with others)
* [Posgresql](https://www.postgresql.org/) with observer db installed there

## Installation

    git clone https://github.com/maprox/observer-job-geofence-presence.git
    cd observer-job-geofence-presence
    npm install

## Run

    npm start

### Options

* **AMQP_CONNECTION** [*amqp://guest:guest@127.0.0.1//*] - AMQP
    connection string

* **AMQP_EXCHANGE** - exchange name in AMQP server.

* **AMQP_QUEUE_NAME** - AMQP queue name to listen for messages

* **AMQP_QUEUE_ROUTING_KEY** - Routing key for the queue

* **PGHOST**
* **PGDATABASE**
* **PGUSER**
* **PGPASSWORD**


## Description

TBD

---

[![forthebadge](http://forthebadge.com/images/badges/powered-by-electricity.svg)](http://forthebadge.com)
[![forthebadge](http://forthebadge.com/images/badges/fuck-it-ship-it.svg)](http://forthebadge.com)