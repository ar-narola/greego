var express = require('express');
var router = express.Router();

var category = require('./admin/category');
var auth = require('./../middelwares/auth');
var authorization = require('./../middelwares/authorization');

router.use('/category',auth, authorization, category);

module.exports = router;