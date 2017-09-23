var Feedback = require("../models/feedback");
var feedback_helper = {};

/*
 * insert_feedback is used to insert feedback in database
 * 
 * @param   feedback_object JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting feedback, with error
 *          status  1 - If feedback inserted, with inserted feedback document and appropriate message
 * 
 * @developed by "ar"
 */
feedback_helper.insert_feedback = function(feedback_object,callback){
    var feedback = new Feedback(feedback_object);
    feedback.save(function(err,feedback_data){
        if(err){
            callback({"status":0,"err":err});
        } else {
            callback({"status":1,"message":"Rating added"});
        }
    });
};


module.exports = feedback_helper;