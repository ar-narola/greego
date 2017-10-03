var _ = require('underscore');
var async = require('async');
var distance = require('google-distance');

var driver_helper = require('./../helpers/driver_helper');
var trip_helper = require('./../helpers/trip_helper');
var notification_helper = require('./../helpers/notification_helper');

var users = [];
var drivers = [];

var find_driver_by_socket = function (socket) {
    var driver = _.find(drivers, function (driver) {
        return driver.socket === socket;
    });
    return driver;
}

var find_user_by_socket = function (socket) {
    var user = _.find(users, function (user) {
        return user.socket === socket;
    });
    return user;
}

var find_driver_by_id = function (driver_id) {
    var driver = _.find(drivers, function (driver) {
        return driver.data._id === driver_id;
    });
    return driver;
}

var find_user_by_id = function (user_id) {
    var user = _.find(users, function (user) {
        return user.data._id === user_id;
    });
    return user;
}

module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
//        console.log('\n\n------------------------\n\nUser connected = ',socket);

        /*
         * User/Driver can emit join event to register their self with socket.
         * User/Driver need to compulsory call this event immediately after connecting with socket
         * 
         * @param data, {"data":personal info,"role":"driver/user"}
         * 
         * @developed by "ar"
         */
        socket.on('join', function (data, socket_callback) {

            console.log(data.role, " has joined");
            console.log("Data = ", data.data);

            var obj = {
                socket: socket, // socket object
                data: data.data, // personal data of user
                role: data.role // User/driver
            };
            if (data.role === "user") {
                users.push(obj);
            } else if (data.role === "driver") {
                drivers.push(obj);
            }
            socket_callback({"status": 1, "message": "User joined successfully."});
        });

        /*
         * User/Driver can emit logout event to logout their self.
         * 
         * @param data, {"data":personal info,"role":"driver/user"}
         * 
         * @developed by "ar"
         */
        socket.on('logout',function(data,socket_callback){
            console.log(data.role, " has logged out");
            console.log("Data = ", data.data);

            if(data.role === "user"){
                _.each(drivers,function(driver){
                    driver.socket.emit('user_logout',{"data":data});
                });
                socket_callback({"status":1,"message":"User has logged out"});
            } else if(data.role === "driver"){
                _.each(users,function(user){
                    user.socket.emit('driver_logout',{"data":data});
                });
                socket_callback({"status":1,"message":"Driver has logged out"});
            }
        });

        /*
         * User/Driver can emit logout event to logout their self.
         * 
         * @param data, {"data":personal info,"role":"driver/user"}
         * 
         * @developed by "ar"
         */
        socket.on('disconnect',function(){
            console.log("User/Driver has disconnect");
/*
            if(data.role === "user"){
                _.each(drivers,function(driver){
                    driver.socket.emit('user_logout',{"data":data});
                });
            } else if(data.role === "driver"){
                _.each(users,function(user){
                    user.socket.emit('driver_logout',{"data":data});
                });
            }*/
        });
        
        /*
         * User/Driver can emit notification event to send notification to other user.
         * Other user/driver will receive notification via "listen_notification"
         * 
         * @param data, {"to_user/to_driver":"","data":"Notification data","role":"driver/user"} // If notification need to send to user then "to_user" parameter is required otherwise to_driver parameter needed.
         * 
         * @developed by "ar"
         */
        socket.on('notification',function(data,socket_callback){
            if(data.role === "user" || data.role === "driver") {
                var from_user = {};
                if(data.role === "user"){
                    var u = find_user_by_socket(socket);
                    from_user = u.data;
                } else {
                    var d = find_driver_by_socket(socket);
                    from_user = d.data;
                }

                if(data.to_user || data.to_driver){
                    var obj = {
                        "from_id":from_user._id,
                        "from_role":data.role,
                        "message":JSON.stringify(data.data)
                    };

                    var to_user = {};
                    if(data.to_user){
                        obj.to_id = data.to_user;
                        obj.to_role = "user";
                        to_user = find_user_by_id(data.to_user);
                    } else {
                        obj.to_id = data.to_driver;
                        obj.to_role = "driver";
                        to_user = find_driver_by_id(data.to_driver);
                    }
                    
                    notification_helper.insert_notification(obj,function(notification_data){
                        if(notification_data.status === 0){
                            socket_callback({"status":0,"message":"Fail to send notification"});
                        } else {
                            to_user.socket.emit('listen_notification',{"data":data.data,"from":from_user._id,"from_role":data.role});
                            socket_callback({"status":1,"message":"Notification sent"});
                        }
                    });
                } else {
                    socket_callback({"status":0,"message":"Invalid request"});
                }
            } else {
                socket_callback({"status":0,"message":"Invalid request"});
            }
        });

// -----------------------------------------------------------------------------------------------
//              Driver Events
// -----------------------------------------------------------------------------------------------

        /*
         * Driver can emit update_driver_location event to update his/her current location.
         * All other online user will receive this location via "updated_driver_location" event
         * 
         * @param data, {"location":{"latitude":"","longitude":""}}
         * 
         * @developed by "ar"
         */
        socket.on('update_driver_location', function (data, socket_callback) {

            console.log("update_driver_location event called");
            console.log("data = ", data);

            update_obj = {
                "current_lat": data.location.latitude,
                "current_long": data.location.longitude,
                "location_updated_at": Date.now()
            };

            var driver = find_driver_by_socket(socket);

            driver_helper.update_driver_by_id(driver.data._id, update_obj, function (update_data) {
                // Location updated
                if (update_data.status === 0) {
                    console.log("Error has been occured in updating driver location");
                    socket_callback({"status": 0, "message": "Error has been occured in updating driver location"});
                } else if (update_data.status === 2) {
                    console.log("Invalid driver id provided for updating driver location");
                    socket_callback({"status": 0, "message": "Invalid driver id provided for updating driver location"});
                } else {
                    driver.data.current_lat = data.location.latitude;
                    driver.data.current_long = data.location.longitude;
                    if (users.length > 0) {
                        _.each(users, function (user) {
                            user.socket.emit('updated_driver_location', {"location": data.location, "driver_id": driver.data.id});
                        });
                    }
                    socket_callback({"status": 1, "message": "Location has been updated"});
                }
            });
        });

        /*
         * Driver can emit accept_request event to accept user request
         * User will receive this details via "request_accepted" event
         * All other online driver will receive this details via "request_accepted" event
         * 
         * @param data, {"trip_id":""}
         * 
         * @developed by "ar"
         */
        socket.on('accept_request', function (data, socket_callback) {

            console.log("accept_request called");
            console.log("Data = ", data);

            var accepted_driver = find_driver_by_socket(socket);

            async.waterfall([
                function (callback) {
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
                function (trip, callback) {
                    // Update trip status and accept time in database and assign driver
                    trip_helper.accept_trip_request(data.trip_id, accepted_driver.data._id, function (update_data) {
                        if (update_data.status === 0) {
                            callback({"status": 0, "message": "There is an issue in updating trip object"});
                        } else if (update_data.status === 2) {
                            callback({"status": 0, "message": "Record has not updated"});
                        } else {
                            callback(null, trip);
                        }
                    });
                },
                function (trip, callback) {
                    var user = find_user_by_id(trip.user_id);
                    distance.get({
                        origin: accepted_driver.data.current_lat + ',' + accepted_driver.data.current_long,
                        destination: trip.pickup.location_lat + ',' + trip.pickup.location_long
                    }, function (err, data) {
                        if (err) {
                            console.log("can't get distance between user and driver location");
                            user.socket.emit("request_accepted", {"trip_id": trip._id, "driver": accepted_driver.data, "estimation_time": "10 minutes"});
                        } else {
                            user.socket.emit("request_accepted", {"trip_id": trip._id, "driver": accepted_driver.data, "estimation_time": (data.duration / 60) + "minutes"});
                        }
                        callback(null, trip);
                    });
                },
                function (trip, callback) {
                    async.eachSeries(drivers, function (driver, loop_callback) {
                        if (driver.socket !== socket) {
                            driver.socket.emit('request_accepted', {"trip_id": trip._id});
                        }
                        loop_callback();
                    }, function (err) {
                        callback(null);
                    });
                }
            ], function (err, result) {
                if (err) {
                    console.log("Error in accept_request", err.message);
                    socket_callback(err);
                } else {
                    socket_callback({"status": 1, "message": "Request has been accepted"});
                }
            });
        });

        /*
         * Driver can emit reject_request event to reject user request
         * User will receive message via "all_request_rejected" if all driver has rejected request of user
         * 
         * @param data, {"trip_id":""}
         * 
         * @developed by "ar"
         */
        socket.on('reject_request', function (data, socket_callback) {

            console.log("reject_request called");
            console.log("Data = ", data);

            var rejected_driver = find_driver_by_socket(socket);

            async.waterfall([
                function (callback) {
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
                function (trip, callback) {
                    // Update trip status and accept time in database and assign driver
                    trip_helper.reject_trip_request(data.trip_id, rejected_driver.data._id, function (update_data) {
                        if (update_data.status === 0) {
                            callback({"status": 0, "message": "There is an issue in updating trip object"});
                        } else if (update_data.status === 2) {
                            callback({"status": 0, "message": "Record has not updated"});
                        } else {
                            callback(null, trip);
                        }
                    });
                },
                function (trip, callback) {
                    var cnt = 0;
                    async.eachSeries(trip.sent_request,function(obj,loop_callback){
                        if(obj.driver_id !== rejected_driver.data._id){
                            if(obj.status !== "rejected"){
                                loop_callback({"status":1});
                            } else {
                                loop_callback();
                            }
                        } else {
                            loop_callback();
                        }
                    },function(err){
                        if(!err){
                            // It means all request has rejected
                            var user = find_user_by_id(trip.user_id);
                            user.socket.emit("all_request_rejected",{"message":"All drivers are busy"});
                        }
                        callback(null);
                    });
                }
            ], function (err, result) {
                if (err) {
                    console.log("Error in reject_request", err.message);
                    socket_callback(err);
                } else {
                    socket_callback({"status": 1, "message": "Request has been rejected"});
                }
            });
        });

        /*
         * Driver can emit driver_reached event when driver reached at pickup location
         * User will be notify for the same via "driver_reached" event
         * All other online driver will receive this details via "request_accepted" event
         * 
         * @param data, {"trip_id":""}
         * 
         * @developed by "ar"
         */
        socket.on('driver_reached', function (data, socket_callback) {

            console.log("Driver reached at pickup location");
            console.log("Data = ", data);

            async.waterfall([
                function (callback) {
                    trip_helper.find_trip_by_id(data.trip_id, function (trip_data) {
                        if (trip_data.status === 0) {
                            callback({"status": 0, "message": "Error occured in finding trip info"});
                        } else if (trip_data.status === 404) {
                            callback({"status": 0, "message": "Invalid trip id"});
                        } else {
                            callback(null,trip_data.trip);
                        }
                    });
                },
                function (trip,callback) {
                    var update_obj = {
                        "status":"driver-reached",
                        "driver_reached_at":Date.now()
                    };
                    
                    trip_helper.update_trip_by_id(data.trip_id,update_obj,function(update_data){
                        if(update_data.status === 0){
                            callback({"status":0,"message":"Error occured in updating trip record"});
                        } else if(update_data.status === 2) {
                            callback({"status":0,"message":"Trip has not updated"});
                        } else {
                            var user = find_user_by_id(trip.user_id);
                            user.socket.emit("driver_reached",{"message":"Driver has reached at pickup location","trip_id":data.trip_id});
                            callback(null,{"status":1,"message":"Trip has updated"});
                        }
                    });
                }
            ], function (err, results) {
                if(err){
                    socket_callback({"status":0,"message":"Error in notify user"});
                } else {
                    socket_callback({"status":1,"message":"User has notified"});
                }
            });
        });
        
        /*
         * Driver can emit start_trip event when driver will start trip
         * User will be notify for the same via "trip_started" event
         * 
         * @param data, {"trip_id":""}
         * 
         * @developed by "ar"
         */
        socket.on('start_trip',function(data,socket_callback){
            console.log("Trip started");
            console.log("Data = ", data);

            async.waterfall([
                function (callback) {
                    trip_helper.find_trip_by_id(data.trip_id, function (trip_data) {
                        if (trip_data.status === 0) {
                            callback({"status": 0, "message": "Error occured in finding trip info"});
                        } else if (trip_data.status === 404) {
                            callback({"status": 0, "message": "Invalid trip id"});
                        } else {
                            callback(null,trip_data.trip);
                        }
                    });
                },
                function (trip,callback) {
                    var update_obj = {
                        "status":"in-progress",
                        "pickup.pickup_time":Date.now()
                    };
                    
                    trip_helper.update_trip_by_id(data.trip_id,update_obj,function(update_data){
                        if(update_data.status === 0){
                            callback({"status":0,"message":"Error occured in updating trip record"});
                        } else if(update_data.status === 2) {
                            callback({"status":0,"message":"Trip has not updated"});
                        } else {
                            var user = find_user_by_id(trip.user_id);
                            user.socket.emit("trip_started",{"message":"Your trip has been started","trip_id":data.trip_id});
                            callback(null,{"status":1,"message":"Trip has updated"});
                        }
                    });
                }
            ], function (err, results) {
                if(err){
                    socket_callback({"status":0,"message":results.message});
                } else {
                    socket_callback({"status":1,"message":"Trip has started"});
                }
            });
        });
        
        /*
         * Driver can emit complete_trip event when trip has been over
         * User will be notify for the same via "trip_completed" event
         * 
         * @param data, {"trip_id":""}
         * 
         * @developed by "ar"
         */
        socket.on('complete_trip',function(data,socket_callback){
            console.log("Trip Complete");
            console.log("Data = ", data);

            async.waterfall([
                function (callback) {
                    trip_helper.find_trip_by_id(data.trip_id, function (trip_data) {
                        if (trip_data.status === 0) {
                            callback({"status": 0, "message": "Error occured in finding trip info"});
                        } else if (trip_data.status === 404) {
                            callback({"status": 0, "message": "Invalid trip id"});
                        } else {
                            callback(null,trip_data.trip);
                        }
                    });
                },
                function (trip,callback) {
                    var update_obj = {
                        "status":"completed",
                        "destination.reached_time":Date.now()
                    };
                    
                    trip_helper.update_trip_by_id(data.trip_id,update_obj,function(update_data){
                        if(update_data.status === 0){
                            callback({"status":0,"message":"Error occured in updating trip record"});
                        } else if(update_data.status === 2) {
                            callback({"status":0,"message":"Trip has not updated"});
                        } else {
                            var user = find_user_by_id(trip.user_id);
                            user.socket.emit("trip_completed",{"message":"Your trip has been completed","trip_id":data.trip_id});
                            callback(null,{"status":1,"message":"Trip has updated"});
                        }
                    });
                }
            ], function (err, results) {
                if(err){
                    socket_callback({"status":0,"message":results.message});
                } else {
                    socket_callback({"status":1,"message":"Trip has completed"});
                }
            });
        });
// -----------------------------------------------------------------------------------------------
//              User Events
// -----------------------------------------------------------------------------------------------
        /*
         * User can call request_for_driver event to ask for available driver within range of 10 mile
         * All available driver within range of 10 mile can get request via "listen_invitation" event
         * If no driver available then user can get message for the same via "request_for_driver" event
         * 
         * @param data, {"pickup_location":{"placename":"abcd","latitude":"","longitude":""},"destination_location":{"placename":"abcd","latitude":"","longitude":""},"fare":""}
         * 
         * @developed by "ar"
         */
        socket.on('request_for_driver', function (data, socket_callback) {

            console.log("request_for_driver called");
            console.log("Data = ", data);

            var user = find_user_by_socket(socket);
            async.waterfall([
                function (callback) {
                    var driver_to_be_notify = [];
                    async.eachSeries(drivers, function (driver, loop_callback) {

                        distance.get({
                            origin: data.pickup_location.latitude + ',' + data.pickup_location.longitude,
                            destination: driver.data.current_lat + ',' + driver.data.current_long
                        }, function (err, data) {
                            if (err) {
                                console.log("\ncan't get distance between user and driver location = ", err);
                            } else {
                                if (data.distanceValue <= 1609.344 * 10) // Distance is within 10 mile ??
                                {
                                    // Driver is available with in 10 mile of user's location, send him/her request
                                    driver_to_be_notify.push(driver);
                                } else {
                                    console.log("Driver skipped : ", driver.data);
                                    console.log("Location data = ", data);
                                }
                            }
                            loop_callback();
                        });
                    }, function (err) {
                        callback(null, driver_to_be_notify);
                    });
                },
                function (driver_to_be_notify, callback) {
                    ins_obj = {
                        "pickup": {
                            "location_name": data.pickup_location.placename,
                            "location_lat": data.pickup_location.latitude,
                            "location_long": data.pickup_location.longitude
                        },
                        "destination": {
                            "location_name": data.destination_location.placename,
                            "location_lat": data.destination_location.latitude,
                            "location_long": data.destination_location.longitude
                        },
                        "fare": data.fare,
                        "user_id": user.data._id,
                        "status": "driver-requested",
                        "sent_request": []
                    };

                    _.each(driver_to_be_notify, function (driver) {
                        ins_obj.sent_request.push({"driver_id": driver.data._id, "status": "not-answered","updated_at":Date.now()});
                    });

                    trip_helper.insert_trip(ins_obj, function (trip_data) {
                        if (trip_data.status === 0) {
                            callback({"status": 0, "message": "Error has been occured in inserting trip when use has requested for trip"});
                        } else {
                            if (driver_to_be_notify.length > 0) {
                                var send_obj = {
                                    "uesr": user.data,
                                    "trip": trip_data.trip
                                };

                                _.each(driver_to_be_notify, function (driver) {
                                    driver.socket.emit('listen_invitation', send_obj);
                                });
                                callback(null, {"status": 1, "message": "Request has been sent"});
                            } else {
                                callback({"status": 2, "message": "There are no drivers nearby."});
                            }
                        }
                    });
                }
            ], function (err, results) {
                if (err) {
                    socket_callback({"success": 0, "message": err.message});
                } else {
                    socket_callback({"success": 1, "message": results.message});
                }
            });
        });
    });
};