var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');

var async = require('async');
var _ = require('underscore');

var config = require('../../config');
var logger = config.logger;

var faq_helper = require('../../helpers/faq_helper');

/**
 * @api {post} /faq Create faq
 * @apiName Create faq
 * @apiGroup Admin
 * 
 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token Admin's unique access-key
 * 
 * @apiParam {String} question FAQ question
 * @apiParam {String} answer FAQ answer
 * @apiParam {String} category_id Category of FAQ
 * @apiParam {String} [is_active] Activation status for faq
 * 
 * @apiSuccess (Success 200) {JSON} faq FAQ details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/',function(req, res){
    var schema = {
        "question":{
            notEmpty: true,
            errorMessage: "Question is required"
        },
        "answer":{
            notEmpty: true,
            errorMessage: "Answer is required"
        },
        "category_id":{
            notEmpty: true,
            errorMessage: "Category is required"
        }
    };

    req.checkBody(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            var obj = {
                'question':req.body.question,
                'answer':req.body.answer,
                'category_id':req.body.category_id
            };
            if(req.body.is_active && req.body.is_active != null){
                obj.is_active = req.body.is_active;
            }
            faq_helper.insert_faq(obj,function(resp){
                if(resp.status == 0){
                    res.status(config.INTERNAL_SERVER_ERROR).json({"error":resp.err});
                } else {
                    res.status(config.OK_STATUS).json({"message":"FAQ inserted successfully","faq":resp.faq});
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
 * @api {put} /faq Update faq
 * @apiName Update faq
 * @apiGroup Admin
 * 
 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token Admin's unique access-key
 * 
 * @apiParam {String} id FAQ Id
 * @apiParam {String} question FAQ question
 * @apiParam {String} answer FAQ answer
 * @apiParam {String} category_id Category of FAQ
 * @apiParam {String} [is_active] Activation status for faq
 * 
 * @apiSuccess (Success 200) {JSON} driver Driver details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.put('/',function(req, res){
    var schema = {
        "id":{
            notEmpty: true,
            errorMessage: "Category id is required"
        },
        "question":{
            notEmpty: true,
            errorMessage: "Question is required"
        },
        "answer":{
            notEmpty: true,
            errorMessage: "Answer is required"
        },
        "category_id":{
            notEmpty: true,
            errorMessage: "Category is required"
        }
    };

    req.checkBody(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            var obj = {
                'question':req.body.question,
                'answer':req.body.answer,
                'category_id':req.body.category_id
            };
            if(req.body.is_active && req.body.is_active != null){
                obj.is_active = req.body.is_active;
            }
            faq_helper.update_faq_by_id(req.body.id,obj,function(resp){
                if(resp.status == 0){
                    res.status(config.INTERNAL_SERVER_ERROR).json({"error":resp.err});
                } else {
                    res.status(config.OK_STATUS).json({"message":"FAQ has been updated successfully"});
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
 * @api {delete} /faq Delete faq
 * @apiName Delete faq
 * @apiGroup Admin
 * 
 * @apiHeader {String}  x-access-token Admin's unique access-key
 * 
 * @apiParam {String} id FAQ Id
 * 
 * @apiSuccess (Success 200) {String} Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.delete('/',function(req, res){
    logger.trace("Delete FAQ API called");
    var schema = {
        "id":{
            notEmpty: true,
            errorMessage: "FAQ id is required"
        }
    };

    req.checkQuery(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            logger.trace("Delete FAQ API - Valid request. Id = ",req.query.id);
            faq_helper.delete_faq_by_id(req.query.id,function(resp){
                if(resp.status == 0){
                    res.status(config.INTERNAL_SERVER_ERROR).json({"error":resp.err});
                } else {
                    res.status(config.OK_STATUS).json({"message":"FAQ has been deleted successfully"});
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