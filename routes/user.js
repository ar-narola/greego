var express = require('express');
var router = express.Router();

var index = require('./user/index');
var card = require('./user/card');
var auth = require('./../middelwares/auth');
var authorization = require('./../middelwares/authorization');

router.use('/',auth, authorization, index);
router.use('/card',auth, authorization, card);


module.exports = router;