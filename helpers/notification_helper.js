var Notification = require("../models/notification");
var notification_helper = {};

/*
 * insert_notification is used to insert notification in database
 * 
 * @param   notification_object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting notification, with error
 *          status  1 - If notification inserted, with inserted notification document and appropriate message
 * 
 * @developed by "ar"
 */
notification_helper.insert_notification = function(notification_object,callback){
    var notification = new Notification(notification_object);
    notification.save(function(err,notification_data){
        if(err){
            callback({"status":0,"err":err});
        } else {
            callback({"status":1,"message":"Notification added","notification":notification_data});
        }
    });
};

/*
 * get_notification_by_to_id is used to fetch notification from database for particular user
 * 
 * @param   notification_object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting notification, with error
 *          status  1 - If notification inserted, with inserted notification document and appropriate message
 * 
 * @developed by "ar"
 */
notification_helper.get_notification_by_to_id = function(to_id,callback){
    Notification.find({"to_id":{$eq:to_id}}).lean().exec(function(err,notification_data){
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(notification_data && notification_data.length > 0){
                callback({"status":1,"notification":notification_data});
            } else {
                callback({"status":404,"err":"No notification"});
            }
        }
    });
}

module.exports = notification_helper;