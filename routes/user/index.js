var express = require('express');
var router = express.Router();

var async = require('async');
var request = require('request');
var _ = require('underscore');
var distance = require('google-distance');

var config = require('../../config');
var car_helper = require("../../helpers/car_helper");
var user_helper = require("../../helpers/user_helper");
var feedback_helper = require("../../helpers/feedback_helper");
var fare_helper = require("../../helpers/fare_helper");
var twilio_helper = require("../../helpers/twilio_helper");
var driver_helper = require("../../helpers/driver_helper");

distance.apiKey = config.GOOGLE_API_KEY; // https://github.com/edwlook/node-google-distance

/**
 * @api {post} /user/feedback Customer support
 * @apiName Customer support
 * @apiGroup User
 * 
 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiParam {String} message message given by user
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/feedback', function (req, res) {
    var schema = {
        'message': {
            notEmpty: true,
            errorMessage: "Message is required"
        }
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            feedback_obj = {
                "user_id": req.userInfo.id,
                "message": req.body.message
            };
            feedback_helper.insert_feedback(feedback_obj, function (resp) {
                if (resp.status === 0) {
                    res.status(config.INTERNAL_SERVER_ERROR).json({"message": "Error occur while inserting feedback"});
                } else {
                    res.status(config.OK_STATUS).json({"message": "Feedback has been submitted"});
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
 * @api {put} /user/update Update user profile
 * @apiName Update user profile
 * @apiGroup User
 * 
 * @apiDescription You need to pass form-data
 * 
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiParam {String} [first_name] First name of user
 * @apiParam {String} [last_name] Last name of user
 * @apiParam {String} email Email address
 * @apiParam {String} phone Phone number of user
 * @apiParam {String} [password] Password
 * @apiParam {File} [avatar] Profile image of user
 * @apiParam {String} [emergency_contact] Emergency contact number
 * @apiParam {String} car_id Reference of selected car
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.put('/update', function (req, res) {
    var schema = {
        'email': {
            notEmpty: true,
            errorMessage: "Email address is required"
        },
        'phone': {
            notEmpty: true,
            errorMessage: "Phone number is required"
        },
        'car_id': {
            notEmpty: true,
            errorMessage: "Car reference is required"
        }
    };
    req.checkBody(schema);

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            async.waterfall([
                function (callback) {
                    // Check for valid car reference
                    car_helper.find_car_by_id(req.body.car_id, function (car_resp) {
                        if (car_resp.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": car_resp.err});
                        } else if (car_resp.status === 404) {
                            callback({"status": config.BAD_REQUEST, "err": car_resp.err});
                        } else {
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    // Car reference is valid, Check user validity
                    user_helper.find_user_by_email(req.body.email, function (user_resp) {
                        if (user_resp.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                        } else if (user_resp.status === 1) {
                            if (req.userInfo.email == req.body.email) {
                                callback(null, user_resp.user);
                            } else {
                                callback({"status": config.BAD_REQUEST, "err": "User with given email is already exist"});
                            }
                        } else {
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
                        }
                    });
                },
                function (user, callback) {
                    // Upload user avatar
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
                                    callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading image"});
                                } else {
                                    callback(null, user, filename);
                                }
                            });
                        } else {
                            callback({"status": config.VALIDATION_FAILURE_STATUS, "err": "Image format is invalid"});
                        }
                    } else {
                        callback(null, user, null);
                    }
                },
                function (user, image_name, callback) {
                    // User updation
                    var user_obj = {
                        "email": req.body.email,
                        "car": req.body.car_id
                    };

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
                    if (image_name) {
                        user_obj.user_avatar = image_name;
                    }
                    if (req.body.emergency_contact) {
                        user_obj.emergency_contact = req.body.emergency_contact;
                    }

                    user_helper.update_user_by_id(req.userInfo.id, user_obj, function (user_data) {
                        if (user_data.status === 0) {
                            callback({"status": config.INTERNAL_SERVER_ERROR, "err": "There was an issue in user registration"});
                        } else if (user_data.status === 2) {
                            callback({"status": config.BAD_REQUEST, "err": "There was an issue in user registration"});
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
 * @api {get} /user/sendotp Send / Re-send OTP
 * @apiName Send / Re-send OTP
 * @apiGroup User
 * 
 * @apiHeader {String}  x-access-token User's unique access-key
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiSuccess (Success 200) {String} message Success message.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/sendotp', function (req, res) {
    /*var schema = {
        'mobileNo': {
            notEmpty: true,
            errorMessage: "Mobile number is required."
        }
    };
    req.checkBody(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            
        } else {
            var result = {
                message: "Validation Error",
                error: result.array()
            };
            res.status(config.VALIDATION_FAILURE_STATUS).json(result);
        }
    });*/
    // Generate random code
    var code = Math.floor(100000 + Math.random() * 900000);

    async.waterfall([
        function(callback){
            user_helper.find_user_by_id(req.userInfo.id,function(user_resp){
                if (user_resp.status === 0) {
                    callback({"status": config.INTERNAL_SERVER_ERROR, "err": user_resp.err});
                } else if (user_resp.status === 404) {
                    callback({"status": config.BAD_REQUEST, "err": "User not exist"});
                } else {
                    callback(null, user_resp.user.phone);
                }
            });
        },
        function(phone_no,callback){
            twilio_helper.sendSMS(phone_no, 'Use ' + code + ' as Greego account security code',function(sms_data){
                if(sms_data.status === 0){
                    callback({"status":config.VALIDATION_FAILURE_STATUS,"err":sms_data.err});
                } else {
                    callback(null);
                }
            });
        },
        function(callback){
            user_obj = {
                "otp":code,
                "phone_verified":false
            };
            user_helper.update_user_by_id(req.userInfo.id,user_obj,function(user_data){
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
});

/**
 * @api {post} /user/verifyotp Verify OTP
 * @apiName Otp verification
 * @apiGroup User
 * 
 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiParam {Number} otp Random six digit code
 * 
 * @apiSuccess (Success 200) {String} message Success message.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/verifyotp', function (req, res) {
    var schema = {
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
                    user_helper.find_user_by_id(req.userInfo.id,function(user_resp){
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
                                callback(null);
                            }
                        }
                    });
                },
                function(callback){
                    user_helper.update_user_by_id(req.userInfo.id,{"otp":"","phone_verified":true},function(user_data){
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

/**
 * @api {post} /user/calculate_fare Calculate fare
 * @apiName Calculate fare
 * @apiGroup User
 * 
 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiParam {String} pick_lat Pickup latitude
 * @apiParam {String} pick_long Pickup longitude
 * @apiParam {String} dest_lat Destination latitude
 * @apiParam {String} dest_long Destination longitude
 * 
 * @apiSuccess (Success 200) {String} message Success message.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/calculate_fare',function(req,res){
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
            async.waterfall([
                function(callback){
                    request({
                        uri: 'http://maps.googleapis.com/maps/api/geocode/json',
                        qs: {
                            latlng: req.body.pick_lat + ',' + req.body.pick_long,
                            sensor: false
                        }
                    }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            body = JSON.parse(body);
                            var obj = {};
                            _.filter(body.results[0].address_components, function (comp) {
                                if (_.indexOf(comp.types, "locality") > -1) {
                                    obj.City = comp.long_name;
                                } else if (_.indexOf(comp.types, "administrative_area_level_1") > -1) {
                                    obj.State = comp.short_name;
                                } else if (_.indexOf(comp.types, "postal_code") > -1) {
                                    obj.ZIP = comp.short_name;
                                }
                            });
                            callback(null, obj);
                        } else {
                            callback({"status": config.BAD_REQUEST,"message": "Unfortunately we are currently unavailable in this area. Please check back soon."});
                        }
                    });
                },
                function(pickup_obj,callback){
                    request({
                        uri: 'http://maps.googleapis.com/maps/api/geocode/json',
                        qs: {
                            latlng: req.body.dest_lat + ',' + req.body.dest_long,
                            sensor: false
                        }
                    }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            body = JSON.parse(body);
                            var obj = {};
                            _.filter(body.results[0].address_components, function (comp) {
                                if (_.indexOf(comp.types, "locality") > -1) {
                                    obj.City = comp.long_name;
                                } else if (_.indexOf(comp.types, "administrative_area_level_1") > -1) {
                                    obj.State = comp.short_name;
                                } else if (_.indexOf(comp.types, "postal_code") > -1) {
                                    obj.ZIP = comp.short_name;
                                }
                            });
                            callback(null,pickup_obj,obj);
                        } else {
                            callback({"status": config.BAD_REQUEST,"message": "Unfortunately we are currently unavailable in this area. Please check back soon."});
                        }
                    });
                },
                function(pickup_obj,dest_obj,callback){
                    if((_.indexOf(["NY","NJ"],pickup_obj.State) > -1) && (_.indexOf(["NY","NJ"],dest_obj.State) > -1)){
                        distance.get({
                            origin: req.body.pick_lat+','+req.body.pick_long,
                            destination: req.body.dest_lat+','+req.body.dest_long,
                            mode: 'driving',
                            units: 'imperial'
                        },function(err, data) {
                            if (err) {
                                callback({"status":config.INTERNAL_SERVER_ERROR,"messgae":err});
                            } else {
                                console.log("distance info = ",data);
                                callback(null,pickup_obj,dest_obj,data)
                            }
                        });
                    } else {
                        // We are not providing service in given area
                        callback({"status": config.BAD_REQUEST,"message": "Unfortunately we are currently unavailable in this area. Please check back soon."});
                    }
                },
                function(pickup_obj,dest_obj,distance_data,callback){
                    if(pickup_obj.State == dest_obj.State){
                        var state = "";
                        if(pickup_obj.State == "NY"){
                            state = "NYC";
                        } else if(pickup_obj.State == "NJ"){
                            state = "New Jersey";
                        } else {
                            callback({"status": config.BAD_REQUEST,"message": "Unfortunately we are currently unavailable in this area. Please check back soon."});
                        }
                        fare_helper.find_fare_by_state(state,function(fare_info){
                            if(fare_info.status === 0){
                                callback({"status":config.INTERNAL_SERVER_ERROR,"message":"There is an issue in fetching fare details"});
                            } else if(fare_info.status === 404 || !fare_info.fare){
                                callback({"status":config.BAD_REQUEST,"message":"No fare data available for given state"});
                            } else {
                                // Fare calculation
                                var base = fare_info.fare.base * 1;
                                var per_min = fare_info.fare.per_min * 1;
                                var per_mile = fare_info.fare.per_mile * 1;
                                var service_fee = fare_info.fare.service_fee * 1;
                                var minimum_charge = fare_info.fare.minimum_charge * 1;
                                
                                var duration_min = ((distance_data.durationValue * 1) / 60);
                                var per_meter = per_mile/1609.34;
                                var final_fare = base + (duration_min * per_min) + (per_meter * distance_data.distanceValue) + service_fee;
                                
                                if(final_fare < minimum_charge){
                                    final_fare = minimum_charge;
                                }
                                callback(null,{"message":"Fare has been calculate","fare":final_fare});
                            }
                        });
                    } else {
                        // Interstate strip
                        callback({"status":config.OK_STATUS,"message":"Fare calculation of interstate trip is under development"});
                    }
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
 * @api {get} /user/get_driver_by_id Get driver by id
 * @apiName Get driver by id
 * @apiGroup User
 * 
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiParam {String} driver_id Id of driver
 * 
 * @apiSuccess (Success 200) {String} car List of car.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/get_driver_by_id',function(req,res){
    if(req.query.driver_id){
        driver_helper.find_driver_by_id(req.query.driver_id,function(driver_data){
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
                    "phone":driver_data.driver.phone,
                    "transmission_type":driver_data.driver.transmission_type,
                    "ssn":driver_data.driver.ssn,
                    "driver_avatar":driver_data.driver.driver_avatar,
                    "drive_type":driver_data.driver.drive_type,
                    "current_lat":driver_data.driver.current_lat,
                    "current_long":driver_data.driver.current_long,
                    "avg_rate":driver_data.driver.rate.avg_rate
                }
                res.status(config.OK_STATUS).json(ret_driver);
            }
        });
    } else {
        res.status(config.VALIDATION_FAILURE_STATUS).json({"message":"Driver id is required"});
    }
});

module.exports = router;