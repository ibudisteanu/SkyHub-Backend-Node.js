var express = require('express');
var router = express.Router();
var Promise = require('promise');

var AuthenticateCtrl = require ('../auth/Authenticate.controller.ts');
var FunctionsCtrl = require ('./../common/functions/functions.controller.ts');

var AuthenticatedUser = require('../auth/models/AuthenticatedUser.model.js');

var ForumsCtrl = require ('../forums/forums/Forums.controller.ts');

//import {AuthenticateCtrl} from '../auth/authenticate.controller.ts';
//import {FunctionsCtrl} from '../functions/functions.controller.ts';

router.get('/auth/login', function(req, res, next) {

    AuthenticateCtrl.postAuthenticateLogin(req, res).then ((answer) =>{
        res.json(answer);
    });
});

router.get('/auth/register', function(req, res, next) {
    AuthenticateCtrl.postAuthenticateRegister(req, '').then ( (answer ) => {
        res.json(answer);
    });

});

router.get('/version', function(req, res, next) {
    res.json( FunctionsCtrl.getVersion(req, res) );
});

router.get('/profile', function (req, res, next){
    res.json( {message: 'Great! You are logged in' });
});


/*
            FOR SOCKET REST
 */


router.processSocketRoute = function (socket)
{
    var UserAuthenticated = AuthenticatedUser.loginUserFromSocket(socket);

    socket.on("api/auth/login", function (data){
        data.body = data;

        AuthenticateCtrl.postAuthenticateLogin(data, '').then ( (res ) => {

            socket.bAuthenticated = false; socket.userAuthenticated = null;
            if (res.result == "true"){
                socket.bAuthenticated = true;
                socket.userAuthenticated = jwt.verify(res.token, constants.SESSION_Secret_key);
            }

            socket.emit("api/auth/login", res);
        });
    });

    socket.on("api/auth/login-token", function (data){
        data.body = data;

        AuthenticateCtrl.postAuthenticateTokenAsync(data, '').then ((answer)=>{

            socket.bAuthenticated = false; socket.userAuthenticated = null;
            if (answer.result == "true"){
                socket.bAuthenticated = true;
                socket.userAuthenticated = answer.user;
            }

            socket.emit("api/auth/login-token", answer);

        });
    });

    socket.on("api/auth/register", function (data){
        data.body = data;

        AuthenticateCtrl.postAuthenticateRegister(data, '').then ( (res ) => {

            socket.emit("api/auth/register", res);
        });

    });

    socket.on("api/auth/register-oauth", function (data){
        data.body = data;

        AuthenticateCtrl.postAuthenticateRegisterOAuth(data, '').then ( (res ) => {

            socket.emit("api/auth/register-oauth", res);
        });

    });


    socket.on("api/version", function (data){
        socket.emit("api/version",FunctionsCtrl.getVersion(data, ''));

        console.log("Sending Version...")
    });


    socket.on("api/forums/add", function (data){
        data.body = data;

        ForumsCtrl.postAddForum(data, '').then ( (res ) => {
            socket.emit("api/forums/add", res);
        });

    });


};





router.getAPIRoutes = function (sRoutePrefix) {

    if (typeof sRoutePrefix === 'undefined')  sRoutePrefix = 'api';

    var arrResult = [];
    router.stack.forEach(function(r){
        if (r.route && r.route.path){

            var sRoute = sRoutePrefix+r.route.path;

            if (sRoute[1] === '/')sRoute.substring(1);

            arrResult.push(sRoute);
            console.log(sRoute)
        }
    });

    return arrResult;
};


// function authenticationMiddleware () {
//     return function (req, res, next) {
//         passport = require ('passport');
//         if (passport.isAuthenticated()) {
//             return next()
//         }
//         return res.json( { error : "You don't have enough privileges"} );
//     }
// }


module.exports = router;