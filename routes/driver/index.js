var express = require('express');
var router = express.Router();

var config = require('../../config');

var driver_helper = require("../../helpers/driver_helper");
var user_helper = require("../../helpers/user_helper");

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
            var ret_driver = {
                "_id":driver_data.driver._id,
                "first_name":driver_data.driver.first_name,
                "last_name":driver_data.driver.last_name,
                "email":driver_data.driver.email,
                "country_code":driver_data.driver.country_code,
                "phone":driver_data.driver.phone,
                "role":driver_data.driver.role,
                "phone_verified":driver_data.driver.phone_verified,
                "residential_status":driver_data.driver.residential_status,
                "user_avatar":(driver_data.driver.user_avatar)?driver_data.driver.user_avatar:null,
                "emergency_contact":(driver_data.driver.emergency_contact)?driver_data.driver.emergency_contact:null,

                "drive_type":(driver_data.driver.driver_id.drive_type)?driver_data.driver.driver_id.drive_type:null,
                "transmission_type":(driver_data.driver.driver_id.transmission_type)?driver_data.driver.driver_id.transmission_type:null,
                "license":(driver_data.driver.driver_id.license)?driver_data.driver.driver_id.license:null,
                "birth_certi":(driver_data.driver.driver_id.birth_certi)?driver_data.driver.driver_id.birth_certi:null,
                "home_insurance":(driver_data.driver.driver_id.home_insurance)?driver_data.driver.driver_id.home_insurance:null,
                "auto_insurance":(driver_data.driver.driver_id.auto_insurance)?driver_data.driver.driver_id.auto_insurance:null,
                "pay_stub":(driver_data.driver.driver_id.pay_stub)?driver_data.driver.driver_id.pay_stub:null,
                "ssn":(driver_data.driver.driver_id.ssn)?driver_data.driver.driver_id.ssn:null,
                "bank_routing_no":(driver_data.driver.driver_id.bank_routing_no)?driver_data.driver.driver_id.bank_routing_no:null,
                "bank_account_no":(driver_data.driver.driver_id.bank_account_no)?driver_data.driver.driver_id.bank_account_no:null,

                "current_lat":(driver_data.driver.current_lat)?driver_data.driver.current_lat:null,
                "current_long":(driver_data.driver.current_long)?driver_data.driver.current_long:null,
                "avg_rate":(driver_data.driver.driver_id.rate && driver_data.driver.driver_id.rate.avg_rate)?driver_data.driver.driver_id.rate.avg_rate:null
            }

            res.status(config.OK_STATUS).json(ret_driver);
        }
    });
});

/**
 * @api {put} /driver/update Update driver profile
 * @apiName Update driver profile
 * @apiGroup Driver
 * 
 * @apiParam {String} first_name First name of user
 * @apiParam {String} last_name Last name of user
 * @apiParam {String} email Email address
 * @apiParam {String} country_code Country code of user
 * @apiParam {String} phone Phone number of user
 * @apiParam {String} password Password
 * @apiParam {String} residential_status Value should be from "Citizen", "Greencard" or "Visa"
 * @apiParam {File} [avatar] Profile image of user
 * 
 * @apiParam {Array} [drive_type] Array of string can have value from "Sedan", "SUV" and "Van"
 * @apiParam {String} [transmission_type] Value can be either "Automatic" or "Manual"
 * @apiParam {File} [license] Image of license
 * @apiParam {File} [birth_certi] Image of Birth certificate or passport
 * @apiParam {File} [home_insurance] Image of home insurance
 * @apiParam {File} [auto_insurance] Image of auto insurance
 * @apiParam {File} [pay_stub] Image of Uber pay stub
 * @apiParam {String} [bank_routing_no] Bank routing number
 * @apiParam {String} [bank_account_no] Bank account number
 * @apiParam {String} [ssn] Social security number
 * 
 * @apiDescription You need to pass form-data
 * 
 * @apiSuccess (Success 200) {String} status 1
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} status 0
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.put('/update', function (req, res) {
    logger.trace("API - Driver profile update API called");
    logger.debug("req.body = ",req.body);
    logger.debug("req.files = ",req.files);

    async.waterfall([
        function (callback) {
            if(req.body.email){
                logger.trace("Email available, updating email");
                // Car reference is valid, Check user validity
                user_helper.find_user_by_email(req.body.email, function (user_resp) {
                    if (user_resp.status === 0) {
                        callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                    } else if (user_resp.status === 1) {
                        if (req.userInfo.email == req.body.email) {
                            callback(null);
                        } else {
                            callback({"status": config.BAD_REQUEST, "err": "User with given email is already exist"});
                        }
                    } else {
                        callback(null);
                    }
                });
            } else {
                callback(null);
            }
        },
        function(callback){
            // Find user by id
            user_helper.find_user_by_id(req.userInfo.id, function (user_resp) {
                if (user_resp.status === 0) {
                    callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                } else if (user_resp.status === 404) {
                    callback({"status": config.BAD_REQUEST, "err": "User not exist"});
                } else {
                    callback(null, user_resp.user);
                }
            });
        },
        function (user, callback) {
            // Upload user avatar
            logger.trace("Going to chk file");
            if (req.files && req.files['avatar']) {
                logger.trace("Avatar is available");
                var file = req.files['avatar'];
                var dir = "./uploads/user_avatar";
                var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                if (mimetype.indexOf(file.mimetype) != -1) {
                    logger.trace("Uploading image");
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
//                    extension = path.extname(file.name);
                    extension = ".jpg";
                    filename = "user_" + new Date().getTime() + extension;
                    file.mv(dir + '/' + filename, function (err) {
                        if (err) {
                            logger.trace("Problem in uploading image");
                            callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading image"});
                        } else {
                            logger.trace("Image uploaded");
                            callback(null, user, filename);
                        }
                    });
                } else {
                    logger.trace("Invalid image format");
                    callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format is invalid"});
                }
            } else {
                logger.trace("Avatar is not available");
                callback(null, user, null);
            }
        },
        function (user, image_name, callback) {
            logger.trace("Updating user info");
            // User updation
            var user_obj = {};

            if(req.body.phone != user.phone){
                user_obj.phone_verified = false;
                user_obj.otp = "";
                user_obj.phone = req.body.phone;
            }

            if (req.body.first_name) {
                user_obj.first_name = req.body.first_name;
            }
            if (req.body.last_name) {
                user_obj.last_name = req.body.last_name;
            }
            if (req.body.password) {
                user_obj.password = req.body.password;
            }
            if (image_name && image_name != null) {
                user_obj.user_avatar = image_name;
            }
            if (req.body.emergency_contact) {
                user_obj.emergency_contact = req.body.emergency_contact;
            }
            if (req.body.car_brand) {
                user_obj.car.brand = req.body.car_brand;
            }
            if (req.body.car_model) {
                user_obj.car.model = req.body.car_model;
            }
            if (req.body.car_color) {
                user_obj.car.color = req.body.car_color;
            }
            if (req.body.plate_number) {
                user_obj.car.plate_number = req.body.plate_number;
            }
            if (req.body.transmission_type) {
                user_obj.car.transmission_type = req.body.transmission_type;
            }

            user_helper.update_user_by_id(req.userInfo.id, user_obj, function (user_data) {
                if (user_data.status === 0) {
                    logger.trace("Internal error : ",user_data);
                    callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in user registration"});
                } else if (user_data.status === 2) {
                    logger.trace("No information has been changed : ",user_data);
                    callback(null);
                } else {
                    logger.trace("Profile updated");
                    callback(null);
                }
            });
        },
        function(callback){
            // Find user by id
            user_helper.find_user_by_id(req.userInfo.id, function (user_data) {
                if (user_data.status === 0) {
                    callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_data.err});
                } else if (user_data.status === 404) {
                    callback({"status": config.BAD_REQUEST, "err": "User not exist"});
                } else {
                    var ret_user = {
                        "_id":user_data.user._id,
                        "first_name":user_data.user.first_name,
                        "last_name":user_data.user.last_name,
                        "email":user_data.user.email,
                        "phone":user_data.user.phone,
                        "role":user_data.user.role,
                        "user_avatar":(user_data.user.user_avatar)?user_data.user.user_avatar:null,
                        "current_lat":user_data.user.current_lat,
                        "current_long":user_data.user.current_long,
                        "cards":user_data.user.card,
                        "avg_rate":(user_data.user.rate && user_data.user.rate.avg_rate)?user_data.user.rate.avg_rate:null
                    }
                    callback(null,ret_user);
                }
            });
        },
    ], function (err, result) {
        logger.trace("execution finished");
        if (err) {
            res.status(err.status).json({"message": err.err});
        } else {
            res.status(config.OK_STATUS).json({"message": "Profile information has been updated successfully","user":result});
        }
    });
});

module.exports = router;