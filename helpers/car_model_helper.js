var Car_model = require("../models/car_model");
var car_model_helper = {};

/*
 * find_car_model_by_id is used to fetch single car_model by _id
 * 
 * @param   car_model_id   _id of car that need to be find
 * 
 * @return  status  0 - If any error occur in finding car, with error
 *          status  1 - If Car found, with found car document
 *          status  404 - If Car not found, with appropriate error message
 * 
 * @developed by "ar"
 */
car_model_helper.find_car_model_by_id = function(car_model_id,callback){
    Car_model.findOne({ _id: car_model_id }).lean().exec(function (err, car_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(car_data){
                callback({"status":1,"car_model":car_data});
            } else {
                callback({"status":404,"err":"Car not available"});
            }
        }
    });
};

/*
 * get_distinct_brand is used to fetch all available brand from database
 * 
 * @return  status  0 - If any error occur in finding car brand, with error
 *          status  1 - If brand found, with found car brands documents
 *          status  404 - If brand not found, with appropriate error message
 * 
 * @developed by "ar"
 */
car_model_helper.get_distinct_brand = function(callback){
    Car_model.find().distinct('brand').lean().exec(function(err,car_data){
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(car_data && car_data.length > 0){
                callback({"status":1,"car_brand":car_data});
            } else {
                callback({"status":404,"err":"Brand not available"});
            }
        }
    });
}

/*
 * get_car_model_by_brand is used to fetch all available model for given brand from database
 * 
 * @return  status  0 - If any error occur in finding car model, with error
 *          status  1 - If car model found, with found car model documents
 *          status  404 - If car model not found, with appropriate error message
 * 
 * @developed by "ar"
 */
car_model_helper.get_car_model_by_brand = function(brand,callback){
    Car_model.find({brand:{$eq:brand}}).lean().exec(function(err,car_data){
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(car_data && car_data.length > 0){
                callback({"status":1,"car_model":car_data});
            } else {
                callback({"status":404,"err":"Car model not available for given car"});
            }
        }
    });
}
module.exports = car_model_helper;