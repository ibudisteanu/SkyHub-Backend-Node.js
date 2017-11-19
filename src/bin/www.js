
/**
 #!/usr/bin/env node

 * Module dependencies.
 */

import constants from './constants';

if((typeof window !== 'undefined' && !window._babelPolyfill) ||
    (typeof global !== 'undefined' && !global._babelPolyfill)) {
    require('babel-polyfill')
}

var app = require('../app');
var debug = require('debug')('express:server');
var http = require('http');

//FOR TESTING ONLY
//var redis = require('./../application/modules/DB/redis_test.js');

//JugglingDB it's NOT working
//var redis = require ('./../application/modules/DB/redisJugglingDB');

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Get port from environment and store in Express.
 */

//var port = normalizePort(process.env.PORT || '4000');
var port = normalizePort(constants.APP_PORT);
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//server.listen(normalizePort(process.env.PORT || '4000'), "127.0.0.1");

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

server.listen(port, function(){
  console.log('listening on *:'+port);
});

/*
    SOCKET IO SERVER
 */

console.log("IMPORTING serverSocket");
serverSocket = require('../application/modules/socketServer/socketServer.controller.js');
serverSocket = serverSocket.serverSocket;