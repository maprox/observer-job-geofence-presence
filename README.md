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

## Test

    npm run eslint && npm test

## Description

1. This job listens for new packets coming from the Message Broker
 (RabbitMQ in our case) in form of


    {
      "id": 290129,
    }

where `290129` in the example above is a packet id which has been recently
received and added to the observer database.

2. When such packet received, the job loads all available geofences
**(should be refactored when number of geofences exceeds 10,000)** and

3. Over each geofence it checks if the packet is in or not, and updates database records accordingly.

4. Finally it sends original message to notification channel (to proceed with geofence entrance/leaving notifications).


    {
      "id": 290129,
    }

### Environment variables

* **AMQP_CONNECTION** [*amqp://guest:guest@127.0.0.1//*] - AMQP
    connection string
* **AMQP_EXCHANGE** - exchange name in AMQP server.
* **AMQP_QUEUE_NAME** - AMQP queue name to listen for messages
* **AMQP_QUEUE_ROUTING_KEY** - Routing key for the queue
* **AMQP_NOTIFICATION_EXCHANGE** - AMQP exchange for sending notifications
* **AMQP_NOTIFICATION_ROUTING_KEY** - Routing key for sending notifications
* **AMQP_MESSAGES_COUNT_LIMIT** - Limit messages count consumed by the channel at once
* **PGHOST** - Postgres host
* **PGDATABASE** - Postgres database
* **PGUSER** - Postgres username
* **PGPASSWORD** - Postgres password

---

[![forthebadge](http://forthebadge.com/images/badges/powered-by-electricity.svg)](http://forthebadge.com)
[![forthebadge](http://forthebadge.com/images/badges/fuck-it-ship-it.svg)](http://forthebadge.com)