/**
 * Created by ERAZER-ALEX on 5/5/2017.
 */

/**
 * Create SOCKET IO.
 */

import constants from 'bin/constants'
import {initializeRoutesServerSocket} from 'src/routes/index.routes'

const socketIo = require('socket.io');

var serverSocket = null;

function createSocketServer(server){
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

        /*
        USING TOKEN authentication
        console.log("Query: ", socket.handshake.query.token);

        var token = socket.handshake.query.token;

        var userAuthenticated = null;

        console.log('processing token....');

        socket.bAuthenticated = false;
        socket.userAuthenticated = null;
        try{
            userAuthenticated = jwt.verify(token, constants.SESSION_SECRET_KEY);

            socket.bAuthenticated = true;
            socket.userAuthenticated = userAuthenticated;
        } catch (err){
        }
        */

        next();
    });

    serverSocket.on("connection", function (socket) {

        console.log("A new client connected");
        //console.log(socket.request);

        //I will send some dummy data
        var news = [
            {title: 'The cure of the Sadness is to play Videogames', date: '04.10.2016'},
            {title: 'Batman saves Racoon City, the Joker is infected once again', date: '05.10.2016'},
        ];

        console.log('sending news');
        socket.emit('api/news', news);

        socket.on("api/message", function (data) {
            console.log('received' + data);
        });


        console.log('hello! ', socket.bAuthenticated , "   ", socket.userAuthenticated) ;

        // initialize routes for socket
        initializeRoutesServerSocket(socket);

        socket.emit('api/connectionReady', 'HELLO WORLD');

        socket.on("disconnect", function () {
            console.log("One of the client disconnected");
        });


    });
}

module.exports = {
    serverSocket : serverSocket,
    createSocketServer: createSocketServer,
};