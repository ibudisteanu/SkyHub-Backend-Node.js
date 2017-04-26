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



router.getAPIRoutes = function () {
    arrResult = [];
    router.stack.forEach(function(r){
        if (r.route && r.route.path){
            arrResult.push(r.route.path);
            console.log(r.route.path)
        }
    });

    return arrResult;
}


module.exports = router;