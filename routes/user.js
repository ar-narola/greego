var express = require('express');
var router = express.Router();

var index = require('./user/index');
var car = require('./user/car');
var card = require('./user/card');
var auth = require('./../middelwares/auth');
var authorization = require('./../middelwares/authorization');

router.use('/',auth, authorization, index);
router.use('/car',auth, authorization, car);
router.use('/card',auth, authorization, card);


module.exports = router;