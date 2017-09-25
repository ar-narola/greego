var express = require('express');
var router = express.Router();

var config = require('../../config');
var user_helper = require("../../helpers/user_helper");

/**
 * @api {get} /user/car Assigned car of user
 * @apiName Assigned car of user
 * @apiGroup User-car
 * 
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiSuccess (Success 200) {String} car List of car.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/',function(req,res){
    user_helper.find_car_by_user_id(req.userInfo.id,function(car_data){
        if(car_data.status === 0){
            res.status(config.INTERNAL_SERVER_ERROR).json({"message":"Error occur in fetching car details of user"});
        } else if(car_data.status === 404){
            res.status(config.BAD_REQUEST).json({"message":"No car available for user"});
        } else {
            res.status(config.OK_STATUS).json({"car":car_data.car});
        }
    });
});

module.exports = router;