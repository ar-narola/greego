var express = require('express');
var router = express.Router();

var index = require('./driver/index');
var auth = require('./../middelwares/auth');
var authorization = require('./../middelwares/authorization');

router.use('/',auth, authorization, index);

module.exports = router;