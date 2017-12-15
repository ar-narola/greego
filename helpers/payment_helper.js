var async = require('async');

var Payment = require("../models/payment");
var payment_helper = {};

/*
 * insert_payment is used to insert payment in database
 * 
 * @param   payment_object  JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting user, with error
 *          status  1 - If insertion successful, with inserted payment document and appropriate message
 * 
 * @developed by "ar"
 */
payment_helper.insert_payment = function(payment_object,callback){
    var payment = new Payment(payment_object);
    payment.save(function(err,payment_data){
        if(err){
            callback({"status":0,"err":err});
        } else {
            console.log(payment_data);
            callback({"status":1,"message":"Payment inserted","payment":payment_data});
        }
    });
};

/*
 * find_payment_by_id is used to fetch single payment by payment_id
 * 
 * @param   payment_id   Specify payment_id of payment
 * 
 * @return  status  0 - If any error occur in finding payment, with error
 *          status  1 - If payment found, with found payment document
 *          status  404 - If payment not found, with appropriate error message
 * 
 * @developed by "ar"
 */
payment_helper.find_payment_by_id = function(payment_id,callback){
    Payment.findOne({ _id: payment_id }).lean().exec(function (err, payment_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(payment_data){
                callback({"status":1,"payment":payment_data});
            } else {
                callback({"status":404,"err":"Payment not available"});
            }
        }
    });
};

/*
 * update_payment_by_id is used to update payment data based on payment_id
 * 
 * @param   payment_id         String  _id of payment that need to be update
 * @param   payment_object     JSON    object consist of all property that need to update
 * 
 * @return  status  0 - If any error occur in updating payment, with error
 *          status  1 - If payment updated successfully, with appropriate message
 *          status  2 - If payment not updated, with appropriate message
 * 
 * @developed by "ar"
 */
payment_helper.update_payment_by_id = function(payment_id,update_obj,callback){
    Payment.update({_id:{$eq : payment_id}},{$set:update_obj},function(err,update_data){
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

module.exports = payment_helper;