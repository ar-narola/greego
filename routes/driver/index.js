var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');

var async = require('async');
var _ = require('underscore');

var config = require('../../config');

var driver_helper = require("../../helpers/driver_helper");
var user_helper = require("../../helpers/user_helper");
var trip_helper = require("../../helpers/trip_helper");
var invoice_helper = require("../../helpers/invoice_helper");
var mail_helper = require("../../helpers/mail_helper");

var logger = config.logger;

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
                "residential_status":driver_data.driver.driver_id.residential_status,
                "user_avatar":(driver_data.driver.user_avatar)?driver_data.driver.user_avatar:null,
                "emergency_contact":(driver_data.driver.emergency_contact)?driver_data.driver.emergency_contact:null,
                "address":(driver_data.driver.driver_id.address)?driver_data.driver.driver_id.address:null,
                "city":(driver_data.driver.driver_id.city)?driver_data.driver.driver_id.city:null,
                "state":(driver_data.driver.driver_id.state)?driver_data.driver.driver_id.state:null,
                "zipcode":(driver_data.driver.driver_id.zipcode)?driver_data.driver.driver_id.zipcode:null,

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
 * @apiParam {String} country_code Country code
 * @apiParam {String} phone Phone number of user
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
 * @apiParam {String} [address] Address
 * @apiParam {String} [city] City
 * @apiParam {String} [state] State
 * @apiParam {String} [zipcode] Zipcode
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
        function(user,callback){
            async.parallel({
                license:function(inner_callback){
                    if(req.files && req.files['license']){
                        logger.trace("Uploading license image");
                        var file = req.files['license'];
                        var dir = "./uploads/driver_doc";
                        var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                        if (mimetype.indexOf(file.mimetype) !== -1) {
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
                            //var extention = path.extname(file.name);
                            var extension = '.jpg';
                            var filename = "license_" + new Date().getTime() + extension;
                            file.mv(dir + '/' + filename, function (err) {
                                if (err) {
                                    logger.trace("There was an issue in uploading license image");
                                    inner_callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading license image"});
                                } else {
                                    logger.trace("license image has uploaded for driver");
                                    inner_callback(null, filename);
                                }
                            });
                        } else {
                            logger.trace("license is not available");
                            inner_callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format of license invalid"});
                        }
                    } else {
                        logger.trace("license is not available");
                        inner_callback(null, null);
                    }
                },
                birth_certi : function(inner_callback){
                    if(req.files && req.files['birth_certi']){
                        logger.trace("Uploading birth_certi image");
                        var file = req.files['birth_certi'];
                        var dir = "./uploads/driver_doc";
                        var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                        if (mimetype.indexOf(file.mimetype) !== -1) {
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
//                                        var extention = path.extname(file.name);
                            var extension = '.jpg';
                            var filename = "birth_" + new Date().getTime() + extension;
                            file.mv(dir + '/' + filename, function (err) {
                                if (err) {
                                    logger.trace("There was an issue in uploading birth_certi image");
                                    inner_callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading birth certificate image"});
                                } else {
                                    logger.trace("birth_certi image has uploaded for driver");
                                    inner_callback(null, filename);
                                }
                            });
                        } else {
                            inner_callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format of birth certificate is invalid"});
                        }
                    } else {
                        logger.trace("birth certi is not available");
                        inner_callback(null,null);
                    }
                },
                home_insurance : function(inner_callback){
                    if(req.files && req.files['home_insurance']){
                        logger.trace("Uploading home_insurance image");
                        var file = req.files['home_insurance'];
                        var dir = "./uploads/driver_doc";
                        var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                        if (mimetype.indexOf(file.mimetype) !== -1) {
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
                            //var extention = path.extname(file.name);
                            var extension = '.jpg';
                            var filename = "home_insurance_" + new Date().getTime() + extension;
                            file.mv(dir + '/' + filename, function (err) {
                                if (err) {
                                    logger.trace("There was an issue in uploading home_insurance image");
                                    inner_callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading image of home_insurance"});
                                } else {
                                    logger.trace("home_insurance image has uploaded for driver");
                                    inner_callback(null, filename);
                                }
                            });
                        } else {
                            inner_callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format of insurance is invalid"});
                        }
                    } else {
                        logger.trace("home insurance is not available");
                        inner_callback(null,null);
                    }
                },
                auto_insurance : function(inner_callback){
                    if(req.files && req.files['auto_insurance']){
                        logger.trace("Uploading auto_insurance image");
                        var file = req.files['auto_insurance'];
                        var dir = "./uploads/driver_doc";
                        var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                        if (mimetype.indexOf(file.mimetype) !== -1) {
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
                            var extension = '.jpg';
                            var filename = "auto_insurance_" + new Date().getTime() + extension;
                            file.mv(dir + '/' + filename, function (err) {
                                if (err) {
                                    logger.trace("There was an issue in uploading auto_insurance image");
                                    inner_callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading image of home_insurance"});
                                } else {
                                    logger.trace("auto_insurance image has uploaded for driver");
                                    inner_callback(null, filename);
                                }
                            });
                        } else {
                            inner_callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format of auto insurance is invalid"});
                        }
                    } else {
                        logger.trace("auto insurance is not available");
                        inner_callback(null,null);
                    }
                },
                avatar:function(inner_callback){
                    // Upload driver avatar
                    if (req.files && req.files['avatar']) {
                        logger.trace("Uploading avatar image");
                        var file = req.files['avatar'];
                        var dir = "./uploads/user_avatar";
                        var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                        if (mimetype.indexOf(file.mimetype) != -1) {
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
//                                        extension = path.extname(file.name);
                            var extension = '.jpg';
                            filename = "user_" + new Date().getTime() + extension;
                            file.mv(dir + '/' + filename, function (err) {
                                if (err) {
                                    logger.trace("There was an issue in uploading image");
                                    inner_callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading avatar of user"});
                                } else {
                                    logger.trace("Avatar image has uploaded for driver");
                                    inner_callback(null, filename);
                                }
                            });
                        } else {
                            inner_callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format of avatar is invalid"});
                        }
                    } else {
                        logger.trace("avatar is not available");
                        inner_callback(null, null);
                    }
                },
                pay_stub:function(inner_callback){
                    // Upload driver avatar
                    if (req.files && req.files['pay_stub']) {
                        logger.trace("Uploading pay_stub image");
                        var file = req.files['pay_stub'];
                        var dir = "./uploads/driver_doc";
                        var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                        if (mimetype.indexOf(file.mimetype) !== -1) {
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
                            var extension = '.jpg';
                            var filename = "pay_stub_" + new Date().getTime() + extension;
                            file.mv(dir + '/' + filename, function (err) {
                                if (err) {
                                    logger.trace("There was an issue in uploading pay_stub image");
                                    inner_callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading image of pay_stub"});
                                } else {
                                    logger.trace("Pay_stub image has uploaded for driver");
                                    inner_callback(null, filename);
                                }
                            });
                        } else {
                            inner_callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format of pay stub is invalid"});
                        }
                    } else {
                        logger.trace("pay_stub is not available");
                        inner_callback(null, null);
                    }
                }
            },function(err,results){
                if(err){
                    logger.trace("Error in image uploading : ",err);
                    callback(err);
                } else {
                    logger.trace("Executing next instruction : ",results);
                    callback(null,user,results);
                }
            });
        },
        function(user, image_name,callback){
            if(req.body.phone && req.body.phone != user.phone){
//                user_obj.country_code = req.body.country_code;
                user.phone = req.body.phone;
                user_helper.sendOTPtoUser(user,function(data){
                    logger.debug("OTP response = ",data);
                    if(data.status == config.OK_STATUS){
                        callback(null,user,image_name);
                    } else {
                        callback(data);
                    }
                });
            } else {
                callback(null,user,image_name);
            }
        },
        function (user, image_names, callback) {
            logger.trace("Updating driver info");
            // User updation
            var user_obj = {};
            var driver_obj = {};

            if (req.body.phone) {
                user_obj.phone = req.body.phone;
            }

            if (req.body.first_name) {
                user_obj.first_name = req.body.first_name;
            }
            if (req.body.last_name) {
                user_obj.last_name = req.body.last_name;
            }
            if (req.body.residential_status) {
                driver_obj.residential_status = req.body.residential_status;
            }
            
            if (req.body.drive_type) {
                req.body.drive_type = JSON.parse(req.body.drive_type);
                driver_obj.drive_type = req.body.drive_type;
            }
            if (req.body.transmission_type) {
                req.body.transmission_type = JSON.parse(req.body.transmission_type);
                driver_obj.transmission_type = req.body.transmission_type;
            }
            if (req.body.bank_routing_no) {
                driver_obj.bank_routing_no = req.body.bank_routing_no;
            }
            if (req.body.bank_account_no) {
                driver_obj.bank_account_no = req.body.bank_account_no;
            }
            if (req.body.ssn) {
                driver_obj.ssn = req.body.ssn;
            }
            if (req.body.address) {
                driver_obj.address = req.body.address;
            }
            if (req.body.city) {
                driver_obj.city = req.body.city;
            }
            if (req.body.state) {
                driver_obj.state = req.body.state;
            }
            if (req.body.zipcode) {
                driver_obj.zipcode = req.body.zipcode;
            }
            
            if(image_names && image_names.license && image_names.license != null){
                driver_obj.license = image_names.license;
            }
            if(image_names && image_names.birth_certi && image_names.birth_certi != null){
                driver_obj.birth_certi = image_names.birth_certi;
            }
            if(image_names && image_names.home_insurance && image_names.home_insurance != null){
                driver_obj.home_insurance = image_names.home_insurance;
            }
            if(image_names && image_names.auto_insurance && image_names.auto_insurance != null){
                driver_obj.auto_insurance = image_names.auto_insurance;
            }
            if(image_names && image_names.pay_stub && image_names.pay_stub != null){
                driver_obj.pay_stub = image_names.pay_stub;
            }
            if (image_names && image_names.avatar && image_names.avatar != null) {
                user_obj.user_avatar = image_names.avatar;
            }
            
            if (req.body.emergency_contact) {
                user_obj.emergency_contact = req.body.emergency_contact;
            }
//
            async.parallel({
                user:function(inner_callback){
                    user_helper.update_user_by_id(req.userInfo.id, user_obj, function (user_data) {
                        if (user_data.status === 0) {
                            logger.trace("Internal error : ",user_data);
                            inner_callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in updating user info"});
                        } else if (user_data.status === 2) {
                            logger.trace("No information has been changed : ",user_data);
                            inner_callback(null);
                        } else {
                            logger.trace("Profile updated");
                            inner_callback(null);
                        }
                    });
                },
                driver:function(inner_callback){
                    driver_helper.update_driver_by_id(user.driver_id, driver_obj, function(driver_data){
                        if (driver_data.status === 0) {
                            logger.trace("Internal error : ",driver_data);
                            inner_callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in updating driver info"});
                        } else if (driver_data.status === 2) {
                            logger.trace("No information has been changed : ",driver_data);
                            inner_callback(null);
                        } else {
                            logger.trace("Profile updated");
                            inner_callback(null);
                        }
                    });
                }
            },function(err,result){
                if(err){
                    callback(err);
                } else {
                    callback(null,image_names,user);
                }
            });
        },
        function(image_names,user_obj,callback){
            if(image_names){
                var msg = "Hi,<br/><br/>";
                    msg += "Driver having name <b>"+user_obj.first_name+" "+user_obj.last_name+"</b> has uploaded below documents. Please review it.<br/><br/>";
                    msg += "<table>";
                        msg += "<tr>";
                            msg += "<th>Type of document</th>";
                            msg += "<th>Path to access document</th>";
                        msg += "</tr>";
                        
                        if(image_names.license && image_names.license != null){
                            msg += "<tr>";
                                msg += "<td>License</td>";
                                msg += "<td>"+config.DRIVER_DOC_URL+image_names.license+"</td>";
                            msg += "</tr>";
                        }
                        
                        if(image_names.birth_certi && image_names.birth_certi != null){
                            msg += "<tr>";
                                msg += "<td>Birth Certificate</td>";
                                msg += "<td>"+config.DRIVER_DOC_URL+image_names.birth_certi+"</td>";
                            msg += "</tr>";
                        }
                        
                        if(image_names.home_insurance && image_names.home_insurance != null){
                            msg += "<tr>";
                                msg += "<td>Home Insurance</td>";
                                msg += "<td>"+config.DRIVER_DOC_URL+image_names.home_insurance+"</td>";
                            msg += "</tr>";
                        }
                        
                        if(image_names.auto_insurance && image_names.auto_insurance != null){
                            msg += "<tr>";
                                msg += "<td>Auto Insurance</td>";
                                msg += "<td>"+config.DRIVER_DOC_URL+image_names.auto_insurance+"</td>";
                            msg += "</tr>";
                        }
                        
                        if(image_names.pay_stub && image_names.pay_stub != null){
                            msg += "<tr>";
                                msg += "<td>Uber Pay Stub</td>";
                                msg += "<td>"+config.DRIVER_DOC_URL+image_names.pay_stub+"</td>";
                            msg += "</tr>";
                        }
                        
                    msg += "</table><br/>";
                    
                    msg += "Thanks,<br/>Greego Team<hr/>";
                    msg += "<h5>If you're having trouble clicking the given link, copy and paste URL into your web browser.";

                    mail_helper.send(config.ADMIN_EMAIL,'"Greego Inc." support@greego.co', 'Driver has updated his document', '', msg, function (resp) {
                        if(resp.status === 0){
                            callback({"status":config.INTERNAL_SERVER_ERROR,"err":"Error occured in sending mail"});
                        } else {
                            callback(null);
                        }
                    });
            } else {
                callback(null);
            }
        },
        function(callback){
            // Find driver by user id
            driver_helper.find_driver_by_id(req.userInfo.id,function(driver_data){
                if(driver_data.status === 0){
                    callback({"status":config.INTERNAL_SERVER_ERROR,"err":"Error has occured in finding driver"});
                } else if(driver_data.status === 404){
                    callback({"status":config.BAD_REQUEST,"err":"No driver found"});
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

                        "address":(driver_data.driver.driver_id.address)?driver_data.driver.driver_id.address:null,
                        "city":(driver_data.driver.driver_id.city)?driver_data.driver.driver_id.city:null,
                        "state":(driver_data.driver.driver_id.state)?driver_data.driver.driver_id.state:null,
                        "zipcode":(driver_data.driver.driver_id.zipcode)?driver_data.driver.driver_id.zipcode:null,

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
                    callback(null,ret_driver);
                }
            });
        },
    ], function (err, result) {
        logger.trace("execution finished");
        if (err) {
            if(err.status == config.VALIDATION_FAILURE_STATUS){
                res.status(err.status).json({"message": err.err,"error":err.error});
            } else {
                res.status(err.status).json({"message": err.err});
            }
        } else {
            res.status(config.OK_STATUS).json({"message": "Profile information has been updated successfully","user":result});
        }
    });
});

/**
 * @api {get} /driver/statistics Get earning statistics of driver
 * @apiName Get earning statistics of driver
 * @apiGroup Driver
 * 
 * @apiHeader {String}  x-access-token Driver's unique access-key
 * 
 * @apiSuccess (Success 200) {JSON} driver Driver details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/statistics',function(req,res){
    async.waterfall([
        function(callback){
            trip_helper.get_all_trips_for_driver(req.userInfo.id,function(trip_data){
                if(trip_data.status == 0){
                    // error in finding trips
                    callback({"status":config.INTERNAL_SERVER_ERROR,"message":"Error has occured while finding trips"});
                } else if(trip_data.status == 404) {
                    // No trips available
                    callback({"status":config.BAD_REQUEST,"message":""});
                } else {
                    // Valid trips
                    callback(null,trip_data.trip);
                }
            });
        },
        function(trips,callback){
            async.parallel({
                completed_trips : function(inner_callback){
                    var completed_trips = _.filter(trips,function(trip){
                        if(trip.status == "completed" && JSON.stringify(req.userInfo.id) === JSON.stringify(trip.driver_id)){
                            return trip;
                        }
                    });
                    inner_callback(null,completed_trips);
                },
                rejected_trips : function(inner_callback){
                    var rejected_trips = _.filter(trips,function(trip){
                        var rejected = _.filter(trip.sent_request,function(sent_req){
                            if(sent_req.status == "rejected" && JSON.stringify(req.userInfo.id) === JSON.stringify(sent_req.driver_id)){
                                return true;
                            }
                        });
                        if(rejected[0]){
                            return trip;
                        }
                    });
                    inner_callback(null,rejected_trips);
                }
            },function(err,result){
                if(err){
                    callback({"status":config.INTERNAL_SERVER_ERROR,"message":err});
                } else {
                    var total_earnings = _.reduce(result.completed_trips,function(memo,trip_obj){
                        return memo + (trip_obj.fare * 1);
                    },0);
                    
                    var acceptance_rate = (100 * result.completed_trips.length) / (result.completed_trips.length + result.rejected_trips.length);
                    
                    result = {
                        "total_earnings":total_earnings,
                        "total_completed_trips":result.completed_trips.length,
                        "total_rejected_trips":result.rejected_trips.length,
                        "acceptance_rate" : acceptance_rate,
                        "completed_trips":result.completed_trips,
                    };
                    callback(null,result);
                }
            });
        }
    ],function(err,result){
        if(err){
            res.status(err.status).json({"message":err.message});
        } else {
            res.status(config.OK_STATUS).json({"trip":result});
        }
    });
});

router.get('/paid_invoice',function(req,res){
    invoice_helper.get_paid_invoice_for_driver(req.userInfo.id,function(invoice_data){
        if(invoice_data.status == 0){
            // error in finding trips
            res.status(config.BAD_REQUEST).json({"error":"Error has occured while finding invoice"});
        } else if(invoice_data.status == 404) {
            // No trips available
            res.status(config.BAD_REQUEST).json({"error":"No paid invoice found"});
        } else {
            // Valid trips
            res.status(config.OK_STATUS).json({"invoice":invoice_data.invoice});
        }
    });
});


module.exports = router;