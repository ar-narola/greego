var express = require('express');
var async = require('async');
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');

var config = require("../config");
var car_helper = require("../helpers/car_helper");
var car_model_helper = require("../helpers/car_model_helper");
var user_helper = require("../helpers/user_helper");
var driver_helper = require("../helpers/driver_helper");
var mail_helper = require("../helpers/mail_helper");
var twilio_helper = require("../helpers/twilio_helper");

var router = express.Router();
var logger = config.logger;

/* GET home page. */
router.get('/', function (req, res) {
    logger.trace("Document loaded");
    res.sendFile(path.join(__dirname, '../doc', 'index.html'));
});

router.get('/socket',function(req,res){
    logger.trace("Web page for socket loaded");
    res.render('index', { title: 'Express' });
});

/**
 * @api {post} /user_login User Login
 * @apiName User Login
 * @apiGroup Root
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} email Email
 * @apiParam {String} password Password
 * 
 * @apiSuccess (Success 200) {JSON} user User object.
 * @apiSuccess (Success 200) {String} token Unique token which needs to be passed in subsequent requests.
 * @apiSuccess (Success 200) {String} refresh_token Unique token which needs to be passed to generate next access token.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/user_login', function (req, res) {
    logger.trace("API - User login called");
    logger.debug("req.body = ",req.body);
    var schema = {
        'email': {
            notEmpty: true,
            errorMessage: "Email is required",
            isEmail: true
        },
        'password': {
            notEmpty: true,
            errorMessage: "Password is required"
        }
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            logger.trace("Valid request");
            async.waterfall([
                function (callback) {
                    // Checking for user availability
                    logger.trace("Checking for user availability");
                    user_helper.find_user_by_email(req.body.email, function (user_resp) {
                        if (user_resp.status === 0) {
                            logger.error("Error in finding user by email in user_login API. Err = ",user_resp.err);
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                        } else if (user_resp.status === 1) {
                            logger.trace("User found. Executing next instruction");
                            callback(null, user_resp.user);
                        } else {
                            logger.info("Account doesn't exist.");
                            callback({"status": config.BAD_REQUEST, "err": "Account doesn't exist."});
                        }
                    });
                },
                function (user, callback) {
                    // Authentication of user
                    logger.trace("Authenticating user");
                    if (user.password == req.body.password) { // Valid password
                        // Generate token
                        logger.trace("valid user. Generating token");
                        var refreshToken = jwt.sign({id: user._id, role: user.role}, config.REFRESH_TOKEN_SECRET_KEY, {});
                        user_helper.update_user_by_id(user._id, {"refresh_token": refreshToken, "last_login_date": Date.now()}, function (update_resp) {
                            if (update_resp.status === 1) {
                                var userJson = {id: user._id, email: user.email, role: user.role};
                                var token = jwt.sign(userJson, config.ACCESS_TOKEN_SECRET_KEY, {
                                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                                });

                                delete user.password;
                                delete user.refresh_token;
                                delete user.is_active;
                                delete user.is_deleted;
                                delete user.last_login_date;

                                logger.trace("Token generated. Executing next instruction");
                                callback(null, {"user": user, "token": token, "refresh_token": refreshToken});
                            } else if (update_resp.status === 0) {
                                logger.error("Error in updating user in user_login API. Err = ",update_resp.err);
                                callback({"status": config.INTERNAL_SERVER_ERROR, "err": update_resp.err, "err_msg": "There is an issue while updating user record"});
                            } else {
                                logger.info("Token has generated. but user has not updated.");
                                callback({"status": config.OK_STATUS, "err": update_resp.message});
                            }
                        });
                    } else { // Invalid password
                        logger.info("Invalid password of user");
                        callback({"status": config.BAD_REQUEST, "err": "Invalid email or password."});
                    }
                }
            ], function (err, resp) {
                if (err) {
                    res.status(err.status).json({"message": err.err});
                } else {
                    res.status(config.OK_STATUS).json(resp);
                }
            });
        } else {
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            logger.error("Validation Error = ",result);
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

/**
 * @api {post} /user_signup User Signup
 * @apiName User Signup
 * @apiGroup Root
 * 
 * @apiParam {String} first_name First name of user
 * @apiParam {String} last_name Last name of user
 * @apiParam {String} email Email address
 * @apiParam {String} country_code country code for phone number
 * @apiParam {String} phone Phone number of user
 * @apiParam {String} password Password
 * @apiParam {File} [avatar] Profile image of user
 * @apiParam {String} car_brand Car brand name
 * @apiParam {String} car_model Car model name
 * @apiParam {String} car_color Car color
  * @apiParam {String} [car_year] Car year
 * @apiParam {String} plate_number Plate number of car
 * @apiParam {String} transmission_type Transmission type of car
 * 
 * @apiDescription  You need to pass form-data
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/user_signup', function (req, res) {
    logger.trace("API - User signup called");
    logger.debug("req.body = ",req.body);
    var schema = {
        'first_name': {
            notEmpty: true,
            errorMessage: "First name is required"
        },
        'last_name': {
            notEmpty: true,
            errorMessage: "Last name is required"
        },
        'email': {
            notEmpty: true,
            errorMessage: "Email address is required"
        },
        'country_code': {
            notEmpty: true,
            errorMessage: "Country code for phone is required"
        },
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required"
        },
        'password': {
            notEmpty: true,
            errorMessage: "Password is required"
        },
        'car_brand': {
            notEmpty: true,
            errorMessage: "Car brand is required"
        },
        'car_model': {
            notEmpty: true,
            errorMessage: "Car model is required"
        },
        'car_color': {
            notEmpty: true,
            errorMessage: "Car color is required"
        },
        'plate_number': {
            notEmpty: true,
            errorMessage: "Plate number is required"
        },
        'transmission_type': {
            notEmpty: true,
            errorMessage: "Transmission type is required"
        }
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            logger.trace("Request is valid. ");
            async.waterfall([
                function (callback) {
                    // Car reference is valid, Check user validity
                    user_helper.find_user_by_email(req.body.email, function (user_resp) {
                        if (user_resp.status === 0) {
                            logger.error("Error occured in finding user by email in user signup. Err = ",user_resp.err);
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                        } else if (user_resp.status === 1) {
                            logger.info("User with given email is already exist.");
                            callback({"status": config.BAD_REQUEST, "err": "User with given email is already exist"});
                        } else {
                            logger.trace("User found. Executing next instruction");
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    // Upload user avatar
                    logger.trace("Uploading user avatar in user signup API");
                    if (req.files && req.files['avatar']) {
                        var file = req.files['avatar'];
                        var dir = "./uploads/user_avatar";
                        var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                        if (mimetype.indexOf(file.mimetype) != -1) {
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
                            extention = path.extname(file.name);
                            filename = "user_" + new Date().getTime() + extention;
                            file.mv(dir + '/' + filename, function (err) {
                                if (err) {
                                    logger.error("There was an issue in uploading image");
                                    callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading image"});
                                } else {
                                    logger.trace("image has been uploaded. Image name = ",filename);
                                    callback(null, filename);
                                }
                            });
                        } else {
                            logger.error("Image format is invalid");
                            callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format is invalid"});
                        }
                    } else {
                        logger.info("Image not available to upload. Executing next instruction");
                        callback(null, null);
                    }
                },
                function (image_name, callback) {
                    // User Insertion
                    logger.trace("Inserting user in database");
                    var user_obj = {
                        "first_name": req.body.first_name,
                        "last_name": req.body.last_name,
                        "email": req.body.email,
                        "country_code": req.body.country_code,
                        "phone": req.body.phone,
                        "password": req.body.password,
                        "role":"rider",
                        "car":{
                            "brand":req.body.car_brand,
                            "model":req.body.car_model,
                            "color":req.body.car_color,
                            "plate_number":req.body.plate_number,
                            "transmission_type":req.body.transmission_type
                        }
                    };

                    if (image_name) {
                        user_obj.user_avatar = image_name;
                    }
                    
                    if (req.body.car_year) {
                        user_obj.car.year = req.body.car_year;
                    }

                    user_helper.insert_user(user_obj, function (user_data) {
                        if (user_data.status === 0) {
                            logger.error("There was an issue in user registration. Err = ",user_data.err);
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in user registration"});
                        } else {
                            logger.debug("User inserted. Executed next instruction");
                            callback(null,user_data.user);
                        }
                    });
                },
                function(user,callback){
                    var code = Math.floor(100000 + Math.random() * 900000);
                    twilio_helper.sendSMS(user.country_code+user.phone, 'Use ' + code + ' as Greego account security code',function(sms_data){
                        if(sms_data.status === 0){
//                            callback({"status":config.VALIDATION_FAILURE_STATUS,"err":sms_data.err});
                            callback({"status":config.VALIDATION_FAILURE_STATUS,"err":"Please enter phone number with country code."});
                        } else {
                            callback(null,user,code);
                        }
                    });
                },
                function(user,code,callback){
                    user_obj = {
                        "otp":code,
                        "phone_verified":false
                    };
                    user_helper.update_user_by_id(user._id,user_obj,function(user_data){
                        if (user_data.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in saving otp in database"});
                        } else if (user_data.status === 2) {
                            callback({"status": config.BAD_REQUEST, "err": "There was an issue in saving otp in database"});
                        } else {
                            callback(null,{"message":"OTP has been sent successfully"});
                        }
                    })
                }
            ], function (err, result) {
                if (err) {
                    res.status(err.status).json({"message": err.err});
                } else {
                    logger.info("Registration done");
                    res.status(config.OK_STATUS).json({"message": "Registration done successfully"});
                }
            });
        } else {
            logger.error("Validation error ",result);
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

/**
 * @api {post} /refresh_token Refresh Token
 * @apiName Refresh token
 * @apiGroup Root
 * @apiDescription API will use for both - User and Driver
 * 
 * @apiHeader {String}  refresh_token Current refresh token
 * 
 * @apiSuccess (Success 200) {String} message Success message.
 * @apiSuccess (Success 200) {String} token Unique token which needs to be passed in subsequent requests.
 * @apiSuccess (Success 200) {String} refreshToken Unique token which needs to be passed to generate next access token.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/refresh_token', function (req, res) {
    logger.trace("API - Refresh token");
    logger.debug("req.headers = ",req.headers);
    var token = req.headers['refresh_token'];
    if (token) {
        logger.trace("Request is valid");
        async.waterfall([
            function (callback) {
                logger.trace("Verifing refresh token");
                jwt.verify(token, config.REFRESH_TOKEN_SECRET_KEY, function (err, decoded) {
                    if (err) {
                        logger.error("Invalid token. Err = ",err.message);
                        callback({"status": config.UNAUTHORIZED, "err": err.message});
                    } else {
                        logger.trace("Finding user by id");
                        user_helper.find_user_by_id(decoded.id, function (user_data) {
                            if (user_data.status === 1) {
                                logger.debug("User found. Executing next instruction");
                                callback(null, user_data.user, decoded.role);
                            } else if (user_data.status === 404) {
                                loggger.info("User not found");
                                callback({"status": config.BAD_REQUEST, "err": "User not found"});
                            } else {
                                logger.error("Error occured in finding user by id in refresh token API. Err = ",user_data.err);
                                callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_data.err});
                            }
                        });
                    }
                });
            },
            function (user, role, callback) {
                // Setup JWT token
                logger.trace("Generating tokrn");
                var refreshToken = jwt.sign({id: user._id, role: role}, config.REFRESH_TOKEN_SECRET_KEY, {});
                
                logger.trace("Uodating user");
                user_helper.update_user_by_id(user._id, {"refresh_token": refreshToken}, function (update_resp) {
                    if (update_resp.status === 1) {
                        var userJson = {id: user._id, email: user.email, role: "user"};
                        var token = jwt.sign(userJson, config.ACCESS_TOKEN_SECRET_KEY, {
                            expiresIn: 60 * 60 * 24 // expires in 24 hours
                        });
                        logger.debug("token has generated for user")
                        callback(null, {"token": token, "refresh_token": refreshToken});
                    } else if (update_resp.status === 0) {
                        logger.error("Error has occured in updating user in refresh token API. Err = ",update_resp.err);
                        callback({"status": config.INTERNAL_SERVER_ERROR, "err": update_resp.err, "err_msg": "There is an issue while updating user record"});
                    } else {
                        logger.error("Error has occured in updating user in refresh token API.");
                        callback({"status": config.OK_STATUS, "err": "Error in updating refresh token"});
                    }
                });
            }], function (err, resp) {
                if (err) {
                    res.status(err.status).json({"message": err.err});
                } else {
                    res.status(config.OK_STATUS).json(resp);
                }
            });
    } else {
        logger.trace("Request is invalid - Token missing");
        return res.status(config.UNAUTHORIZED).json({"message": 'Invalid refresh token'});
    }
});

/**
 * @api {post} /driver_signup Driver Signup
 * @apiName Driver Signup
 * @apiGroup Root
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
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/driver_signup', function (req, res) {
    logger.trace("API - Driver signup");
    logger.debug("req.body = ",req.body);
    var schema = {
        'first_name': {
            notEmpty: true,
            errorMessage: "First name is required"
        },
        'last_name': {
            notEmpty: true,
            errorMessage: "Last name is required"
        },
        'email': {
            notEmpty: true,
            errorMessage: "Email address is required"
        },
        'country_code': {
            notEmpty: true,
            errorMessage: "Country code is required"
        },
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required"
        },
        'password': {
            notEmpty: true,
            errorMessage: "Password is required"
        },
        'residential_status': {
            notEmpty: true,
            errorMessage: "Residential status is required"
        },
//        'drive_type': {
//            notEmpty: true,
//            errorMessage: "Driver type is required"
//        },
//        'transmission_type': {
//            notEmpty: true,
//            errorMessage: "Transmission type is required"
//        },
//        'bank_routing_no': {
//            notEmpty: true,
//            errorMessage: "Bank routing number is required"
//        },
//        'bank_account_no': {
//            notEmpty: true,
//            errorMessage: "Bank account number is required"
//        },
//        'ssn': {
//            notEmpty: true,
//            errorMessage: "Social security number is required"
//        }
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            /*if(req.files && req.files['license'] && req.files['birth_certi'] && req.files['insurance']){
                logger.trace("Request is valid");
                req.body.drive_type = JSON.parse(req.body.drive_type);*/
                async.waterfall([
                    function (callback) {
                        // Check driver's validity
                        logger.trace("Check driver's validity - by email");
                        // Car reference is valid, Check user validity
                        user_helper.find_user_by_email(req.body.email, function (user_resp) {
                            if (user_resp.status === 0) {
                                logger.error("Error occured in finding user by email in driver signup. Err = ",user_resp.err);
                                callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                            } else if (user_resp.status === 1) {
                                logger.info("User with given email is already exist.");
                                callback({"status": config.BAD_REQUEST, "err": "User with given email is already exist"});
                            } else {
                                logger.trace("User found. Executing next instruction");
                                callback(null);
                            }
                        });
                    },
                    function (callback) {
                        // Check driver's validity
                        logger.trace("Check driver's validity - by phone");
                        user_helper.find_user_by_phone(req.body.country_code,req.body.phone, function (user_resp) {
                            if (user_resp.status === 0) {
                                logger.error("Error occured in finding user by phone in driver signup. Err = ",user_resp.err);
                                callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                            } else if (user_resp.status === 1) {
                                logger.info("User with given phone number is already exist.");
                                callback({"status": config.BAD_REQUEST, "err": "User with given phone number is already exist"});
                            } else {
                                logger.trace("User found. Executing next instruction");
                                callback(null);
                            }
                        });
                    },
                    function(callback){
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
                                callback(err.resp);
                            } else {
                                logger.trace("Executing next instruction : ",results);
                                callback(null,results);
                            }
                        });
                    },
                    function (image_names, callback) {
                        // Driver Insertion
                        logger.trace("Inserting driver in db");
                        var user_obj = {
                            "first_name": req.body.first_name,
                            "last_name": req.body.last_name,
                            "email": req.body.email,
                            "country_code": req.body.country_code,
                            "phone": req.body.phone,
                            "password": req.body.password,
                            "role": "driver"
                        };

                        var driver_obj = {
                            "residential_status":req.body.residential_status
                        };

                        if(req.body.transmission_type){
                            driver_obj.transmission_type = req.body.transmission_type;
                        }
                        if(req.body.bank_routing_no){
                            driver_obj.bank_routing_no = req.body.bank_routing_no;
                        }
                        if(req.body.bank_account_no){
                            driver_obj.bank_account_no = req.body.bank_account_no;
                        }
                        if(req.body.ssn){
                            driver_obj.ssn = req.body.ssn;
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

                        driver_helper.insert_driver(driver_obj, function (driver_data) {
                            if (driver_data.status === 0) {
                                logger.trace("Error occured while inserting driver : err",driver_data);
                                callback({"status": config.INTERNAL_SERVER_ERROR,"err": "There was an issue in driver registration"});
                            } else {
                                logger.trace("Driver instance created");
                                if(req.body.drive_type){
                                    driver_helper.add_drive_type_to_driver(driver_data.driver._id,req.body.drive_type,function(){
                                        logger.trace("driver type has now associated with driver");
                                    });
                                }
                                user_obj.driver_id = driver_data.driver._id;
                                callback(null,user_obj);
                            }
                        });
                    },
                    function(user_obj,callback){
                        logger.trace("Creating user instance");
                        user_helper.insert_user(user_obj, function (user_data) {
                            if (user_data.status === 0) {
                                logger.error("There was an issue in driver registration. Err = ",user_data.err);
                                callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in driver registration"});
                            } else {
                                logger.debug("Driver registered. Executed next instruction");
                                callback(null);
                            }
                        });
                    }
                ], function (err, result) {
                    if (err) {
                        res.status(err.status).json({"message": err.err});
                    } else {
                        res.status(config.OK_STATUS).json({"message": "Registration done successfully"});
                    }
                });
            /*} else {
                var messages = []
                if(!req.files){
                    messages = [{"msg":"Image of license is required"},{"msg":"Image of birth certificate is required"},{"msg":"Image of insurance is required"}];
                } else {
                    if(!req.files['license']){
                        messages.push({"msg":"Image of license is required"});
                    }
                    if(!req.files['birth_certi']){
                        messages.push({"msg":"Image of birth certificate is required"});
                    }
                    if(!req.files['insurance']){
                        messages.push({"msg":"Image of insurance is required"});
                    }
                }
                var result = {
                    message: "Validation Error",
                    error: result.array()
                };
                logger.error("Validation error. ",result);
                res.status(config.VALIDATION_FAILURE_STATUS).json(result);
            }*/
        } else {
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            logger.error("Validation error. ",result);
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

/**
 * @api {post} /email_availability Check email availability for user/driver signup
 * @apiName Email availability
 * @apiGroup Root
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} email Email address
 * 
 * @apiSuccess (Success 200) {String} message Success message (User available)
 * @apiError (Error 4xx) {String} message Validation or error message. (Any error or user not available)
 */
router.post('/email_availability', function (req, res) {
    logger.trace("API - Email availability called");
    logger.debug("req.body = ",req.body);
    var schema = {
        'email': {
            notEmpty: true,
            errorMessage: "Email address is required"
        },
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            logger.trace("Request is valid. ");
            // Check email availability for user role
            user_helper.find_user_by_email(req.body.email, function (user_resp) {
                if (user_resp.status === 0) {
                    logger.error("Error occured in finding user by email. Err = ",user_resp.err);
                    res.status(config.INTERNAL_SERVER_ERROR).json({"message":user_resp.err});
                } else if (user_resp.status === 1) {
                    logger.info("User with given email is already exist.");
                    res.status(config.BAD_REQUEST).json({"message":"User with given email is already exist"});
                } else {
                    logger.trace("User found");
                    res.status(config.OK_STATUS).json({"message":"User available"});
                }
            });
        } else {
            logger.error("Validation error ",result);
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

/**
 * @api {post} /phone_availability Check phone availability for user/driver signup
 * @apiName Phone availability
 * @apiGroup Root
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} phone Phone number
 * @apiParam {String} country_code Country code
 * 
 * @apiSuccess (Success 200) {String} message Success message (User available)
 * @apiError (Error 4xx) {String} message Validation or error message. (Any error or user not available)
 */
router.post('/phone_availability', function (req, res) {
    logger.trace("API - Phone availability called");
    logger.debug("req.body = ",req.body);
    var schema = {
        'country_code': {
            notEmpty: true,
            errorMessage: "Country code is required"
        },
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required"
        },
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            logger.trace("Request is valid. ");
            // Check email availability for user role
            user_helper.find_user_by_phone(req.body.country_code,req.body.phone, function (user_resp) {
                if (user_resp.status === 0) {
                    logger.error("Error occured in finding user by phone. Err = ",user_resp.err);
                    res.status(config.INTERNAL_SERVER_ERROR).json({"message":user_resp.err});
                } else if (user_resp.status === 1) {
                    logger.info("User with given phone number is already exist.");
                    res.status(config.BAD_REQUEST).json({"message":"User with given phone number is already exist"});
                } else {
                    logger.trace("Phone number is available");
                    res.status(config.OK_STATUS).json({"message":"Phone number is available"});
                }
            });
        } else {
            logger.error("Validation error ",result);
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

/**
 * @api {post} /send_link_for_forget_password Send link of reset password through mail
 * @apiName Send link of reset password through mail
 * @apiGroup Root
 * 
 * @apiParam {String} email Email
 * 
 * @apiHeader {String}  Content-Type application/json    
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/send_link_for_forget_password',function(req,res){
    var schema = {
        'email': {
            notEmpty: true,
            errorMessage: "Email is required",
            isEmail: true
        }
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            async.waterfall([
                function (callback) {
                    // Checking for user availability
                    user_helper.find_user_by_email(req.body.email, function (user_resp) {
                        if (user_resp.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                        } else if (user_resp.status === 1) {
                            callback(null, user_resp.user);
                        } else {
                            callback({"status": config.BAD_REQUEST, "err": "Account doesn't exist."});
                        }
                    });
                },
                function (user, callback) {
                    
                    var msg = "Hi <b>"+user.first_name+",</b><br/><br/>";
                    msg += "You recently requested to reset your password for your greego account.<br/>";
                    msg += "Click on <a href=/"+config.SITE_URL+'reset_password/'+user._id+"'>"+config.SITE_URL+'reset_password/'+user._id+"</a> to reset it.<br/><br/>";
                    msg += "Thanks,<br/>Greego Team<hr/>";
                    msg += "<h5>If you're having trouble clicking the given link, copy and paste URL into your web browser.<br/>";
                    msg += "If you did not request a password reset, please reply to let us know.</h5>"
                    
                    mail_helper.send(req.body.email,'"Greego Password Recovery" support@greego.co', 'Reset password link for Greego account', '', msg, function (resp) {
                        if(resp.status === 0){
                            callback({"status":config.INTERNAL_SERVER_ERROR,"err":"Error occured in sending mail"});
                        } else {
                            callback(null,{"message":"Reset password link has been sent to given email"});
                        }
                    });
                }
            ], function (err, resp) {
                if (err) {
                    res.status(err.status).json({"message": err.err});
                } else {
                    res.status(config.OK_STATUS).json(resp);
                }
            });
        } else {
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

/**
 * @api {post} /reset_password Reset password for user
 * @apiName Reset password for user
 * @apiGroup Root
 * 
 * @apiParam {String} key Key provided with verification link
 * @apiParam {String} password New password for user
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/reset_password',function(req,res){
    var schema = {
        'key': {
            notEmpty: true,
            errorMessage: "Key is required."
        },
        'password': {
            notEmpty: true,
            errorMessage: "Password is required."
        }
    };
    req.checkBody(schema);
    
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            async.waterfall([
                function(callback){
                    user_helper.find_user_by_id(req.body.key,function(user_resp){
                        if (user_resp.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                        } else if (user_resp.status === 404) {
                            callback({"status": config.BAD_REQUEST, "err": "Invalid request"});
                        } else {
                            callback(null);
                        }
                    });
                },
                function(callback){
                    user_helper.update_user_by_id(req.body.key,{"password":req.body.password,"password_changed_date":Date.now()},function(user_data){
                        if (user_data.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in updating password"});
                        } else if (user_data.status === 2) {
                            callback({"status": config.BAD_REQUEST, "err": "There was an issue in updating password"});
                        } else {
                            callback(null,{"message":"Password changed successfully"});
                        }
                    });
                }
            ],function(err,result){
                if (err) {
                    res.status(err.status).json({"message": err.err});
                } else {
                    res.status(config.OK_STATUS).json(result);
                }
            });
        } else {
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

/**
 * @api {get} /car_brands Get car brands
 * @apiName Get car brands
 * @apiGroup Root
 * 
 * @apiSuccess (Success 200) {Array} brands Listing of available car brands
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/car_brands',function(req,res){
    car_model_helper.get_distinct_brand(function(brand_data){
        if(brand_data.status === 0){
            res.status(config.INTERNAL_SERVER_ERROR).json({"message":"Error has occured in fetching brand details"});
        } else if(brand_data.status === 404) {
            res.status(config.BAD_REQUEST).json({"message":"No brand found"});
        } else {
            res.status(config.OK_STATUS).json({"brands":brand_data.car_brand});
        }
    });
});

/**
 * @api {get} /car_model_by_brand Get car models based on brand
 * @apiName Get car models based on brand
 * @apiGroup Root
 * 
 * @apiParam {String} brand Car brand
 * 
 * @apiSuccess (Success 200) {Array} models Listing of available car models
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/car_model_by_brand',function(req,res){
    if(req.query.brand) {
        car_model_helper.get_car_model_by_brand(req.query.brand,function(model_data){
            if(model_data.status === 0){
                res.status(config.INTERNAL_SERVER_ERROR).json({"message":"Error has occured in fetching model details"});
            } else if(model_data.status === 404) {
                res.status(config.BAD_REQUEST).json({"message":"No Model found for given brand"});
            } else {
                res.status(config.OK_STATUS).json({"models":model_data.car_model});
            }
        });
    } else {
        res.status(config.VALIDATION_FAILURE_STATUS).json({"message":"Brand name is required"});
    }
});

/**
 * @api {get} /car_year_by_model Get car years based on model
 * @apiName Get car years based on model
 * @apiGroup Root
 * 
 * @apiParam {String} model Car model
 * 
 * @apiSuccess (Success 200) {Array} cars Listing of available car with year
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/car_year_by_model',function(req,res){
    if(req.query.model) {
        car_model_helper.get_car_year_by_model(req.query.model,function(car_data){
            if(car_data.status === 0){
                res.status(config.INTERNAL_SERVER_ERROR).json({"message":"Error has occured in fetching car details"});
            } else if(car_data.status === 404) {
                res.status(config.BAD_REQUEST).json({"message":"No car found for given model"});
            } else {
                res.status(config.OK_STATUS).json({"cars":car_data.car});
            }
        });
    } else {
        res.status(config.VALIDATION_FAILURE_STATUS).json({"message":"Brand name is required"});
    }
});

/**
 * @api {post} /sendotp Send / Re-send OTP
 * @apiName Send / Re-send OTP
 * @apiGroup Root
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {string} country_code Country code
 * @apiParam {string} phone Phone number of user
 * 
 * @apiSuccess (Success 200) {String} message Success message.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/sendotp', function (req, res) {
    var schema = {
        'country_code': {
            notEmpty: true,
            errorMessage: "Country code is required."
        },
        'phone': {
            notEmpty: true,
            errorMessage: "Mobile number is required."
        }
    };
    req.checkBody(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            // Generate random code
            var code = Math.floor(100000 + Math.random() * 900000);

            async.waterfall([
                function(callback){
                    user_helper.find_user_by_phone(req.body.country_code,req.body.phone,function(user_resp){
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
                    twilio_helper.sendSMS(user.country_code+user.phone, 'Use ' + code + ' as Greego account security code',function(sms_data){
                        if(sms_data.status === 0){
                            callback({"status":config.VALIDATION_FAILURE_STATUS,"err":sms_data.err});
                        } else {
                            callback(null,user);
                        }
                    });
                },
                function(user,callback){
                    user_obj = {
                        "otp":code,
                        "phone_verified":false
                    };
                    user_helper.update_user_by_id(user._id,user_obj,function(user_data){
                        if (user_data.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in saving otp in database"});
                        } else if (user_data.status === 2) {
                            callback({"status": config.BAD_REQUEST, "err": "There was an issue in saving otp in database"});
                        } else {
                            callback(null,{"message":"OTP has been sent successfully"});
                        }
                    })
                }
            ],function(err,result){
                if (err) {
                    res.status(err.status).json({"message": err.err});
                } else {
                    res.status(config.OK_STATUS).json(result);
                }
            });
        } else {
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

/**
 * @api {post} /verifyotp Verify OTP
 * @apiName Otp verification
 * @apiGroup Root
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {string} country_code Country code
 * @apiParam {string} phone Phone number of user
 * @apiParam {Number} otp Random six digit code
 * 
 * @apiSuccess (Success 200) {String} message Success message.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/verifyotp', function (req, res) {
    var schema = {
        'country_code': {
            notEmpty: true,
            errorMessage: "Country code is required."
        },
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required."
        },
        'otp': {
            notEmpty: true,
            errorMessage: "OTP is required."
        }
    };
    req.checkBody(schema);
    
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            async.waterfall([
                function(callback){
                    user_helper.find_user_by_phone(req.body.country_code,req.body.phone,function(user_resp){
                        if (user_resp.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                        } else if (user_resp.status === 404) {
                            callback({"status": config.BAD_REQUEST, "err": "User not exist"});
                        } else {
                            if(user_resp.user.phone_verified === true) {
                                callback({"status":config.BAD_REQUEST,"err":"Phone number is already verified"});
                            } else if(user_resp.user.otp != req.body.otp) {
                                callback({"status":config.BAD_REQUEST,"err":"Invalid otp"});
                            } else {
                                callback(null,user_resp.user);
                            }
                        }
                    });
                },
                function(user,callback){
                    user_helper.update_user_by_id(user._id,{"otp":"","phone_verified":true},function(user_data){
                        if (user_data.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in updating otp details in database"});
                        } else if (user_data.status === 2) {
                            callback({"status": config.BAD_REQUEST, "err": "There was an issue in updating otp details in database"});
                        } else {
                            callback(null,{"message":"OTP has been verified successfully"});
                        }
                    });
                }
            ],function(err,result){
                if (err) {
                    res.status(err.status).json({"message": err.err});
                } else {
                    res.status(config.OK_STATUS).json(result);
                }
            });
        } else {
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

module.exports = router;