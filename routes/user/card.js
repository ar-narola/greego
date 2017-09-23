var express = require('express');
var router = express.Router();
var async = require('async');

var config = require('../../config');
var card_helper = require("../../helpers/card_helper");
var user_helper = require("../../helpers/user_helper");

/**
 * @api {post} /user/card/add Add card for user
 * @apiName Add card for user
 * @apiGroup User-card
 * 
 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiParam {String} card_no Credit card number
 * @apiParam {Number} month Expire month of credit card
 * @apiParam {Number} year Expire year of credit card
 * @apiParam {Boolean} is_default Specify card is default card of user
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/add',function(req,res){
    var schema = {
        "card_no":{
            notEmpty: true,
            errorMessage: "Card number is required"
        },
        "month":{
            notEmpty: true,
            errorMessage: "Month is required"
        },
        "year":{
            notEmpty: true,
            errorMessage: "Year is required"
        },
        "is_default":{
            notEmpty: true,
            errorMessage: "is_default is required"
        }
    };

    req.checkBody(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            
            async.waterfall([
                function(callback){
                    var card_obj = {
                        "card_number":req.body.card_no,
                        "month":req.body.month,
                        "year":req.body.year
                    };
                    card_helper.insert_card(card_obj,function(card_data){
                        if(card_data.status === 0){
                            callback({"status":config.INTERNAL_SERVER_ERROR,"resp":{"message":card_data.err}})
                        } else {
                            callback(null,card_data.card);
                        }
                    });
                },
                function(card,callback){
                    user_helper.add_card_to_user(req.userInfo.id,card._id,req.body.is_default,function(update_data){
                        if(update_data.status === 1){
                            callback(null,{"message":"card has been added"});
                        } else {
                            callback({"status":config.INTERNAL_SERVER_ERROR,"resp":{"message":update_data.err}})
                        }
                    });
                }
            ],function(err,result){
                if(err){
                    res.status(err.status).json(err.resp);
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
 * @api {delete} /user/card/delete Delete card for user
 * @apiName Delete card for user
 * @apiGroup User-card
 * 
 * @apiHeader {String}  x-access-token User's unique access-key
 * 
 * @apiParam {String} card_id Credit card id
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.delete('/delete',function(req,res){
    var schema = {
        "card_id":{
            notEmpty: true,
            errorMessage: "Card number is required"
        }
    };
    
    req.checkBody(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            user_helper.delete_card_from_user(req.userInfo.id,req.body.card_id,function(update_data){
                if(update_data.status === 0){
                    res.status(config.INTERNAL_SERVER_ERROR).json({"message":"There was an issue in removing card"});
                } else if(update_data.status === 2) {
                    res.status(config.BAD_REQUEST).json({"message":"Card does not belongs to user"});
                } else {
                    res.status(config.OK_STATUS).json({"message":"Card has been deleted"});
                }
            });
            /*async.waterfall([
                function(callback){
                    
                }
            ],function(err,result){
                if(err){
                    res.status(err.status).json(err.resp);
                } else {
                    res.status(config.OK_STATUS).json(result);
                }
            });*/
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