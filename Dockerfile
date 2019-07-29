FROM node:latest

MAINTAINER Alexander Y Lyapko sunsay@maprox.net

RUN mkdir -p /opt/observer-job-geofence-presence
COPY . /opt/observer-job-geofence-presence
WORKDIR /opt/observer-job-geofence-presence

RUN npm install

CMD [ "npm", "start" ]