var express = require('express');
var router = express.Router();

var config = require('../../config');

var driver_helper = require("../../helpers/driver_helper");

/**
 * @1api {put} /driver/update Update driver profile
 * @1apiName Update driver profile
 * @1apiGroup Driver
 * 
 * @1apiHeader {String}  Content-Type application/json
 * @1apiHeader {String}  x-access-token Driver's unique access-key
 * 
 * @1apiParam {String} [first_name] First name of user
 * @1apiParam {String} [last_name] Last name of user
 * @1apiParam {String} [email] Email address
 * @1apiParam {String} [phone] Phone number of user
 * @1apiParam {String} [password] Password
 * @1apiParam {File} [avatar] Profile image of user
 * @1apiParam {Array} [drive_type] Array of string can have value from "Sedan", "SUV" and "Van"
 * @1apiParam {String} [transmission_type] Value can be either "Automatic" or "Manual"
 * @1apiParam {File} [license] Image of license
 * @1apiParam {File} [birth_certi] Image of Birth certificate or passport
 * @1apiParam {File} [insurance] Image of insurance
 * @1apiParam {String} [bank_routing_no] Bank routing number
 * @1apiParam {String} [bank_account_no] Bank account number
 * @1apiParam {String} [ssn] Social security number
 * 
 * @1apiSuccess (Success 200) {String} status 1
 * @1apiSuccess (Success 200) {String} message Success message
 * @1apiError (Error 4xx) {String} status 0
 * @1apiError (Error 4xx) {String} message Validation or error message.
 */
router.put('/update', function (req, res) {
    
    res.send("done");
    
    /*
    if (req.body.hasOwnProperty('email')) {
        pool.query("select UserID from userstable where Email = ? and UserID != ?", [req.body.email, req.userInfo.id], function (err, data) {
            if (err) {
                res.status(config.DATABASE_ERROR_STATUS).json({"status": "0", message: "Error occurs in finding user with given email"});
            } else {
                if (data.length > 0) {
                    res.status(config.BAD_REQUEST).json({"status": "0", message: "Email already exist"});
                } else {
                    usersHelper.updateUserById(req.userInfo.id, req.body, function (resp) {
                        if (resp.status == 1) {
                            res.status(config.OK_STATUS).json({"status": "1", "message": resp.message});
                        } else {
                            res.status(config.BAD_REQUEST).json({"status": "0", "message": resp.err});
                        }
                    });
                }
            }
        });
    } else {
        usersHelper.updateUserById(req.userInfo.id, req.body, function (resp) {
            if (resp.status == 1) {
                res.status(config.OK_STATUS).json({"status": "1", "message": resp.message});
            } else {
                res.status(config.BAD_REQUEST).json({"status": "0", "message": resp.err});
            }
        });
    }*/
});

/**
 * @api {get} /driver/get_details Get Driver details of current logged in driver
 * @apiName Get Driver details of current logged in driver
 * @apiGroup Driver
 * 
 * @apiHeader {String}  x-access-token Driver's unique access-key
 * 
 * @apiSuccess (Success 200) {JSON} driver Driver details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/get_details',function(req,res){
    driver_helper.find_driver_by_id(req.userInfo.id,function(driver_data){
        if(driver_data.status === 0){
            res.status(config.INTERNAL_SERVER_ERROR).json({"message":"Error has occured in finding driver"});
        } else if(driver_data.status === 404){
            res.status(config.BAD_REQUEST).json({"message":"No driver found"});
        } else {
//            var ret_driver = {
//                "_id":driver_data.driver._id,
//                "first_name":driver_data.driver.first_name,
//                "last_name":driver_data.driver.last_name,
//                "email":driver_data.driver.email,
//                "phone":driver_data.driver.phone,
//                "transmission_type":driver_data.driver.transmission_type,
//                "ssn":driver_data.driver.ssn,
//                "driver_avatar":driver_data.driver.driver_avatar,
//                "drive_type":driver_data.driver.drive_type,
//                "current_lat":driver_data.driver.current_lat,
//                "current_long":driver_data.driver.current_long,
//                "avg_rate":driver_data.driver.rate.avg_rate
//            }
//            
//            var ret_driver = {
//                "_id":user_data.user._id,
//                "first_name":user_data.user.first_name,
//                "last_name":user_data.user.last_name,
//                "email":user_data.user.email,
//                "phone":user_data.user.phone,
//                "role":user_data.user.role,
//                "phone_verified":user_data.user.phone_verified,
//                "emergency_contact":user_data.user.emergency_contact,
//                "user_avatar":(user_data.user.user_avatar)?user_data.user.user_avatar:null,
//                "current_lat":user_data.user.current_lat,
//                "current_long":user_data.user.current_long,
//                "cards":user_data.user.card,
//                "car":user_data.user.car,
//                "avg_rate":(user_data.user.rate && user_data.user.rate.avg_rate)?user_data.user.rate.avg_rate:null
//            }
            
            res.status(config.OK_STATUS).json(driver_data);
        }
    });
});

module.exports = router;