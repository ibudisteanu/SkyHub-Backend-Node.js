/**
 * Created by ERAZER-ALEX on 5/5/2017.
 */

/**
 * Create SOCKET IO.
 */

console.log('===> Creating SOCKET SERVER');

// Initialize socket.io
var socketIo = require('socket.io');
var serverSocket = socketIo.listen(server);


var RESTRouter = require('./../../../application/modules/REST/routes/RESTroutes.ts');
var indexRouter = require('./../../../routes/index.ts');
var usersRouter = require('./../../../routes/users.ts');

// serverSocket.use('/', indexRouter);
// serverSocket.use('/api', RESTRouter);
// serverSocket.use('/users', usersRouter);

serverSocket.set('transports',[
    'websocket',
    'flashsocket',
    'htmlfile',
    'xhr-polling',
    'jsonp-polling',
    'polling'
]);


// serverSocket.use(passportSocketIoRedis.authorize({
//     //cookieParser: cookieParser,   // the name of the cookie where express/connect stores its session_id
//     cookieParser: require('cookie-parser'), //optional your cookie-parser middleware function. Defaults to require('cookie-parser')
//     passport: passport,
//     //key:         'connect.sid',
//     key:         'express.sid',
//     secret:      constants.SESSION_Secret_key,
//     store:       sessionStore, //you need to use the same sessionStore you defined in the app.use(session({... in app.js
//     success:     authorizeSuccess,  // *optional* callback on success - read more below
//     fail:        authorizeFail     // *optional* callback on fail/error - read more below
// }));
//
// console.log('==> PASSPORT SOCKET SERVER');
//
// function authorizeSuccess(data, accept)
// {
//     console.log('Authorized success');
//     accept();
// }
//
// function authorizeFail(data, message, error, accept)
// {
//     console.log('Authorized failed: '+message);
//
//     if(error)
//         accept(new Error(message));
// }

// serverSocket.use(socketJWToken.authorize({
//     secret: constants.SESSION_Secret_key,
//     handshake: true,
//     callback: true,
// }));

serverSocket.use( function(socket, next){
    console.log("Query: ", socket.handshake.query.token);

    var token = socket.handshake.query.token;

    var userAuthenticated = null;

    console.log('processing token....');

    socket.bAuthenticated = false;
    socket.userAuthenticated = null;
    try{
        userAuthenticated = jwt.verify(token, constants.SESSION_Secret_key);

        socket.bAuthenticated = true;
        socket.userAuthenticated = userAuthenticated;
    } catch (err){
    }

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


    RESTRouter.processSocketRoute(socket);

    //Automatically processing the routes
/*
    RESTRouter.getAPIRoutes().forEach(function(sRoute){

        socket.on(sRoute, function (data){

            console.log("SOCKET IO - API INSTRUCTION "+data);
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

            app.runMiddleware('http://127.0.0.1:4000/zzz', {method: 'post', body: data}, function (responseCode, body, headers){
                console.log('Answer from SERVER:::::');
                console.log(responseCode);
                console.log(body);
            });

        });

    });
*/


    socket.emit('api/connectionReady', 'HELLO WORLD');

    socket.on("disconnect", function () {
        console.log("One of the client disconnected");
    });


});

module.exports = {

    serverSocket : serverSocket,

};