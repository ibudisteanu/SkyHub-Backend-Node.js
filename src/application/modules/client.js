var app = require('express')();

var server = require('http').Server(app);
var socket = require('socket.io')(server);

import testCtrl from 'application/modules/REST/common/functions/functions.controller';

server.listen(3001);

var fs = require('fs');

app.get('/client', (request, response) => {

    console.log("Connected to /client");

    response.writeHead(200, {"Content-Type" : "text/html"});
    response.write(json(testCtrl.getZZZ()), "utf8");
    response.end();
});