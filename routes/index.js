var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/zzz', function(req, res, next) {
    var testCtrl = require('./../application/modules/test/testController.js');

    res.json(testCtrl.getZZZ());
});

module.exports = router;
