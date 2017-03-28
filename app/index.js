'use strict';
const config = require('./config');

// create an IO server instance
let ioServer = app => {
  app.locals.devices = [];
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  io.set('transports', ['websocket']);
  io.use((socket, next) => {
    require('./session')(socket.request, {}, next);
  });
  require('./socket')(io, app);
  return server;
}

module.exports = {
  session: require('./session'),
  ioServer
}
