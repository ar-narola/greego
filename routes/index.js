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
                        var refreshToken = jwt.sign({id: user._id, role: 'user'}, config.REFRESH_TOKEN_SECRET_KEY, {});
                        user_helper.update_user_by_id(user._id, {"refresh_token": refreshToken, "last_login_date": Date.now()}, function (update_resp) {
                            if (update_resp.status === 1) {
                                var userJson = {id: user._id, email: user.email, role: "user"};
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
 * @apiParam {String} phone Phone number of user
 * @apiParam {String} password Password
 * @apiParam {File} [avatar] Profile image of user
 * @apiParam {String} [car_id] Reference of selected car
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
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required"
        },
        'password': {
            notEmpty: true,
            errorMessage: "Password is required"
        },
//        'car_id': {
//            notEmpty: true,
//            errorMessage: "Car reference is required"
//        }
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            logger.trace("Request is valid. ");
            async.waterfall([
                /*
                function (callback) {
                    // Check for valid car reference
                    logger.trace("Check for valid car reference");
                    car_helper.find_car_by_id(req.body.car_id, function (car_resp) {
                        if (car_resp.status === 0) {
                            logger.error("Error occured in finding car by id in user signup. Err = ",car_resp.err);
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": car_resp.err});
                        } else if (car_resp.status === 404) {
                            logger.info("Car not found in user signup.");
                            callback({"status": config.BAD_REQUEST, "err": car_resp.err});
                        } else {
                            logger.trace("Car found. Executing next instruction");
                            callback(null);
                        }
                    });
                },*/
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
                        "phone": req.body.phone,
                        "password": req.body.password,
//                        "car": req.body.car_id
                    };

                    if (image_name) {
                        user_obj.user_avatar = image_name;
                    }

                    user_helper.insert_user(user_obj, function (user_data) {
                        if (user_data.status === 0) {
                            logger.error("There was an issue in user registration. Err = ",user_data.err);
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in user registration"});
                        } else {
                            logger.debug("User inserted. Executed next instruction");
                            callback(null);
                        }
                    });
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
                        logger.trace("Checking role");
                        if (decoded.role === "user") {
                            logger.trace("User role. Finding user by id");
                            user_helper.find_user_by_id(decoded.id, function (user_data) {
                                if (user_data.status === 1) {
                                    logger.debug("User found. Executing next instruction");
                                    callback(null, user_data.user, 'user');
                                } else if (user_data.status === 404) {
                                    loggger.info("User not found");
                                    callback({"status": config.BAD_REQUEST, "err": "User not found"});
                                } else {
                                    logger.error("Error occured in finding user by id in refresh token API. Err = ",user_data.err);
                                    callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_data.err});
                                }
                            });
                        } else if (token_data.role === "driver") {
                            logger.trace("driver role");
                            // Refresh token code for driver
                            /*
                             driver_helper.find_driver_by_id(decoded.id,function(driver_data){
                             if(driver_data.status === 1) {
                             callback(null,driver_data.driver,'driver');
                             } else if(driver_data.status === 404) {
                             callback({"status":config.BAD_REQUEST,"err":"Driver not found"});
                             } else {
                             callback({"status":config.INTERNAL_SERVER_ERROR,"err":driver_data.err});
                             }
                             });
                             */
                        } else {
                            logger.error("Invalid request. Role not specified");
                            callback({"status": config.UNAUTHORIZED, "message": "You are not authorized to use this"});
                        }
                    }
                });
            },
            function (user, role, callback) {
                // Setup JWT token
                logger.trace("Generating tokrn");
                var refreshToken = jwt.sign({id: user._id, role: role}, config.REFRESH_TOKEN_SECRET_KEY, {});
                if (role === "user") {
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
                } else { // Role is driver
                    // Update document of driver
                }
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
 * @apiParam {String} phone Phone number of user
 * @apiParam {String} password Password
 * @apiParam {File} [avatar] Profile image of user
 * @apiParam {Array} [drive_type] Array of string can have value from "Sedan", "SUV" and "Van"
 * @apiParam {String} [transmission_type] Value can be either "Automatic" or "Manual"
 * @apiParam {File} [license] Image of license
 * @apiParam {File} [birth_certi] Image of Birth certificate or passport
 * @apiParam {File} [insurance] Image of insurance
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
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required"
        },
        'password': {
            notEmpty: true,
            errorMessage: "Password is required"
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
                        logger.trace("Check driver's validity");
                        driver_helper.find_driver_by_email(req.body.email, function (driver_resp) {
                            if (driver_resp.status === 0) {
                                logger.error("Error in finding driver by email in driver_signup API. Err = ",user_resp.err);
                                callback({"status": config.INTERNAL_SERVER_ERROR, "err": driver_resp.err});
                            } else if (driver_resp.status === 1) {
                                logger.error("Error in finding driver by email in driver_signup API. Err = Driver with given email is already exist.")
                                callback({"status": config.BAD_REQUEST, "err": "Driver with given email is already exist"});
                            } else {
                                logger.trace("No driver with same email found. Executing next instruction.");
                                callback(null);
                            }
                        });
                    },
                    function(callback){
                        if(req.files && req.files['license'] && req.files['birth_certi'] && req.files['insurance']){
                            async.parallel({
                                license:function(inner_callback){
                                    var file = req.files['license'];
                                    var dir = "./uploads/driver_doc";
                                    var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                                    if (mimetype.indexOf(file.mimetype) !== -1) {
                                        if (!fs.existsSync(dir)) {
                                            fs.mkdirSync(dir);
                                        }
                                        var extention = path.extname(file.name);
                                        var filename = "license_" + new Date().getTime() + extention;
                                        file.mv(dir + '/' + filename, function (err) {
                                            if (err) {
                                                inner_callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading license image"});
                                            } else {
                                                inner_callback(null, filename);
                                            }
                                        });
                                    } else {
                                        inner_callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format of license invalid"});
                                    }
                                },
                                birth_certi : function(inner_callback){
                                    var file = req.files['birth_certi'];
                                    var dir = "./uploads/driver_doc";
                                    var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                                    if (mimetype.indexOf(file.mimetype) !== -1) {
                                        if (!fs.existsSync(dir)) {
                                            fs.mkdirSync(dir);
                                        }
                                        var extention = path.extname(file.name);
                                        var filename = "birth_" + new Date().getTime() + extention;
                                        file.mv(dir + '/' + filename, function (err) {
                                            if (err) {
                                                inner_callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading birth certificate image"});
                                            } else {
                                                inner_callback(null, filename);
                                            }
                                        });
                                    } else {
                                        inner_callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format of birth certificate is invalid"});
                                    }
                                },
                                insurance : function(inner_callback){
                                    var file = req.files['insurance'];
                                    var dir = "./uploads/driver_doc";
                                    var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                                    if (mimetype.indexOf(file.mimetype) !== -1) {
                                        if (!fs.existsSync(dir)) {
                                            fs.mkdirSync(dir);
                                        }
                                        var extention = path.extname(file.name);
                                        var filename = "insurance_" + new Date().getTime() + extention;
                                        file.mv(dir + '/' + filename, function (err) {
                                            if (err) {
                                                inner_callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading image of insurance"});
                                            } else {
                                                inner_callback(null, filename);
                                            }
                                        });
                                    } else {
                                        inner_callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format of insurance is invalid"});
                                    }
                                }
                            },function(err,results){
                                if(err){
                                    callback(err.resp);
                                } else {
                                    console.log(results);
                                    callback(null,results);
                                }
                            });
                        } else {
                            callback(null,null);
                        }
                    },
                    function (image_names,callback) {
                        // Upload driver avatar
                        if (req.files && req.files['avatar']) {
                            var file = req.files['avatar'];
                            var dir = "./uploads/driver_avatar";
                            var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                            if (mimetype.indexOf(file.mimetype) != -1) {
                                if (!fs.existsSync(dir)) {
                                    fs.mkdirSync(dir);
                                }
                                extention = path.extname(file.name);
                                filename = "driver_" + new Date().getTime() + extention;
                                file.mv(dir + '/' + filename, function (err) {
                                    if (err) {
                                        callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading image"});
                                    } else {
                                        image_names.avatar = filename;
                                        callback(null, image_names);
                                    }
                                });
                            } else {
                                callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format is invalid"});
                            }
                        } else {
                            callback(null, image_names);
                        }
                    },
                    function (image_names, callback) {
                        // Driver Insertion
                        var driver_obj = {
                            "first_name": req.body.first_name,
                            "last_name": req.body.last_name,
                            "email": req.body.email,
                            "phone": req.body.phone,
                            "password": req.body.password
                        };
                        
                        if(req.body.drive_type){
                            driver_obj.drive_type = req.body.drive_type;
                        }
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
                        if(image_names && image_names.license){
                            driver_obj.license = image_names.license;
                        }
                        if(image_names && image_names.birth_certi){
                            driver_obj.birth_certi = image_names.birth_certi;
                        }
                        if(image_names && image_names.insurance){
                            driver_obj.insurance = image_names.insurance;
                        }
                        if (image_names && image_names.avatar) {
                            driver_obj.driver_avatar = image_names.avatar;
                        }

                        driver_helper.insert_driver(driver_obj, function (driver_data) {
                            if (driver_data.status === 0) {
                                callback({"status": config.INTERNAL_SERVER_ERROR,"err": "There was an issue in driver registration"});
                            } else {
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
 * @apiParam {String} role User's role (user/driver)
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
        'role': {
            notEmpty: true,
            errorMessage: "User's role is required"
        }
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            logger.trace("Request is valid. ");
            if(req.body.role == "driver"){
                // Check email availability for driver role
                driver_helper.find_driver_by_email(req.body.email, function (user_resp) {
                    if (user_resp.status === 0) {
                        logger.error("Error occured in finding driver by email. Err = ",user_resp.err);
                        res.status(config.INTERNAL_SERVER_ERROR).json({"message":user_resp.err});
                    } else if (user_resp.status === 1) {
                        logger.info("User with given email is already exist.");
                        res.status(config.BAD_REQUEST).json({"message":"Driver with given email is already exist"});
                    } else {
                        logger.trace("Driver found");
                        res.status(config.OK_STATUS).json({"message":"Driver available"});
                    }
                });
            } else if(req.body.role == "user"){
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
                logger.error("Invalid role found");
                res.status(config.VALIDATION_FAILURE_STATUS).json({"message":"Invalid role"});
            }
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
                    //msg += "Click on <a href='http://localhost:3000/reset_password/"+user._id+"'>http://localhost:3000/reset_password/"+user._id+"</a> to reset it.<br/><br/>";
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
                res.status(config.OK_STATUS).json({"brands":model_data.car_model});
            }
        });
    } else {
        res.status(config.VALIDATION_FAILURE_STATUS).json({"message":"Brand name is required"});
    }
});

module.exports = router;