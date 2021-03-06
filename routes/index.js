var express = require('express');
var async = require('async');
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');

var request = require('request');
var _ = require('underscore');
var distance = require('google-distance');

var config = require("../config");
var car_helper = require("../helpers/car_helper");
var car_model_helper = require("../helpers/car_model_helper");
var user_helper = require("../helpers/user_helper");
var driver_helper = require("../helpers/driver_helper");
var mail_helper = require("../helpers/mail_helper");
var twilio_helper = require("../helpers/twilio_helper");
var fare_helper = require("../helpers/fare_helper");
var category_helper = require("../helpers/help_category_helper");
var faq_helper = require("../helpers/faq_helper");

var router = express.Router();
var logger = config.logger;

/* GET home page. */
router.get('/', function (req, res) {
    logger.trace("Document loaded");
    res.sendFile(path.join(__dirname, '../doc', 'index.html'));
});

router.get('/socket', function (req, res) {
    logger.trace("Web page for socket loaded");
    res.render('index', {title: 'Express'});
});

/**
 * @api {get} /category Get all category
 * @apiName Get all category
 * @apiGroup Root
 * 
 * @apiSuccess (Success 200) {JSON} categories Category details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/category', function (req, res) {
    category_helper.get_all_category(function (category_data) {
        if (category_data.status == 1) {
            res.status(config.OK_STATUS).json({"categories": category_data.categories});
        } else if (category_data.status == 0) {
            res.status(config.INTERNAL_SERVER_ERROR).json({"error": category_data.err});
        } else {
            res.status(config.BAD_REQUEST).json({"error": category_data.err});
        }
    });
});

/**
 * @api {get} /faq Get all faqs
 * @apiName Get all faqs
 * @apiGroup Root
 * 
 * @apiSuccess (Success 200) {JSON} faqs FAQ details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/faq', function (req, res) {
    faq_helper.get_all_faq(function (faq_data) {
        if (faq_data.status == 1) {
            res.status(config.OK_STATUS).json({"faqs": faq_data.faqs});
        } else if (faq_data.status == 0) {
            res.status(config.INTERNAL_SERVER_ERROR).json({"error": faq_data.err});
        } else {
            res.status(config.BAD_REQUEST).json({"error": faq_data.err});
        }
    });
});

/**
 * @api {get} /category_details Retrive category details
 * @apiName Retrive category details
 * @apiGroup Admin
 * 
 * @apiHeader {String}  x-access-token Admin's unique access-key
 * 
 * @apiParam {String} category_id category Id
 * 
 * @apiSuccess (Success 200) {JSON} category Category details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/category_details', function (req, res) {
    var schema = {
        "category_id": {
            notEmpty: true,
            errorMessage: "Category id is required"
        }
    };

    req.checkQuery(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            category_helper.find_category_by_id(req.query.category_id, function (category_data) {
                if (category_data.status == 1) {
                    res.status(config.OK_STATUS).json({"category": category_data.category});
                } else if (category_data.status == 0) {
                    res.status(config.INTERNAL_SERVER_ERROR).json({"error": category_data.err});
                } else {
                    res.status(config.BAD_REQUEST).json({"error": category_data.err});
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
 * @api {get} /category_faq Get all faqs for given category
 * @apiName Get all faqs for given category
 * @apiGroup Admin
 * 
 * @apiHeader {String}  x-access-token Admin's unique access-key
 * 
 * @apiParam {String} category_id category Id
 * 
 * @apiSuccess (Success 200) {JSON} faqs FAQ details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/category_faq', function (req, res) {
    var schema = {
        "category_id": {
            notEmpty: true,
            errorMessage: "Category id is required"
        }
    };

    req.checkQuery(schema);
    req.getValidationResult().then(function (result) {
        faq_helper.get_faq_by_category(req.query.category_id, function (faq_data) {
            if (faq_data.status == 1) {
                res.status(config.OK_STATUS).json({"faqs": faq_data.faqs});
            } else if (faq_data.status == 0) {
                res.status(config.INTERNAL_SERVER_ERROR).json({"error": faq_data.err});
            } else {
                res.status(config.BAD_REQUEST).json({"error": faq_data.err});
            }
        });
    });
});

/**
 * @api {get} /faq_details Retrive faq details
 * @apiName Retrive faq details
 * @apiGroup Admin
 * 
 * @apiParam {String} faq_id faq Id
 * 
 * @apiSuccess (Success 200) {JSON} faq Faq details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/faq_details', function (req, res) {
    var schema = {
        "faq_id": {
            notEmpty: true,
            errorMessage: "Faq id is required"
        }
    };

    req.checkQuery(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            faq_helper.find_faq_by_id(req.query.faq_id, function (faq_data) {
                if (faq_data.status == 1) {
                    res.status(config.OK_STATUS).json({"faq": faq_data.faq});
                } else if (faq_data.status == 0) {
                    res.status(config.INTERNAL_SERVER_ERROR).json({"error": faq_data.err});
                } else {
                    res.status(config.BAD_REQUEST).json({"error": faq_data.err});
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

router.get('/get_subcategory', function (req, res) {
    var schema = {
        "category_id": {
            notEmpty: true,
            errorMessage: "Category id is required"
        }
    };

    req.checkQuery(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            category_helper.find_category_by_parent_id(req.query.category_id, function (category_data) {
                if (category_data.status == 1) {
                    res.status(config.OK_STATUS).json({"categories": category_data.category});
                } else if (category_data.status == 0) {
                    res.status(config.INTERNAL_SERVER_ERROR).json({"error": category_data.err});
                } else {
                    res.status(config.BAD_REQUEST).json({"error": category_data.err});
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
    logger.debug("req.body = ", req.body);
    var schema = {
        'email': {
            notEmpty: true,
            errorMessage: "Email is required",
            isEmail: {errorMessage: "Please enter valid email address"}
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
                            logger.error("Error in finding user by email in user_login API. Err = ", user_resp.err);
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
                                logger.error("Error in updating user in user_login API. Err = ", update_resp.err);
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
            logger.error("Validation Error = ", result);
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

/**
 * @api {post} /admin_login Admin Login
 * @apiName Admin Login
 * @apiGroup Root
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} email Email
 * @apiParam {String} password Password
 * 
 * @apiSuccess (Success 200) {JSON} admin Admin object.
 * @apiSuccess (Success 200) {String} token Unique token which needs to be passed in subsequent requests.
 * @apiSuccess (Success 200) {String} refresh_token Unique token which needs to be passed to generate next access token.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/admin_login', function (req, res) {
    logger.trace("API - User login called");
    logger.debug("req.body = ", req.body);
    var schema = {
        'email': {
            notEmpty: true,
            errorMessage: "Email is required",
            isEmail: {errorMessage: "Please enter valid email address"}
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
                            logger.error("Error in finding user by email in user_login API. Err = ", user_resp.err);
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
                    if (user.password == req.body.password && user.role == "admin") { // Valid password and user is admin
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
                                logger.error("Error in updating user in user_login API. Err = ", update_resp.err);
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
            logger.error("Validation Error = ", result);
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
 * @apiParam {String} [plate_number] Plate number of car
 * @apiParam {String} transmission_type Transmission type of car
 * 
 * @apiDescription  You need to pass form-data
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/user_signup', function (req, res) {
    logger.trace("API - User signup called");
    logger.debug("req.body = ", req.body);
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
            errorMessage: "Email address is required",
            isEmail: {errorMessage: "Please enter valid email address"}
        },
        'country_code': {
            notEmpty: true,
            errorMessage: "Country code for phone is required"
        },
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required",
            isNumeric: {errorMessage: "Phone number must contain digits only"},
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
                            logger.error("Error occured in finding user by email in user signup. Err = ", user_resp.err);
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
                                    logger.trace("image has been uploaded. Image name = ", filename);
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
                        "role": "rider",
                        "car": {
                            "brand": req.body.car_brand,
                            "model": req.body.car_model,
                            "color": req.body.car_color,
                            "transmission_type": req.body.transmission_type
                        }
                    };

                    if (image_name) {
                        user_obj.user_avatar = image_name;
                    }

                    if (req.body.car_year) {
                        user_obj.car.year = req.body.car_year;
                    }
                    if (req.body.plate_number) {
                        user_obj.car.plate_number = req.body.plate_number;
                    }

                    user_helper.insert_user(user_obj, function (user_data) {
                        if (user_data.status === 0) {
                            logger.error("There was an issue in user registration. Err = ", user_data.err);
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in user registration"});
                        } else {
                            logger.debug("User inserted. Executed next instruction");
                            callback(null, user_data.user);
                        }
                    });
                },
                function (user, callback) {
                    user_helper.sendOTPtoUser(user, function (data) {
                        if (data.status == config.OK_STATUS) {
                            callback(null, data.result);
                        } else {
                            user_helper.delete_user_by_id(user._id, function () {
                                callback(data);
                            });
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    if (err.status == config.VALIDATION_FAILURE_STATUS) {
                        res.status(err.status).json({"message": err.err, "error": err.error});
                    } else {
                        res.status(err.status).json({"message": err.err});
                    }
                } else {
                    logger.info("Registration done");
                    res.status(config.OK_STATUS).json({"message": "Registration done successfully"});
                }
            });
        } else {
            logger.error("Validation error ", result);
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
    logger.debug("req.headers = ", req.headers);
    var token = req.headers['refresh_token'];
    if (token) {
        logger.trace("Request is valid");
        async.waterfall([
            function (callback) {
                logger.trace("Verifing refresh token");
                jwt.verify(token, config.REFRESH_TOKEN_SECRET_KEY, function (err, decoded) {
                    if (err) {
                        logger.error("Invalid token. Err = ", err.message);
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
                                logger.error("Error occured in finding user by id in refresh token API. Err = ", user_data.err);
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
                        logger.error("Error has occured in updating user in refresh token API. Err = ", update_resp.err);
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
 * @apiParam {Array} drive_type Array of string can have value from "Sedan", "SUV" and "Van"
 * @apiParam {String} transmission_type Value can be either "Automatic" or "Manual"
 * @apiParam {File} [license] Image of license
 * @apiParam {File} [birth_certi] Image of Birth certificate or passport
 * @apiParam {File} [home_insurance] Image of home insurance
 * @apiParam {File} [auto_insurance] Image of auto insurance
 * @apiParam {File} [pay_stub] Image of Uber pay stub
 * @apiParam {String} bank_routing_no Bank routing number
 * @apiParam {String} bank_account_no Bank account number
 * @apiParam {String} ssn Social security number
 * @apiParam {String} address Driver's Address 
 * @apiParam {String} city City
 * @apiParam {String} state State
 * @apiParam {String} zipcode Zipcode
 
 * 
 * @apiDescription You need to pass form-data
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/driver_signup', function (req, res) {
    logger.trace("API - Driver signup");
    logger.debug("req.body = ", req.body);
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
            errorMessage: "Email address is required",
            isEmail: {errorMessage: "Please enter valid email address"}
        },
        'country_code': {
            notEmpty: true,
            errorMessage: "Country code is required"
        },
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required",
            isNumeric: {errorMessage: "Phone number must contain digits only"},
//            isLength:{min : 10, max : 10, errorMessage: "Phone number must contain 10 digits"}
        },
        'password': {
            notEmpty: true,
            errorMessage: "Password is required"
        },
        'residential_status': {
            notEmpty: true,
            errorMessage: "Residential status is required"
        },
        'drive_type': {
            notEmpty: true,
            errorMessage: "Driver type is required"
        },
        'transmission_type': {
            notEmpty: true,
            errorMessage: "Transmission type is required"
        },
        'bank_routing_no': {
            notEmpty: true,
            isNumeric: {errorMessage: "Bank routing number must contain digits only"},
            errorMessage: "Bank routing number is required"
        },
        'bank_account_no': {
            notEmpty: true,
            isNumeric: {errorMessage: "Bank account number must contain digits only"},
            errorMessage: "Bank account number is required"
        },
        'ssn': {
            notEmpty: true,
            errorMessage: "Social security number is required",
            isNumeric: {errorMessage: "SSN must contain digits only"},
        },
        'address': {
            notEmpty: true,
            errorMessage: "Address is required"
        },
        'city': {
            notEmpty: true,
            errorMessage: "City is required"
        },
        'state': {
            notEmpty: true,
            errorMessage: "State is required"
        },
        'zipcode': {
            notEmpty: true,
            errorMessage: "Zipcode is required"
        },
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
                            logger.error("Error occured in finding user by email in driver signup. Err = ", user_resp.err);
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
//                    function (callback) {
//                        // Check driver's validity
//                        logger.trace("Check driver's validity - by phone");
//                        user_helper.find_user_by_phone(req.body.country_code,req.body.phone, function (user_resp) {
//                            if (user_resp.status === 0) {
//                                logger.error("Error occured in finding user by phone in driver signup. Err = ",user_resp.err);
//                                callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
//                            } else if (user_resp.status === 1) {
//                                logger.info("User with given phone number is already exist.");
//                                callback({"status": config.BAD_REQUEST, "err": "User with given phone number is already exist"});
//                            } else {
//                                logger.trace("User found. Executing next instruction");
//                                callback(null);
//                            }
//                        });
//                    },
                function (callback) {
                    async.parallel({
                        license: function (inner_callback) {
                            if (req.files && req.files['license']) {
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
                        birth_certi: function (inner_callback) {
                            if (req.files && req.files['birth_certi']) {
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
                                inner_callback(null, null);
                            }
                        },
                        home_insurance: function (inner_callback) {
                            if (req.files && req.files['home_insurance']) {
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
                                inner_callback(null, null);
                            }
                        },
                        auto_insurance: function (inner_callback) {
                            if (req.files && req.files['auto_insurance']) {
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
                                inner_callback(null, null);
                            }
                        },
                        avatar: function (inner_callback) {
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
                        pay_stub: function (inner_callback) {
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
                    }, function (err, results) {
                        if (err) {
                            logger.trace("Error in image uploading : ", err);
                            callback(err.resp);
                        } else {
                            logger.trace("Executing next instruction : ", results);
                            callback(null, results);
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
                        "residential_status": req.body.residential_status,
                        "address": req.body.address,
                        "city": req.body.city,
                        "state": req.body.state,
                        "zipcode": req.body.zipcode
                    };

                    if (req.body.transmission_type) {
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
                    if (image_names && image_names.license && image_names.license != null) {
                        driver_obj.license = image_names.license;
                    }
                    if (image_names && image_names.birth_certi && image_names.birth_certi != null) {
                        driver_obj.birth_certi = image_names.birth_certi;
                    }
                    if (image_names && image_names.home_insurance && image_names.home_insurance != null) {
                        driver_obj.home_insurance = image_names.home_insurance;
                    }
                    if (image_names && image_names.auto_insurance && image_names.auto_insurance != null) {
                        driver_obj.auto_insurance = image_names.auto_insurance;
                    }
                    if (image_names && image_names.pay_stub && image_names.pay_stub != null) {
                        driver_obj.pay_stub = image_names.pay_stub;
                    }
                    if (image_names && image_names.avatar && image_names.avatar != null) {
                        user_obj.user_avatar = image_names.avatar;
                    }

                    driver_helper.insert_driver(driver_obj, function (driver_data) {
                        if (driver_data.status === 0) {
                            logger.trace("Error occured while inserting driver : err", driver_data);
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in driver registration"});
                        } else {
                            logger.trace("Driver instance created");
                            if (req.body.drive_type) {
                                driver_helper.add_drive_type_to_driver(driver_data.driver._id, req.body.drive_type, function () {
                                    logger.trace("driver type has now associated with driver");
                                });
                            }
                            user_obj.driver_id = driver_data.driver._id;
                            callback(null, user_obj);
                        }
                    });
                },
                function (user_obj, callback) {
                    logger.trace("Creating user instance");
                    user_helper.insert_user(user_obj, function (user_data) {
                        if (user_data.status === 0) {
                            logger.error("There was an issue in driver registration. Err = ", user_data.err);
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in driver registration"});
                        } else {
                            logger.debug("Driver registered. Executed next instruction");
                            callback(null, user_data.user);
                        }
                    });
                },
                function (user, callback) {
                    logger.trace("Going to send OTP");
                    user_helper.sendOTPtoUser(user, function (data) {
                        logger.debug("OTP response = ", data);
                        if (data.status == config.OK_STATUS) {
                            callback(null, data.result);
                        } else {
                            callback(data);
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    if (err.status == config.VALIDATION_FAILURE_STATUS) {
                        res.status(err.status).json({"message": err.err, "error": err.error});
                    } else {
                        res.status(err.status).json({"message": err.err});
                    }
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
            logger.error("Validation error. ", result);
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
    logger.debug("req.body = ", req.body);
    var schema = {
        'email': {
            notEmpty: true,
            errorMessage: "Email address is required",
            isEmail: {errorMessage: "Please enter valid email address"}
        },
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            logger.trace("Request is valid. ");
            // Check email availability for user role
            user_helper.find_user_by_email(req.body.email, function (user_resp) {
                if (user_resp.status === 0) {
                    logger.error("Error occured in finding user by email. Err = ", user_resp.err);
                    res.status(config.INTERNAL_SERVER_ERROR).json({"message": user_resp.err});
                } else if (user_resp.status === 1) {
                    logger.info("User with given email is already exist.");
                    res.status(config.BAD_REQUEST).json({"message": "User with given email is already exist"});
                } else {
                    logger.trace("User found");
                    res.status(config.OK_STATUS).json({"message": "User available"});
                }
            });
        } else {
            logger.error("Validation error ", result);
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
    logger.debug("req.body = ", req.body);
    var schema = {
        'country_code': {
            notEmpty: true,
            errorMessage: "Country code is required"
        },
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required",
            isNumeric: {errorMessage: "Phone number must contain digits only"},
        },
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            logger.trace("Request is valid. ");
            // Check email availability for user role
            user_helper.find_user_by_phone(req.body.country_code, req.body.phone, function (user_resp) {
                if (user_resp.status === 0) {
                    logger.error("Error occured in finding user by phone. Err = ", user_resp.err);
                    res.status(config.INTERNAL_SERVER_ERROR).json({"message": user_resp.err});
                } else if (user_resp.status === 1) {
                    logger.info("User with given phone number is already exist.");
                    res.status(config.BAD_REQUEST).json({"message": "User with given phone number is already exist"});
                } else {
                    logger.trace("Phone number is available");
                    res.status(config.OK_STATUS).json({"message": "Phone number is available"});
                }
            });
        } else {
            logger.error("Validation error ", result);
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
router.post('/send_link_for_forget_password', function (req, res) {
    var schema = {
        'email': {
            notEmpty: true,
            errorMessage: "Email is required",
            isEmail: {errorMessage: "Please enter valid email address"}
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

                    var site_link = config.SITE_URL + 'reset_password/' + user._id;
                    if (user.role == "admin") {
                        site_link = config.SITE_URL + 'admin/reset_password/' + user._id;
                    }

                    var msg = "Hi <b>" + user.first_name + ",</b><br/><br/>";
                    msg += "You recently requested to reset your password for your greego account.<br/>";
                    msg += "Click on <a href=" + site_link + ">" + site_link + "</a> to reset it.<br/><br/>";
                    msg += "Thanks,<br/>Greego Team<hr/>";
                    msg += "<h5>If you're having trouble clicking the given link, copy and paste URL into your web browser.<br/>";
                    msg += "If you did not request a password reset, please reply to let us know.</h5>"

                    mail_helper.send(req.body.email, '"Greego Password Recovery" support@greego.co', 'Reset password link for Greego account', '', msg, function (resp) {
                        if (resp.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "Error occured in sending mail"});
                        } else {
                            callback(null, {"message": "Reset password link has been sent to given email"});
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
router.post('/reset_password', function (req, res) {
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
                function (callback) {
                    user_helper.find_user_by_id(req.body.key, function (user_resp) {
                        if (user_resp.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                        } else if (user_resp.status === 404) {
                            callback({"status": config.BAD_REQUEST, "err": "Invalid request"});
                        } else {
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    user_helper.update_user_by_id(req.body.key, {"password": req.body.password, "password_changed_date": Date.now()}, function (user_data) {
                        if (user_data.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in updating password"});
                        } else if (user_data.status === 2) {
                            callback({"status": config.BAD_REQUEST, "err": "There was an issue in updating password"});
                        } else {
                            callback(null, {"message": "Password changed successfully"});
                        }
                    });
                }
            ], function (err, result) {
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
router.get('/car_brands', function (req, res) {
    car_model_helper.get_distinct_brand(function (brand_data) {
        if (brand_data.status === 0) {
            res.status(config.INTERNAL_SERVER_ERROR).json({"message": "Error has occured in fetching brand details"});
        } else if (brand_data.status === 404) {
            res.status(config.BAD_REQUEST).json({"message": "No brand found"});
        } else {
            res.status(config.OK_STATUS).json({"brands": brand_data.car_brand});
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
router.get('/car_model_by_brand', function (req, res) {
    if (req.query.brand) {
        car_model_helper.get_car_model_by_brand(req.query.brand, function (model_data) {
            if (model_data.status === 0) {
                res.status(config.INTERNAL_SERVER_ERROR).json({"message": "Error has occured in fetching model details"});
            } else if (model_data.status === 404) {
                res.status(config.BAD_REQUEST).json({"message": "No Model found for given brand"});
            } else {
                res.status(config.OK_STATUS).json({"models": model_data.car_model});
            }
        });
    } else {
        res.status(config.VALIDATION_FAILURE_STATUS).json({"message": "Brand name is required"});
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
router.get('/car_year_by_model', function (req, res) {
    if (req.query.model) {
        car_model_helper.get_car_year_by_model(req.query.model, function (car_data) {
            if (car_data.status === 0) {
                res.status(config.INTERNAL_SERVER_ERROR).json({"message": "Error has occured in fetching car details"});
            } else if (car_data.status === 404) {
                res.status(config.BAD_REQUEST).json({"message": "No car found for given model"});
            } else {
                res.status(config.OK_STATUS).json({"cars": car_data.car});
            }
        });
    } else {
        res.status(config.VALIDATION_FAILURE_STATUS).json({"message": "Brand name is required"});
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
            errorMessage: "Mobile number is required.",
            isNumeric: {errorMessage: "Phone number must contain digits only"}
        }
    };
    req.checkBody(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            async.waterfall([
                function (callback) {
                    user_helper.find_user_by_phone(req.body.country_code, req.body.phone, function (user_resp) {
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
                    user_helper.sendOTPtoUser(user, function (data) {
                        if (data.status == config.OK_STATUS) {
                            callback(null, data.result);
                        } else {
                            callback(data);
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    if (err.status == config.VALIDATION_FAILURE_STATUS) {
                        res.status(err.status).json({"message": err.err, "error": err.error});
                    } else {
                        res.status(err.status).json({"message": err.err});
                    }
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
            errorMessage: "Phone number is required.",
            isNumeric: {errorMessage: "Phone number must contain digits only"},
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
                function (callback) {
                    user_helper.find_user_by_phone(req.body.country_code, req.body.phone, function (user_resp) {
                        if (user_resp.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                        } else if (user_resp.status === 404) {
                            callback({"status": config.BAD_REQUEST, "err": "User not exist"});
                        } else {
                            if (user_resp.user.phone_verified === true) {
                                callback({"status": config.BAD_REQUEST, "err": "Phone number is already verified"});
                            } else if (user_resp.user.otp != req.body.otp) {
                                callback({"status": config.BAD_REQUEST, "err": "Invalid otp"});
                            } else {
                                callback(null, user_resp.user);
                            }
                        }
                    });
                },
                function (user, callback) {
                    user_helper.update_user_by_id(user._id, {"otp": "", "phone_verified": true}, function (user_data) {
                        if (user_data.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in updating otp details in database"});
                        } else if (user_data.status === 2) {
                            callback({"status": config.BAD_REQUEST, "err": "There was an issue in updating otp details in database"});
                        } else {
                            callback(null, {"message": "OTP has been verified successfully"});
                        }
                    });
                }
            ], function (err, result) {
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
 * @api {post} /calculate_fare Calculate fare
 * @apiName Calculate fare
 * @apiGroup Root
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} pick_lat Pickup latitude
 * @apiParam {String} pick_long Pickup longitude
 * @apiParam {String} dest_lat Destination latitude
 * @apiParam {String} dest_long Destination longitude
 * 
 * @apiSuccess (Success 200) {String} message Success message.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/calculate_fare', function (req, res) {
    logger.trace("API - Calculate fare called");
    logger.debug("req.body = ", req.body);
    var schema = {
        'pick_lat': {
            notEmpty: true,
            errorMessage: "Pickup latitude is required."
        },
        'pick_long': {
            notEmpty: true,
            errorMessage: "Pickup longitude is required."
        },
        'dest_lat': {
            notEmpty: true,
            errorMessage: "Destination latitude is required."
        },
        'dest_long': {
            notEmpty: true,
            errorMessage: "Destination longitude is required."
        }
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            if ((req.body.pick_lat == req.body.dest_lat) && (req.body.pick_long == req.body.dest_long)) {
                res.status(config.BAD_REQUEST).json({"message": "Pickup and destination localtion can't be same"});
            } else {
                logger.trace("Valid request");
                async.waterfall([
                    function (callback) {
                        logger.trace("Checking pickup location");
                        request({
                            uri: 'https://maps.googleapis.com/maps/api/geocode/json',
                            qs: {
                                latlng: req.body.pick_lat + ',' + req.body.pick_long,
                                key: 'AIzaSyBs4mHzrv6ri0sdkyhcAMuEF0yr-azS9BI',
                                sensor: false
                            }
                        }, function (error, response, body) {
                            logger.trace("Pickup location checking.");

                            body = JSON.parse(body);

                            logger.trace("error = ", error);
                            logger.trace("response.status = ", response.statusCode);

                            logger.trace("body.results = ", body.results);
                            logger.trace("body = ", body);

                            if (!error && response.statusCode == 200 && body && body.results && body.results[0]) {

                                var obj = {};

                                _.filter(body.results[0].address_components, function (comp) {

                                    logger.trace("comp = ", comp);

                                    if (_.indexOf(comp.types, "locality") > -1) {
                                        logger.trace("locality for pickup location : ", comp.long_name);
                                        obj.City = comp.long_name;
                                    } else if (_.indexOf(comp.types, "administrative_area_level_1") > -1) {
                                        logger.trace("administrative_area_level_1 for pickup location : ", comp.short_name);
                                        obj.State = comp.short_name;
                                    } else if (_.indexOf(comp.types, "postal_code") > -1) {
                                        logger.trace("postal_code for pickup location : ", comp.short_name);
                                        obj.ZIP = comp.short_name;
                                    }
                                });
                                logger.trace("Source = ", obj);

                                callback(null, obj);
                            } else {
                                callback({"status": config.BAD_REQUEST, "err": "Unfortunately we are currently unavailable in this area. Please check back soon."});
                            }
                        });
                    },
                    function (pickup_obj, callback) {
                        logger.trace("Checking destination location");
                        request({
                            uri: 'https://maps.googleapis.com/maps/api/geocode/json',
                            qs: {
                                latlng: req.body.dest_lat + ',' + req.body.dest_long,
                                key: 'AIzaSyBs4mHzrv6ri0sdkyhcAMuEF0yr-azS9BI',
                                sensor: false
                            }
                        }, function (error, response, body) {
                            logger.trace("Pickup location checking.");

                            body = JSON.parse(body);

                            logger.trace("error = ", error);
                            logger.trace("response.status = ", response.statusCode);
                            logger.trace("body.results = ", body.results);
                            logger.trace("body = ", body);

                            if (!error && response.statusCode == 200 && body && body.results && body.results[0]) {

                                var obj = {};
                                _.filter(body.results[0].address_components, function (comp) {
                                    logger.trace("comp = ", comp);
                                    if (_.indexOf(comp.types, "locality") > -1) {
                                        obj.City = comp.long_name;
                                    } else if (_.indexOf(comp.types, "administrative_area_level_1") > -1) {
                                        obj.State = comp.short_name;
                                    } else if (_.indexOf(comp.types, "postal_code") > -1) {
                                        obj.ZIP = comp.short_name;
                                    }
                                });
                                logger.trace("Destination = ", obj);
                                callback(null, pickup_obj, obj);
                            } else {
                                callback({"status": config.BAD_REQUEST, "err": "Unfortunately we are currently unavailable in this area. Please check back soon."});
                            }
                        });
                    },
                    function (pickup_obj, dest_obj, callback) {
                        if ((_.indexOf(["NY", "NJ"], pickup_obj.State) > -1) && (_.indexOf(["NY", "NJ"], dest_obj.State) > -1)) {
                            logger.trace("state is from NY and NJ");
                            distance.get({
                                origin: req.body.pick_lat + ',' + req.body.pick_long,
                                destination: req.body.dest_lat + ',' + req.body.dest_long,
                                mode: 'driving',
                                units: 'imperial'
                            }, function (err, data) {
                                if (err) {
                                    callback({"status": config.INTERNAL_SERVER_ERROR, "err": err});
                                } else {
                                    console.log("distance info = ", data);
                                    callback(null, pickup_obj, dest_obj, data)
                                }
                            });
                        } else {
                            logger.trace("State is not from NY and NJ");
                            // We are not providing service in given area
                            callback({"status": config.BAD_REQUEST, "err": "Unfortunately we are currently unavailable in this area. Please check back soon."});
                        }
                    },
                    function (pickup_obj, dest_obj, distance_data, callback) {
                        if (pickup_obj.State == dest_obj.State) {
                            var state = "";
                            if (pickup_obj.State == "NY") {
                                state = "NYC";
                            } else if (pickup_obj.State == "NJ") {
                                state = "New Jersey";
                            } else {
                                callback({"status": config.BAD_REQUEST, "err": "Unfortunately we are currently unavailable in this area. Please check back soon."});
                            }
                            fare_helper.find_fare_by_state(state, function (fare_info) {
                                if (fare_info.status === 0) {
                                    callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There is an issue in fetching fare details"});
                                } else if (fare_info.status === 404 || !fare_info.fare) {
                                    callback({"status": config.BAD_REQUEST, "err": "No fare data available for given state"});
                                } else {
                                    // Fare calculation
                                    var base = fare_info.fare.base * 1;
                                    var per_min = fare_info.fare.per_min * 1;
                                    var per_mile = fare_info.fare.per_mile * 1;
                                    var service_fee = fare_info.fare.service_fee * 1;
                                    var minimum_charge = fare_info.fare.minimum_charge * 1;

                                    var duration_min = ((distance_data.durationValue * 1) / 60);
                                    var per_meter = per_mile / 1609.34;
                                    var final_fare = base + (duration_min * per_min) + (per_meter * distance_data.distanceValue) + service_fee;

                                    if (final_fare < minimum_charge) {
                                        final_fare = minimum_charge;
                                    }
                                    logger.trace('fare = ', final_fare);
                                    callback(null, {"message": "Fare has been calculate", "fare": final_fare});
                                }
                            });
                        } else {
                            // Interstate strip
                            callback({"status": config.BAD_REQUEST, "err": "Fare calculation of interstate trip is under development"});
                        }
                    }
                ], function (err, result) {
                    if (err) {
                        res.status(err.status).json({"message": err.err});
                    } else {
                        res.status(config.OK_STATUS).json(result);
                    }
                });
            }

        } else {
            logger.trace("Invalid request");
            var result = {
                message: "Please select valid address",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
});

/**
 * @api {post} /contact_support Contact support
 * @apiName Contact support
 * @apiGroup Root
 * 
 * @apiParam {String} email Email address of user
 * @apiParam {String} subject Subject of email address
 * @apiParam {String} name Name of user
 * @apiParam {String} phone Phone number of user
 * @apiParam {String} description Email message
 * @apiParam {File} [attachments] Attached files
 * 
 * @apiDescription  You need to pass form-data
 * 
 * @apiSuccess (Success 200) {String} message Success message.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/contact_support', function (req, res) {
    logger.trace("API - Contact support send mail called");
    logger.debug("req.body = ", req.body);
    var schema = {
        'email': {
            notEmpty: true,
            errorMessage: "Email is required.",
            isEmail: {errorMessage: "Please enter valid email address"}
        },
        'subject': {
            notEmpty: true,
            errorMessage: "Subject is required."
        },
        'name': {
            notEmpty: true,
            errorMessage: "Name is required."
        },
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required."
        },
        'description': {
            notEmpty: true,
            errorMessage: "Description is required."
        }
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            
            if(req.files){
				req.files.attachments = [];
				_.each(req.files,function(file,index){
					req.files.attachments.push(file);
				});
			}
            
            var msg = "Hello,</b><br/><br/>";
            msg += "You got new inquiry for greego. Please check below details<br/><br/>";
            
            msg += "<table>";
                msg += "<tr>";
                    msg += "<td width='200'><b>User's Name</b></td>";
                    msg += "<td>"+req.body.name+"</td>";
                msg += "</tr>";
                msg += "<tr>";
                    msg += "<td><b>User's Email</b></td>";
                    msg += "<td>"+req.body.email+"</td>";
                msg += "</tr>";
                msg += "<tr>";
                    msg += "<td><b>Subject</b></td>";
                    msg += "<td>"+req.body.subject+"</td>";
                msg += "</tr>";
                msg += "<tr>";
                    msg += "<td><b>Phone</b></td>";
                    msg += "<td>"+req.body.phone+"</td>";
                msg += "</tr>";
                msg += "<tr>";
                    msg += "<td><b>Description</b></td>";
                    msg += "<td>"+req.body.description+"</td>";
                msg += "</tr>";
            msg += "</table>";
            if(req.files && req.files.attachments.length > 0){
				msg += "<br/>Please check attached documents.<br/>";
			}
            msg += "<br/>Thanks,<br/>Greego Team<hr/>";
            
            if(req.files && req.files.attachments.length > 0){
                console.log("Found attachment");
                var attachments = [];
                async.eachSeries(req.files,function(file,callback){
                    if(file.name){
                        attachments.push({filename:file.name,content:file.data});
                    }
                    callback();
                },function(err){
                    mail_helper.send_with_attachment("support@greego.co", '"Greego Inquiry" support@greego.co', 'New inquiry for greego', '', msg, attachments, function (resp) {
                        if (resp.status === 0) {
                            res.status(config.INTERNAL_SERVER_ERROR).json({"message": "Error occured in sending inquiry"});
                        } else {
                            res.status(config.OK_STATUS).json({"message": "Inquiry has been sent to support team"});
                        }
                    });
                });
                
            } else {
                mail_helper.send("support@greego.co", '"Greego Inquiry" support@greego.co', 'New inquiry for greego', '', msg, function (resp) {
                    if (resp.status === 0) {
                        res.status(config.INTERNAL_SERVER_ERROR).json({"message": "Error occured in sending inquiry"});
                    } else {
                        res.status(config.OK_STATUS).json({"message": "Inquiry has been sent to support team"});
                    }
                });
            }
        } else {
            logger.trace("Invalid request");
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });
})

module.exports = router;