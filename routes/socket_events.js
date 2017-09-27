var _ = require('underscore');
var geolib = require('geolib');

var driver_helper = require('./../helpers/driver_helper');
var trip_helper = require('./../helpers/trip_helper');

var users = [];
var drivers = [];

var find_driver_by_socket = function(socket){
    var driver = _.find(drivers,function(driver){
        return driver.socket === socket;
    });
    return driver;
}

var find_user_by_socket = function(socket){
    var user = _.find(users,function(user){
        return user.socket === socket;
    });
    return user;
}

module.exports = function(io){
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
        socket.on('join',function(data){
            var obj = {
                socket:socket, // socket object
                data:data.data, // personal data of user
                role:data.role // User/driver
            }
            if(data.role == "user"){
                users.push(obj);
            } else if(data.role == "driver"){
                drivers.push(obj);
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
        socket.on('update_driver_location', function (data) {
            update_obj = {
                "current_lat":data.location.latitude,
                "current_long":data.location.longitude,
                "location_updated_at":Date.now()
            };
            
            var driver = find_driver_by_socket(socket);

            driver_helper.update_driver_by_id(driver.data._id,update_obj,function(update_data){
                // Location updated
                if(update_data.status === 0){
                    console.log("Error has been occured in updating driver location");
                } else if(update_data.status === 2){
                    console.log("Invalid driver id provided for updating driver location");
                } else {
                    if(users.length > 0){
                        _.each(users,function(user){
                            user.socket.emit('updated_driver_location',{"location":data.location,"driver_id":driver.data.id});
                        });
                    }
                }
            });
        });

        /*
         * Driver can emit accept_request event to accept user request
         * All other online user will receive this details via "request_accepted" event
         * All other online driver will receive this details via "request_accepted" event
         * 
         * @param data, {"location":{"latitude":"","longitude":""}}
         * 
         * @developed by "ar"
         */
        socket.on('accept_request',function(data){
            
        });

// -----------------------------------------------------------------------------------------------
//              User Events
// -----------------------------------------------------------------------------------------------
        /*
         * User can call request_for_driver event to ask for available driver within range of 10 mile
         * All available driver within range of 10 mile can get request via "listen_invitation" event
         * 
         * @param data, {"location":{"latitude":"","longitude":""},"pickup_location":{"placename":"abcd","latitude":"","longitude":""},"destination_location":{"placename":"abcd","latitude":"","longitude":""},"fare":""}
         * 
         * @developed by "ar"
         */
        socket.on('request_for_driver',function(data){
            
            var user = find_user_by_socket(socket);
            
            ins_obj = {
                "pickup":{
                    "location_name":data.pickup_location.placename,
                    "location_lat":data.pickup_location.latitude,
                    "location_long":data.pickup_location.longitude
                },
                "destination":{
                    "location_name":data.destination_location.placename,
                    "location_lat":data.destination_location.latitude,
                    "location_long":data.destination_location.longitude
                },
                "fare":data.fare,
                "user_id":user.data._id,
                "status":"driver-requested"
            };
            trip_helper.insert_trip(ins_obj,function(trip_data){
                if(trip_data.status === 0){
                    console.log("Error has been occured in inserting trip when use has requested for trip");
                } else {
                    var send_obj = {
                        "uesr":user.data,
                        "trip":trip_data.trip
                    }
                    
                    _.each(drivers,function(driver){
                        var d = geolib.getDistance(data.location,{"latitude":driver.current_lat,"longitude":driver.current_long});
                        if(d <= 1609.344 * 10) // Distance is within 10 mile ??
                        {
                            // Driver is available with in 10 mile of user's location, send him/her request
                            driver.socket.emit('listen_invitation',send_obj);
                        }
                    });
                }
            });
        });
    });
};