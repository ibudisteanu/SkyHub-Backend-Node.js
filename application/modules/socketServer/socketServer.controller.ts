/**
 * Created by ERAZER-ALEX on 5/5/2017.
 */

/**
 * Create SOCKET IO.
 */

RESTRouter = require('./../REST/routes/RESTroutes.ts');

socketIo = require('socket.io');
serverSocket = socketIo.listen(server);

serverSocket.on("connection", function (socket) {
    console.log("A new client connected");

    var news = [
        {title: 'The cure of the Sadness is to play Videogames', date: '04.10.2016'},
        {title: 'Batman saves Racoon City, the Joker is infected once again', date: '05.10.2016'},
        {title: "Deadpool doesn't want to do a third part of the franchise", date: '05.10.2016'},
        {title: 'Quicksilver demand Warner Bros. due to plagiarism with Speedy Gonzales', date: '04.10.2016'},
    ];

    console.log('sending news');
    socket.emit('api/news', news);

    socket.on("api/message", function (data) {
        console.log('received' + data);
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

    socket.on("disconnect", function () {
        console.log("One of the client disconnected");
    });


});

module.exports = {

    serverSocket : serverSocket,

};