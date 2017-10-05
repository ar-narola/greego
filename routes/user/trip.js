var express = require('express');
var router = express.Router();

var config = require('../../config');
var trip_helper = require("../../helpers/trip_helper");

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
router.get('/rate_driver',function(req,res){
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
                    trip_helper.find_trip_by_id(data.trip_id, function (trip_data) {
                        if (trip_data.status === 0) {
                            callback({"status": 0, "message": "Error occured in finding trip info"});
                        } else if (trip_data.status === 404) {
                            callback({"status": 0, "message": "Invalid trip id"});
                        } else {
                            callback(null, trip_data.trip);
                        }
                    });
                },
                function(trip,callback){
                    
                }
            ],function(err,result){
                
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