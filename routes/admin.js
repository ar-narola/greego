var express = require('express');
var router = express.Router();

var category = require('./admin/category');
var faq = require('./admin/faq');
var auth = require('./../middelwares/auth');
var authorization = require('./../middelwares/authorization');

router.use('/category',auth, authorization, category);
router.use('/faq',auth, authorization, faq);

module.exports = router;