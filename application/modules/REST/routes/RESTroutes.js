var express = require('express');
var router = express.Router();

router.get('/auth/login', function(req, res, next) {
    var authCtrl = require('./../auth/auth.controller.ts');
    res.json(authCtrl.postAuthenticateLogin(req, res));
});

router.get('/auth/register', function(req, res, next) {
    var authCtrl = require('./../auth/auth.controller.ts');
    res.json(authCtrl.postAuthenticateRegister(req, res));
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
        console.log(data);
        socket.emit("api/auth/login",authCtrl.postAuthenticateLogin(data, ''));
    });

    socket.on("api/auth/register", function (data){
        data.body = data;
        socket.emit("api/auth/register",authCtrl.postAuthenticateRegister(data, ''));
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

            sRoute = sRoutePrefix+r.route.path;

            if (sRoute[1] === '/')sRoute.substring(1);

            arrResult.push(sRoute);
            console.log(sRoute)
        }
    });

    return arrResult;
}


module.exports = router;