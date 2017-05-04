var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SkyHub 2 REST - Backend' });
});

router.get('/zzz', function(req, res, next) {
    var testCtrl = require('./../application/modules/REST/test/test.controller.ts');

    res.json(testCtrl.getZZZ());
});

module.exports = router;
