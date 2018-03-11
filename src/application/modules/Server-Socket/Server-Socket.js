/**
 * Created by ERAZER-ALEX on 5/5/2017.
 */

/**
 * Create SOCKET IO Server
 */

import constants from 'bin/constants'
import {initializeRoutesServerSocket} from 'src/routes/index.routes'

const socketIo = require('socket.io');

var serverSocket = null;

let createSocketServer = (server) => {

    console.log('===> Creating SOCKET SERVER');

    // Initialize socket.io
    serverSocket = socketIo.listen(server);

    console.log("===> STARTING SOCKET SERVER");

    serverSocket.set('transports',[
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling',
        'polling'
    ]);

    serverSocket.use( (socket, next) => {
        next();
    });

    serverSocket.on("connection", (socket) => {

        console.log("A new client connected");
        //console.log(socket.request);


        socket.on("api/message", (data) => {
            console.log('received' + data);
        });

        // initialize routes for socket
        initializeRoutesServerSocket(socket);

        socket.emit('api/connectionReady', 'HELLO WORLD');

        socket.on("disconnect", () => {
            console.log("One of the client disconnected");
        });

    });
};

export{
    serverSocket,
    createSocketServer
};