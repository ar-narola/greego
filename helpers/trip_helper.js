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
trip_helper.insert_trip = function(trip_object,callback){
    var trip = new Trip(trip_object);
    trip.save(function(err,trip_data){
        if(err){
            callback({"status":0,"err":err});
        } else {
            console.log(trip_data);
            callback({"status":1,"message":"Trip inserted","trip":trip_data});
        }
    });
};

module.exports = trip_helper;