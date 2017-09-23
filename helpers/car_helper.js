var Car = require("../models/car");
var car_helper = {};

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
car_helper.find_car_by_id = function(car_id,callback){
    Car.findOne({ _id: car_id }).lean().exec(function (err, car_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(car_data){
                callback({"status":1,"car":car_data});
            } else {
                callback({"status":404,"err":"Car not available"});
            }
        }
    });
};

/*
 * get_all_car is used to fetch all car from database
 * 
 * @return  status  0 - If any error occur in finding car, with error
 *          status  1 - If Car found, with found cars documents
 *          status  404 - If Car not found, with appropriate error message
 * 
 * @developed by "ar"
 */
car_helper.get_all_car = function(callback){
    Car.find().lean().exec(function(err,car_data){
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(car_data && car_data.length > 0){
                callback({"status":1,"car":car_data});
            } else {
                callback({"status":404,"err":"Car not available"});
            }
        }
    });
}

module.exports = car_helper;