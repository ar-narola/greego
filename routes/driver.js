var express = require('express');
var router = express.Router();

var index = require('./driver/index');
var trip = require('./driver/trip');
var auth = require('./../middelwares/auth');
var authorization = require('./../middelwares/authorization');

router.use('/',auth, authorization, index);
router.use('/trip',auth, authorization, trip);

module.exports = router;