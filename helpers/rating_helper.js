var Rating = require("../models/rating");
var rating_helper = {};

/*
 * insert_rating is used to insert rating in database
 * 
 * @param   rating_object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting rating, with error
 *          status  1 - If rating inserted, with inserted rating document and appropriate message
 * 
 * @developed by "ar"
 */
rating_helper.insert_rating = function(rating_object,callback){
    var rating = new Rating(rating_object);
    rating.save(function(err,rating_data){
        if(err){
            callback({"status":0,"err":err});
        } else {
            callback({"status":1,"message":"Rating added"});
        }
    });
};


module.exports = rating_helper;