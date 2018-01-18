var HelpCategory = require("../models/help_category");
var category_helper = {};
var async = require('async');
var _ = require('underscore');

var config = require("../config");
var logger = config.logger;

/*
 * insert_category is used to insert category in database
 * 
 * @param   category_object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting user, with error
 *          status  1 - If User found, with inserted user document and appropriate message
 * 
 * @developed by "ar"
 */
category_helper.insert_category = function(category_object,callback){
    var category = new HelpCategory(category_object);
    category.save(function(err,category_data){
        if(err){
            callback({"status":0,"err":err});
        } else {
            callback({"status":1,"message":"Category inserted","category":category_data});
        }
    });
};