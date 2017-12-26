var async = require('async');

var Trip = require("../models/trip");
var trip_helper = {};

/*
 * insert_trip is used to insert trip in database
 * 
 * @param   trip_object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting user, with error
 *          status  1 - If User found, with inserted user document and appropriate message
 * 
 * @developed by "ar"
 */
trip_helper.insert_trip = function (trip_object, callback) {
    var trip = new Trip(trip_object);
    trip.save(function (err, trip_data) {
        if (err) {
            callback({"status": 0, "err": err});
        } else {
            console.log(trip_data);
            callback({"status": 1, "message": "Trip inserted", "trip": trip_data});
        }
    });
};

/*
 * find_trip_by_id is used to fetch single trip by trip_id
 * 
 * @param   trip_id   Specify trip_id of trip
 * 
 * @return  status  0 - If any error occur in finding trip, with error
 *          status  1 - If trip found, with found trip document
 *          status  404 - If trip not found, with appropriate error message
 * 
 * @developed by "ar"
 */
trip_helper.find_trip_by_id = function (trip_id, callback) {
    Trip.findOne({_id: trip_id}).lean().exec(function (err, trip_data) {
        if (err) {
            callback({"status": 0, "err": err});
        } else {
            if (trip_data) {
                callback({"status": 1, "trip": trip_data});
            } else {
                callback({"status": 404, "err": "Trip not available"});
            }
        }
    });
};

/*
 * update_trip_by_id is used to update trip data based on trip_id
 * 
 * @param   trip_id         String  _id of trip that need to be update
 * @param   trip_object     JSON    object consist of all property that need to update
 * 
 * @return  status  0 - If any error occur in updating trip, with error
 *          status  1 - If trip updated successfully, with appropriate message
 *          status  2 - If trip not updated, with appropriate message
 * 
 * @developed by "ar"
 */
trip_helper.update_trip_by_id = function (trip_id, update_obj, callback) {
    Trip.update({_id: {$eq: trip_id}}, {$set: update_obj}, function (err, update_data) {
        if (err) {
            callback({"status": 0, "err": err});
        } else {
            if (update_data.nModified == 1) {
                callback({"status": 1, "message": "Record has been updated"});
            } else {
                callback({"status": 2, "message": "Record has not updated"});
            }
        }
    });
};

trip_helper.accept_trip_request = function (trip_id, driver_id, callback) {
    Trip.update({_id: {$eq: trip_id}, "sent_request.driver_id": {$eq: driver_id}}, {$set: {"driver_id": driver_id, "status": "request-accepted", "request_accepted_at": Date.now(), "sent_request.$.status": "accepted", "sent_request.$.updated_at": Date.now()}}, function (err, update_data) {
        if (err) {
            callback({"status": 0, "err": err});
        } else {
            if (update_data.nModified == 1) {
                Trip.find({_id: {$eq: trip_id}}).exec(function (err, records) {
                    if (err) {
                        console.log("Error in find = ", err);
                    }

                    async.eachSeries(records[0].sent_request, function (record, loop_callback) {
                        Trip.update({_id: {$eq: trip_id}, "sent_request.status": {$eq: "not-answered"}}, {$set: {"sent_request.$.status": "aborted"}}, {multi: true}, function (err, result) {
                            if (err) {
                                console.log("Error = ", err);
                            } else {
                                console.log("Result = ", result);
                            }
                            loop_callback();
                        });
                    }, function (err) {
                        callback({"status": 1, "message": "Record has been updated"});
                    });
                });
            } else {
                callback({"status": 2, "message": "Record has not updated"});
            }
        }
    });
};

trip_helper.reject_trip_request = function (trip_id, driver_id, callback) {
    Trip.update({_id: {$eq: trip_id}, "sent_request.driver_id": {$eq: driver_id}}, {$set: {"sent_request.$.status": "rejected", "sent_request.$.updated_at": Date.now()}}, function (err, update_data) {
        if (err) {
            callback({"status": 0, "err": err});
        } else {
            callback({"status": 1, "message": "Request has been rejected"});
        }
    });
};

/*
 * 
 */
trip_helper.get_trips_by_user_id = function (user_id, callback) {
    Trip.find({"user_id": {$eq: user_id}})
            .populate({path: 'driver_id', 'model': 'users', populate:{
                    path:'driver_id', model:'drivers'
            }})
            .lean().exec(function (err, trip_data) {
        if (err) {
            callback({"status": 0, "err": err});
        } else {
            if (trip_data.length > 0) {
                async.eachSeries(trip_data,function(trip,loop_callback){
                    console.log("trip = ",trip);
                    var driver = trip.driver_id;
                    if(driver){
                        delete trip.driver_id;
                        trip.driver = {
                            "_id" : driver._id,
                            "first_name" : driver.first_name,
                            "last_name" : driver.last_name,
                            "email":driver.email,
                            "country_code":driver.country_code,
                            "phone":driver.phone,
                            "user_avatar":driver.user_avatar,
                            "avg_rate":(driver.driver_id.rate && driver.driver_id.rate.avg_rate)?driver.driver_id.rate.avg_rate:null,
                            "residential_status":driver.driver_id.residential_status
                        }
                        loop_callback();
                    } else {
                        trip.driver = null;
                        loop_callback();
                    }
//                    console.log("driver = ",driver);
                },function(err){
                    callback({"status": 1, "trip": trip_data});
                });
            } else {
                callback({"status": 404, "err": "No trip found"});
            }
        }
    });
};

/*
 * 
 */
trip_helper.get_trips_by_driver_id = function (driver_id, callback) {
    Trip.find({"driver_id": {$eq: driver_id}})
            .populate({path: 'user_id', 'model': 'users'})
            .lean().exec(function (err, trip_data) {
        if (err) {
            callback({"status": 0, "err": err});
        } else {
            if (trip_data.length > 0) {
                async.eachSeries(trip_data,function(trip,loop_callback){
                    var user = trip.user_id;
                    if(user){
                        delete trip.user_id;
                        trip.user = {
                            "_id" : user._id,
                            "first_name" : user.first_name,
                            "last_name" : user.last_name,
                            "email":user.email,
                            "country_code":user.country_code,
                            "phone":user.phone,
                            "user_avatar":user.user_avatar,
                            "avg_rate":(user.rate && user.rate.avg_rate)?user.rate.avg_rate:null
                        }
                        loop_callback();
                    } else {
                        trip.user = null;
                        loop_callback();
                    }
//                    console.log("driver = ",driver);
                },function(err){
                    callback({"status": 1, "trip": trip_data});
                });
            } else {
                callback({"status": 404, "err": "No trip found"});
            }
        }
    });
};

/*
 * 
 */
trip_helper.get_all_trips_for_driver = function (driver_id, callback) {
    Trip.find({"sent_request.driver_id": {$eq: driver_id}}).lean().exec(function (err, trip_data) {
        if (err) {
            callback({"status": 0, "err": err});
        } else {
            if (trip_data.length > 0) {
                callback({"status": 1, "trip": trip_data});
            } else {
                callback({"status": 404, "err": "No trip found"});
            }
        }
    });
};

module.exports = trip_helper;