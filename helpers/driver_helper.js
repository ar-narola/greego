var Driver = require("../models/driver");
var driver_helper = {};

/*
 * find_driver_by_email is used to fetch single driver by email addres
 * 
 * @param   email   Specify email address of user
 * 
 * @return  status  0 - If any error occur in finding driver, with error
 *          status  1 - If Driver found, with found driver document
 *          status  404 - If Driver not found, with appropriate error message
 * 
 * @developed by "ar"
 */
driver_helper.find_driver_by_email = function(email,callback){
    Driver.findOne({ email: email }).lean().exec(function (err, driver_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(driver_data){
                callback({"status":1,"user":driver_data});
            } else {
                callback({"status":404,"err":"Driver not available"});
            }
        }
    });
};

/*
 * find_driver_by_id is used to fetch single user by driver_id
 * 
 * @param   driver_id   Specify driver_id address of driver
 * 
 * @return  status  0 - If any error occur in finding driver, with error
 *          status  1 - If Driver found, with found driver document
 *          status  404 - If Driver not found, with appropriate error message
 * 
 * @developed by "ar"
 */
driver_helper.find_driver_by_id = function(driver_id,callback){
    Driver.findOne({ _id: driver_id }).lean().exec(function (err, driver_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(driver_data){
                callback({"status":1,"user":driver_data});
            } else {
                callback({"status":404,"err":"Driver not available"});
            }
        }
    });
};


/*
 * insert_driver is used to insert driver in database
 * 
 * @param   driver_object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting user, with error
 *          status  1 - If Driver found, with inserted driver document and appropriate message
 * 
 * @developed by "ar"
 */
driver_helper.insert_driver = function(driver_object,callback){
    var driver = new Driver(driver_object);
    driver.save(function(err,driver_data){
        if(err){
            callback({"status":0,"err":err});
        } else {
            callback({"status":1,"message":"Driver inserted","driver":driver_data});
        }
    });
};

/*
 * update_driver_by_id is used to update driver data based on driver_id
 * 
 * @param   driver_id         String  _id of driver that need to be update
 * @param   driver_object     JSON    object consist of all property that need to update
 * 
 * @return  status  0 - If any error occur in updating driver, with error
 *          status  1 - If driver updated successfully, with appropriate message
 *          status  2 - If driver not updated, with appropriate message
 * 
 * @developed by "ar"
 */
driver_helper.update_driver_by_id = function(driver_id,update_obj,callback){
    Driver.update({_id:{$eq : driver_id}},{$set:update_obj},function(err,update_data){
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if (update_data.n == 1) {
                callback({"status":1,"message":"Record has been updated"});
            } else {
                callback({"status":2,"message":"Record has not updated"});
            }
        }
    });
};

module.exports = driver_helper;