var Card = require("../models/card");
var card_helper = {};

/*
 * find_card_by_id is used to fetch single card by card_id
 * 
 * @param   card_id   Specify card_id
 * 
 * @return  status  0 - If any error occur in finding card, with error
 *          status  1 - If card found, with found card document
 *          status  404 - If card not found, with appropriate error message
 * 
 * @developed by "ar"
 */
card_helper.find_card_by_id = function(card_id,callback){
    Card.findOne({ _id: card_id }).lean().exec(function (err, card_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(card_data){
                callback({"status":1,"user":card_data});
            } else {
                callback({"status":404,"err":"Card not available"});
            }
        }
    });
};

/*
 * insert_card is used to insert card in database
 * 
 * @param   card_object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting card, with error
 *          status  1 - If card found, with inserted card document and appropriate message
 * 
 * @developed by "ar"
 */
card_helper.insert_card = function(card_object,callback){
    var card = new Card(card_object);
    card.save(function(err,card_data){
        if(err){
            callback({"status":0,"err":err});
        } else {
            callback({"status":1,"message":"Card inserted","card":card_data});
        }
    });
};

/*
 * update_card_by_id is used to update card data based on card_id
 * 
 * @param   card_id         String  _id of card that need to be update
 * @param   card_object     JSON    object consist of all property that need to update
 * 
 * @return  status  0 - If any error occur in updating card, with error
 *          status  1 - If card updated successfully, with appropriate message
 *          status  2 - If card not updated, with appropriate message
 * 
 * @developed by "ar"
 */
card_helper.update_card_by_id = function(card_id,update_obj,callback){
    Card.update({_id:{$eq : card_id}},{$set:update_obj},function(err,update_data){
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if (update_data.n == 1) {
                callback({"status":1,"message":"Record has been updated"});
            } else {
                callback({"status":2,"message":"Record has not updated"});
            }
        }
    });
};

module.exports = card_helper;