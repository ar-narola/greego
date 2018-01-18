var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');

var async = require('async');
var _ = require('underscore');

var config = require('../../config');
var logger = config.logger;

var category_helper = require('../../helpers/help_category_helper');

/**
 * @api {post} /category/create Create category
 * @apiName Create category
 * @apiGroup Admin
 * 
 * @apiHeader {String}  x-access-token Admin's unique access-key
 * 
 * @apiParam {String} name Name of category
 * @apiParam {String} [parent_id] Parent category Id
 * @apiParam {String} [content] Additional description for category
 * @apiParam {File} [icon] Icon image of user
 * 
 * @apiSuccess (Success 200) {JSON} driver Driver details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/create',function(req, res){
    var schema = {
        "name":{
            notEmpty: true,
            errorMessage: "Card number is required"
        }
    };

    req.checkBody(schema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            async.waterfall([
                function (callback) {
                    // Upload user avatar
                    logger.trace("Uploading category icon in create category API");
                    if (req.files && req.files['icon']) {
                        var file = req.files['icon'];
                        var dir = "./uploads/category_icon";
                        var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                        if (mimetype.indexOf(file.mimetype) != -1) {
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
                            extention = path.extname(file.name);
                            filename = "category_" + new Date().getTime() + extention;
                            file.mv(dir + '/' + filename, function (err) {
                                if (err) {
                                    logger.error("There was an issue in uploading image");
                                    callback({"status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading category icon"});
                                } else {
                                    logger.trace("Category icon has been uploaded. Image name = ",filename);
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
                function(image_name,callback){
                    var obj = {'name':req.body.name};
                    if(req.body.parent_id){
                        obj.parent_id = req.body.parent_id;
                    }
                    if(req.body.content){
                        obj.content = req.body.content;
                    }
                    if(image_name && image_name != null){
                        obj.image = image_name;
                    }
                    category_helper.insert_category(obj,function(resp){
                        if(resp.status == 0){
                            res.status(config.INTERNAL_SERVER_ERROR).json({"error":resp.err});
                        } else {
                            res.status(config.OK_STATUS).json({"message":"Category inserted successfully","category":resp.category});
                        }
                    });
                }
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