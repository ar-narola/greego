var express = require('express');
var router = express.Router();

var async = require('async');

var config = require('../../config');
var trip_helper = require("../../helpers/trip_helper");
var payment_helper = require("../../helpers/payment_helper");
var driver_helper = require("../../helpers/driver_helper");

/**
 * @api {get} /user/trip/history Get users past trip
 * @apiName Get users past trip
 * @apiGroup User-trip
 * 
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiSuccess (Success 200) {Array} trip Array of trip's document
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/history', function (req, res) {
    trip_helper.get_trips_by_user_id(req.userInfo.id,function(trip_data){
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
 * @api {post} /user/trip/rate_driver Rate driver
 * @apiName Rate driver
 * @apiGroup User-trip
 * 
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiParam {String} trip_id Trip id for which user is giving rate
 * @apiParam {Number} rate_point Rating point that user has given to driver
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/rate_driver',function(req,res){
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
                        "rate_to_driver":req.body.rate_point
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
                    driver_helper.find_driver_by_id(trip.driver_id,function(driver_data){
                        if(driver_data.status === 0){
                            callback({"status": config.INTERNAL_SERVER_ERROR, "message": "Error occured in finding driver info"});
                        } else if(driver_data.status === 404){
                            callback({"status": config.BAD_REQUEST, "message": "Driver not found"});
                        } else {
                            callback(null,driver_data.driver);
                        }
                    });
                },
                function(driver,callback){
                    update_obj = {
                        "rate":{
                            "total_rate_point":driver.rate.total_rate_point + req.body.rate_point,
                            "total_rate":driver.rate.total_rate + 1,
                            "avg_rate": ((driver.rate.total_rate_point + req.body.rate_point) / (driver.rate.total_rate + 1))
                        }
                    }
                    driver_helper.update_driver_by_id(driver._id,update_obj,function(resp_data){
                        if(resp_data.status === 0){
                            console.log("error = ",resp_data.err);
                            callback({"status":config.INTERNAL_SERVER_ERROR,"message":"Error occured in updating driver"});
                        } else if(resp_data.status === 2){
                            callback({"status":config.BAD_REQUEST,"message":"Error occured in updating driver"});
                        } else {
                            callback(null);
                        }
                    });
                }
            ],function(err,result){
                if(err){
                    res.status(err.status).json({"message":err.message});
                } else {
                    res.status(config.OK_STATUS).json({"message":"Rate has been given to driver"});
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

/**
 * @api {post} /user/trip/payment To make payment for trip
 * @apiName To make payment for trip
 * @apiGroup User-trip
 * 
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiParam {String} trip_id Trip id for which user has paid
 * @apiParam {String} card_id Card id form which user has paid
 * @apiParam {Number} amount_paid amount has been paid by user
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/payment',function(req,res){
    var schema = {
        "trip_id":{
            notEmpty: true,
            errorMessage: "Trip id is required"
        },
        "card_id":{
            notEmpty: true,
            errorMessage: "Card id is required"
        },
        "amount_paid":{
            notEmpty: true,
            errorMessage: "Paid amount is required"
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
                    var payment_obj = {
                        "trip_id":trip._id,
                        "card_id":req.body.card_id,
                        "trip_fare":trip.fare,
                        "paid_amount":req.body.amount_paid
                    };

                    payment_helper.insert_payment(payment_obj,function(payment_data){
                        if(payment_data.status === 0){
                            callback({"status": config.INTERNAL_SERVER_ERROR, "message": "Error occured in finding trip info"});
                        } else {
                            callback(null,payment_data);
                        }
                    });
                }
            ],function(err,result){
                if(err){
                    res.status(err.status).json({"message":err.message});
                } else {
                    res.status(config.OK_STATUS).json({"message":"Payment has been done"});
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