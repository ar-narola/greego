var HelpCategory = require("../models/help_category");
var category_helper = {};
var async = require('async');
var _ = require('underscore');

var config = require("../config");
var logger = config.logger;

/*
 * find_category_by_id is used to fetch single category by category_id
 * 
 * @param   category_id   Specify category_id of category
 * 
 * @return  status  0 - If any error occur in finding category, with error
 *          status  1 - If Category found, with found category document
 *          status  404 - If Category not found, with appropriate error message
 * 
 * @developed by "ar"
 */
category_helper.find_category_by_id = function(category_id,callback){
    HelpCategory.findOne({ _id: category_id })
            .populate({path:'parent_id','model':'help_categories'})
            .lean().exec(function (err, category_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(category_data){
                callback({"status":1,"category":category_data});
            } else {
                callback({"status":404,"err":"Category not available"});
            }
        }
    });
};

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

/*
 * update_category_by_id is used to update category in database
 * 
 * @param   category_id String  _id of user that need to be update
 * @param   update_obj  JSON object consist of all property that need to update in collection
 * 
 * @return  status  0 - If any error occur in updating category, with error
 *          status  1 - If category updated successfully, with appropriate message
 *          status  2 - If category not updated, with appropriate message
 * 
 * @developed by "ar"
 */
category_helper.update_category_by_id = function(category_id,update_obj,callback){
    HelpCategory.update({_id:{$eq : category_id}},{$set:update_obj},function(err,update_data){
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if (update_data.nModified == 1) {
                callback({"status":1,"message":"Record has been updated"});
            } else {
                callback({"status":2,"message":"Record has not updated"});
            }
        }
    });
};

/*
 * delete_category_by_id is used to delete category in database
 * 
 * @param   category_id String  _id of user that need to be delete
 * 
 * @return  status  0 - If any error occur in deletion of category, with error
 *          status  1 - If category deleted successfully, with appropriate message
 * 
 * @developed by "ar"
 */
category_helper.delete_category_by_id = function(category_id,callback){
    HelpCategory.remove({_id:{$eq : category_id}},function(err,delete_resp){
        if (err) {
            callback({"status":0,"err":err});
        } else {
            callback({"status":1,"message":"Record has been deleted"});
        }
    });
};

category_helper.get_all_category = function(callback){
    /*HelpCategory.aggregate([
        {
            "$lookup":{
                "from":"help_categories",
                "localField":"parent_id",
                "foreignField":"_id",
                "as":"parent"
            }
        }
    ],function(err,category){
        if(err){
            callback(err);
        } else {
            callback(category);
        }
    });*/
    HelpCategory.find({})
        .populate({'path':'parent_id','model':'help_categories'})
        .lean()
        .exec(function (err, category_data) {
            if (err) {
                callback({"status":0,"err":err});
            } else {
                if(category_data){
                    callback({"status":1,"categories":category_data});
                } else {
                    callback({"status":404,"err":"No category available"});
                }
            }
        });
}

module.exports = category_helper;