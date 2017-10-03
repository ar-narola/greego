var express = require('express');
var router = express.Router();

var config = require('../../config');
var notification_helper = require("../../helpers/notification_helper");

/**
 * @api {get} /user/notification Get notification
 * @apiName Get notification
 * @apiGroup User-notification
 * 
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiSuccess (Success 200) {String} message Success message.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/', function (req, res) {
    notification_helper.get_notification_by_to_id(req.userInfo.id,function(notification_data){
        if(notification_data.status === 0){
            res.status(config.INTERNAL_SERVER_ERROR).json({"message":"There was an issue in removing card"});
        } else if(notification_data.status === 404) {
            res.status(config.OK_STATUS).json({"message":"No notification found"});
        } else {
            res.status(config.OK_STATUS).json({"notification":notification_data.notification});
        }
    })
});


module.exports = router;