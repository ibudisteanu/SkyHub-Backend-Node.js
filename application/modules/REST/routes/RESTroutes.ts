var express = require('express');
var router = express.Router();
var Promise = require('promise');

router.get('/auth/login', function(req, res, next) {
    var authCtrl = require('./../auth/auth.controller.ts');
    authCtrl.postAuthenticateLogin(req, res).then ((answer) =>{
        console.log(answer);     console.log(answer);
        res.json(answer);
    });
});

router.get('/auth/register', function(req, res, next) {
    var authCtrl = require('./../auth/auth.controller.ts');

    authCtrl.postAuthenticateRegister(req, '').then ( (answer ) => {
        res.json(answer);
    });

});

router.get('/version', function(req, res, next) {
    var testCtrl = require('./../test/test.controller.ts');
    res.json(testCtrl.getVersion(req, res));
});


/*
            FOR SOCKET REST
 */


router.processSocketRoute = function (socket)
{
    var authCtrl = require('./../auth/auth.controller.ts');

    socket.on("api/auth/login", function (data){
        data.body = data;

        authCtrl.postAuthenticateLogin(data, '').then ( (res ) => {
            socket.emit("api/auth/login", res);
        });
    });

    socket.on("api/auth/register", function (data){
        data.body = data;

        authCtrl.postAuthenticateRegister(data, '').then ( (res ) => {
            socket.emit("api/auth/register", res);
        });

    });

    var testCtrl = require('./../test/test.controller.ts');
    socket.on("api/version", function (data){
        socket.emit("api/version",testCtrl.getVersion(data, ''));

        console.log("Sending Version...")
    });
};





router.getAPIRoutes = function (sRoutePrefix) {

    if (typeof sRoutePrefix === 'undefined')  sRoutePrefix = 'api';

    arrResult = [];
    router.stack.forEach(function(r){
        if (r.route && r.route.path){

            var sRoute = sRoutePrefix+r.route.path;

            if (sRoute[1] === '/')sRoute.substring(1);

            arrResult.push(sRoute);
            console.log(sRoute)
        }
    });

    return arrResult;
}


module.exports = router;