FROM node:latest

MAINTAINER Alexander Y Lyapko sunsay@maprox.net

RUN mkdir -p /opt/observer-jobs
COPY . /opt/observer-jobs
WORKDIR /opt/observer-jobs

RUN npm install

CMD [ "npm", "start" ]