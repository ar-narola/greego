var FAQ = require("../models/faq");
var faq_helper = {};
var async = require('async');
var _ = require('underscore');

var config = require("../config");
var logger = config.logger;

/*
 * insert_faq is used to insert faq in database
 * 
 * @param   faq_object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting user, with error
 *          status  1 - If User found, with inserted user document and appropriate message
 * 
 * @developed by "ar"
 */
faq_helper.insert_faq = function(faq_object,callback){
    var faq = new FAQ(faq_object);
    faq.save(function(err,faq_data){
        if(err){
            callback({"status":0,"err":err});
        } else {
            callback({"status":1,"message":"FAQ has been inserted","faq":faq_data});
        }
    });
};

/*
 * update_faq_by_id is used to update faq in database
 * 
 * @param   faq_id String  _id of faq that need to be update
 * @param   update_obj  JSON object consist of all property that need to update in collection
 * 
 * @return  status  0 - If any error occur in updating faq, with error
 *          status  1 - If faq updated successfully, with appropriate message
 *          status  2 - If faq not updated, with appropriate message
 * 
 * @developed by "ar"
 */
faq_helper.update_faq_by_id = function(faq_id,update_obj,callback){
    FAQ.update({_id:{$eq : faq_id}},{$set:update_obj},function(err,update_data){
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
faq_helper.delete_faq_by_id = function(faq_id,callback){
    FAQ.remove({_id:{$eq : faq_id}},function(err,delete_resp){
        if (err) {
            callback({"status":0,"err":err});
        } else {
            callback({"status":1,"message":"Record has been deleted"});
        }
    });
};

faq_helper.get_all_faq = function(callback){
    FAQ.find({})
        .populate({'path':'category_id','model':'help_categories'})
        .lean()
        .exec(function (err, faq_data) {
            if (err) {
                callback({"status":0,"err":err});
            } else {
                if(faq_data){
                    callback({"status":1,"faqs":faq_data});
                } else {
                    callback({"status":404,"err":"No FAQ available"});
                }
            }
        });
}

faq_helper.get_faq_by_category = function(cat_id,callback){
    FAQ.find({'category_id':{$eq:cat_id}})
        .populate({'path':'category_id','model':'help_categories'})
        .lean()
        .exec(function (err, faq_data) {
            if (err) {
                callback({"status":0,"err":err});
            } else {
                if(faq_data){
                    callback({"status":1,"faqs":faq_data});
                } else {
                    callback({"status":404,"err":"No FAQ available"});
                }
            }
        });
}

/*
 * find_faq_by_id is used to fetch single faq by faq_id
 * 
 * @param   faq_id   Specify faq_id of faq
 * 
 * @return  status  0 - If any error occur in finding faq, with error
 *          status  1 - If Faq found, with found faq document
 *          status  404 - If Faq not found, with appropriate error message
 * 
 * @developed by "ar"
 */
faq_helper.find_faq_by_id = function(faq_id,callback){
    FAQ.findOne({ _id: faq_id })
            .populate({path:'category_id','model':'help_categories'})
            .lean().exec(function (err, faq_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(faq_data){
                callback({"status":1,"faq":faq_data});
            } else {
                callback({"status":404,"err":"Faq not available"});
            }
        }
    });
};

module.exports = faq_helper;