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

module.exports = router;