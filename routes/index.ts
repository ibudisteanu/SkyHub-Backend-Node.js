var express = require('express');
var router = express.Router();

var Functions =  require('./../application/modules/REST/functions/functions.controller.ts');
//import {Functions} from './../application/modules/REST/functions/functions.controller.ts';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SkyHub 2 REST - Backend' });
});

router.get('/zzz', function(req, res, next) {

    res.json(Functions.getZZZ());
});

module.exports = router;
