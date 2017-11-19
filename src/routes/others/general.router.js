var express = require('express');
var router = express.Router();

import FunctionsCtrl from './../../application/modules/REST/common/functions/functions.controller.js';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SkyHub 2 REST - Backend' });
});

router.get('/zzz', function(req, res, next) {

    res.json(FunctionsCtrl.getZZZ());
});

module.exports = router;
