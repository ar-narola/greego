var Fare = require("../models/fare");
var fare_helper = {};

/*
 * find_car_by_id is used to fetch single car by _id
 * 
 * @param   car_id   _id of car that need to be find
 * 
 * @return  status  0 - If any error occur in finding car, with error
 *          status  1 - If Car found, with found car document
 *          status  404 - If Car not found, with appropriate error message
 * 
 * @developed by "ar"
 */
fare_helper.find_fare_by_state = function(state,callback){
    Fare.findOne({ state: state }).lean().exec(function (err, fare_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(fare_data){
                callback({"status":1,"fare":fare_data});
            } else {
                callback({"status":404,"err":"No fare data available for given state"});
            }
        }
    });
};

module.exports = fare_helper;