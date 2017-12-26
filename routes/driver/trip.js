var express = require('express');
var router = express.Router();

var async = require('async');

var config = require('../../config');
var trip_helper = require("../../helpers/trip_helper");
var user_helper = require("../../helpers/user_helper");

/**
 * @api {get} /driver/trip/history Get driver's past trip
 * @apiName Get driver's past trip
 * @apiGroup Driver-trip
 * 
 * @apiHeader {String}  x-access-token Driver's unique access-key
 * 
 * @apiSuccess (Success 200) {Array} trip Array of trip's document
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/history', function (req, res) {
    trip_helper.get_trips_by_driver_id(req.driverInfo.id,function(trip_data){
        if(trip_data.status === 0){
            res.status(config.INTERNAL_SERVER_ERROR).json({"message":"There was an issue in finding trips"});
        } else if(trip_data.status === 404) {
            res.status(config.OK_STATUS).json({"message":"No trip found"});
        } else {
            res.status(config.OK_STATUS).json({"trip":trip_data.trip});
        }
    });
});

/**
 * @api {post} /driver/trip/rate_user Rate user
 * @apiName Rate user
 * @apiGroup Driver-trip
 * 
 * @apiHeader {String}  x-access-token Driver's unique access-key
 * 
 * @apiParam {String} trip_id Trip id for which driver is giving rate
 * @apiParam {Number} rate_point Rating point that driver has given to user
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/rate_user',function(req,res){
    var schema = {
        "trip_id":{
            notEmpty: true,
            errorMessage: "Trip id is required"
        },
        "rate_point":{
            notEmpty: true,
            errorMessage: "Rate point is required"
        }
    };

    req.checkBody(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            async.waterfall([
                function(callback){
                    trip_helper.find_trip_by_id(req.body.trip_id, function (trip_data) {
                        if (trip_data.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "message": "Error occured in finding trip info"});
                        } else if (trip_data.status === 404) {
                            callback({"status": config.BAD_REQUEST, "message": "Invalid trip id"});
                        } else {
                            callback(null, trip_data.trip);
                        }
                    });
                },
                function(trip,callback){
                    update_obj = {
                        "rate_to_user":req.body.rate_point
                    };
                    trip_helper.update_trip_by_id(req.body.trip_id,update_obj,function(resp_data){
                        if(resp_data.status === 0){
                            callback({"status":config.INTERNAL_SERVER_ERROR,"message":"Error occured in updating trip"});
                        } else if(resp_data.status === 2){
                            callback({"status":config.BAD_REQUEST,"message":"Error occured in updating trip"});
                        } else {
                            callback(null,trip);
                        }
                    });
                },
                function(trip,callback){
                    user_helper.find_user_by_id(trip.user_id,function(user_data){
                        if(user_data.status === 0){
                            callback({"status": config.INTERNAL_SERVER_ERROR, "message": "Error occured in finding user info"});
                        } else if(user_data.status === 404){
                            callback({"status": config.BAD_REQUEST, "message": "User not found"});
                        } else {
                            callback(null,user_data.user);
                        }
                    });
                },
                function(user,callback){
                    if(user.rate && user.rate.total_rate_point){
                        update_obj = {
                            "rate":{
                                "total_rate_point":(user.rate.total_rate_point * 1) + (req.body.rate_point * 1),
                                "total_rate":(user.rate.total_rate * 1) + 1,
                                "avg_rate": ((user.rate.total_rate_point * 1 + req.body.rate_point * 1) / (user.rate.total_rate * 1 + 1))
                            }
                        }
                    } else {
                        update_obj = {
                            "rate":{
                                "total_rate_point":req.body.rate_point,
                                "total_rate":1,
                                "avg_rate": req.body.rate_point
                            }
                        }
                    }

                    user_helper.update_user_by_id(user._id,update_obj,function(resp_data){
                        if(resp_data.status === 0){
                            console.log("error = ",resp_data.err);
                            callback({"status":config.INTERNAL_SERVER_ERROR,"message":"Error occured in updating user"});
                        } else if(resp_data.status === 2){
                            callback({"status":config.BAD_REQUEST,"message":"Error occured in updating user"});
                        } else {
                            callback(null);
                        }
                    });
                }
            ],function(err,result){
                if(err){
                    res.status(err.status).json({"message":err.message});
                } else {
                    res.status(config.OK_STATUS).json({"message":"Rate has been given to user"});
                }
            });
        } else {
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});


module.exports = router;