var express = require('express');
var router = express.Router();

var config = require('../../config');
var trip_helper = require("../../helpers/trip_helper");

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

module.exports = router;