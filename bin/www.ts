#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('express:server');
var http = require('http');

//FOR TESTING ONLY
//var redis = require('./../application/modules/DB/redis_test.js');

//JugglingDB no working
//var redis = require ('./../application/modules/DB/redisJugglingDB');

var redis = require ('./../application/modules/DB/redis_nohm');

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//server.listen(normalizePort(process.env.PORT || '3000'), "127.0.0.1");

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

/**
 * Create SOCKET IO.
 */

var socketIo = require('socket.io');
var serverSocket = socketIo.listen(server);

var RESTRouter = require('./../application/modules/REST/routes/RESTroutes.ts');

serverSocket.on("connection", function(socket){
  console.log("A new client connected");

  var news = [
      { title: 'The cure of the Sadness is to play Videogames',date:'04.10.2016'},
      { title: 'Batman saves Racoon City, the Joker is infected once again',date:'05.10.2016'},
      { title: "Deadpool doesn't want to do a third part of the franchise",date:'05.10.2016'},
      { title: 'Quicksilver demand Warner Bros. due to plagiarism with Speedy Gonzales',date:'04.10.2016'},
  ];

  console.log('sending news');
  socket.emit('api/news', news);

  socket.on("api/message", function (data) {
      console.log('received'+data);
  });

  RESTRouter.processSocketRoute(socket);

  //Automatically processing the routes
  /*RESTRouter.getAPIRoutes().forEach(function(sRoute){

    socket.on(sRoute, function (data){

         console.log("SOCKET IO - API INSTRUCTION"+data);
         console.log('ROUTE::'+sRoute)

        //  var request = {
        //     url: '/zzz',
        //     method: "POST",
        //  };
        //
        // // stub a Response object with a (relevant) subset of the needed
        // // methods, such as .json(), .status(), .send(), .end(), ...
        // var response = {
        //     json : function(results) {
        //         console.log('Answer from SERVER:::::');
        //         console.log(results);
        //     }
        // };
        //
        // RESTRouter.handle(request, response, function(err) {
        //     console.log('These errors happened during processing: ', err);
        //     console.log(response);
        // });

          app.runMiddleware('http://127.0.0.1:3000/zzz', {method: 'post', body: data}, function (responseCode, body, headers){
              console.log('Answer from SERVER:::::');
              console.log(responseCode);
              console.log(body);
          });

      });

  });
*/

  socket.emit('api/connectionReady', 'HELLO WORLD');

  socket.on("disconnect", function(){
        console.log("One of the client disconnected");
  });


});

