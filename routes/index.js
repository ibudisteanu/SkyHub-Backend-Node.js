var express = require('express');
var router = express.Router();

var Functions =  require('../application/modules/REST/common/functions/functions.controller.js');
//import {FunctionsCtrl} from './../application/modules/REST/functions/functions.controller.js';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SkyHub 2 REST - Backend' });
});

router.get('/zzz', function(req, res, next) {

    res.json(Functions.getZZZ());
});

module.exports = router;
