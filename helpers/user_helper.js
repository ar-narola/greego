var User = require("../models/user");
var user_helper = {};
var async = require('async');

/*
 * find_user_by_email is used to fetch single user by email addres
 * 
 * @param   email   Specify email address of user
 * 
 * @return  status  0 - If any error occur in finding user, with error
 *          status  1 - If User found, with found user document
 *          status  404 - If User not found, with appropriate error message
 * 
 * @developed by "ar"
 */
user_helper.find_user_by_email = function(email,callback){
    User.findOne({ email: email }).lean().exec(function (err, user_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(user_data){
                callback({"status":1,"user":user_data});
            } else {
                callback({"status":404,"err":"User not available"});
            }
        }
    });
};

/*
 * find_user_by_id is used to fetch single user by user_id
 * 
 * @param   user_id   Specify user_id of user
 * 
 * @return  status  0 - If any error occur in finding user, with error
 *          status  1 - If User found, with found user document
 *          status  404 - If User not found, with appropriate error message
 * 
 * @developed by "ar"
 */
user_helper.find_user_by_id = function(user_id,callback){
    User.findOne({ _id: user_id })
            .populate({path:'card.card','model':'cards'})
            .lean().exec(function (err, user_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(user_data){
                callback({"status":1,"user":user_data});
            } else {
                callback({"status":404,"err":"User not available"});
            }
        }
    });
};

/*
 * find_user_by_phone is used to fetch single user by phone number
 * 
 * @param   phone   Specify phone number of user
 * 
 * @return  status  0 - If any error occur in finding user, with error
 *          status  1 - If User found, with found user document
 *          status  404 - If User not found, with appropriate error message
 * 
 * @developed by "ar"
 */
user_helper.find_user_by_phone = function(country_code,phone,callback){
    User.findOne({ phone: phone, country_code: country_code }).lean().exec(function (err, user_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(user_data){
                callback({"status":1,"user":user_data});
            } else {
                callback({"status":404,"err":"User not available"});
            }
        }
    });
};

/*
 * chk_phone_for_user is used to fetch single user by phone number
 * 
 * @param   phone   Specify phone number of user
 * @param   user_id Specify user id of user
 * 
 * @return  status  0 - If any error occur in finding user, with error
 *          status  1 - If User found, with found user document
 *          status  404 - If User not found, with appropriate error message
 * 
 * @developed by "ar"
 */
user_helper.chk_phone_for_user = function(phone,user_id,callback){
    User.findOne({ phone: phone,_id:{$ne:user_id} }).lean().exec(function (err, user_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(user_data){
                callback({"status":1,"user":user_data});
            } else {
                callback({"status":404,"err":"User not available"});
            }
        }
    });
};

/*
 * insert_user is used to insert user in database
 * 
 * @param   user_object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting user, with error
 *          status  1 - If User found, with inserted user document and appropriate message
 * 
 * @developed by "ar"
 */
user_helper.insert_user = function(user_object,callback){
    var user = new User(user_object);
    user.save(function(err,user_data){
        if(err){
            callback({"status":0,"err":err});
        } else {
            callback({"status":1,"message":"User inserted","user":user_data});
        }
    });
};

/*
 * update_user_by_id is used to update user data based on user_id
 * 
 * @param   user_id         String  _id of user that need to be update
 * @param   user_object     JSON    object consist of all property that need to update
 * 
 * @return  status  0 - If any error occur in updating user, with error
 *          status  1 - If User updated successfully, with appropriate message
 *          status  2 - If User not updated, with appropriate message
 * 
 * @developed by "ar"
 */
user_helper.update_user_by_id = function(user_id,update_obj,callback){
    User.update({_id:{$eq : user_id}},{$set:update_obj},function(err,update_data){
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


user_helper.chk_for_default_card = function(user_id,callback){
    User.findOne({ _id: user_id, "card.is_default": true }).exec(function(err,user_data){
        if(err){
            callback({"status":0,"err":"Error occured in finding user with default card"});
        } else {
            if(user_data){
                callback({"status":1,"message":"User's default card is available"});
            } else {
                callback({"status":404,"message":"User's default card is not available"});
            }
        }
    });
};

user_helper.set_first_card_as_default = function(user_id,callback){
    user_helper.find_user_by_id(user_id,function(data){
        if(data.status === 1 && data.user && data.user.card && data.user.card[0]){
            user_helper.set_card_as_default_for_user(user_id,data.user.card[0].card._id,function(resp){
                if(resp.status == 0){
                    callback({"status":0,"err":"Card has failed to update"});
                } else {
                    callback({"status":1,"message":"First card has been set as default"});
                }
            });
        } else {
            callback({"status":0,"err":"User's card not found"});
        }
    });
};

/*
 * add_card_to_user is used to add given card to user's collection - Not working properly
 * 
 * @param   user_id         String  _id of user that need to be update
 * @param   card_id         String  _id of card
 * 
 * @return  status  0 - If any error occur in updating user, with error
 *          status  1 - If User updated successfully, with appropriate message
 *          status  2 - If User not updated, with appropriate message
 * 
 * @developed by "ar"
 */
user_helper.add_card_to_user = function(user_id,card_id,callback){
    async.waterfall([
        function(inner_callback){
            User.update({_id:{$eq : user_id}},{$push : {card:{card:card_id}}},function(err,update_data){
                if(err){
                    inner_callback({"status":0,"err":err});
                } else {
                    if(update_data.nModified == 1){
                        inner_callback(null);
                    } else {
                        inner_callback({"status":2,"err":"Record has not updated"});
                    }
                }
            });
        },
        function(inner_callback){
            user_helper.chk_for_default_card(user_id,function(resp){
                if(resp.status == 404){
                    inner_callback(null);
                } else {
                    inner_callback({"status":1,"message":"Card has been added"});
                }
            });
        },
        function(inner_callback){
            user_helper.set_first_card_as_default(user_id,function(resp){
                inner_callback({"status":1,"message":"Card has been added"});
            });
        }
    ],function(err,resp){
        if(err){
            callback(err);
        } else {
            callback(resp);
        }
    });
}

/*
 * delete_card_from_user is used to delete given card from user's collection
 * 
 * @param   user_id         String  _id of user that need to be update
 * @param   card_id         String  _id of card
 * 
 * @return  status  0 - If any error occur in updating user, with error
 *          status  1 - If User updated successfully, with appropriate message
 *          status  2 - If User not updated, with appropriate message
 * 
 * @developed by "ar"
 */
user_helper.delete_card_from_user = function(user_id,card_id,callback){
    
    
    async.waterfall([
        function(inner_callback){
            User.update({_id:{$eq : user_id}},{$pull : {card:{card:{$eq : card_id}}}},function(err,update_data){
                if(err){
                    inner_callback({"status":0,"err":err});
                } else {
                    if(update_data.nModified == 1){
                        inner_callback(null);
                    } else {
                        inner_callback({"status":2,"err":"Record has not updated"});
                    }
                }
            });
        },
        function(inner_callback){
            user_helper.chk_for_default_card(user_id,function(resp){
                if(resp.status == 404){
                    inner_callback(null);
                } else {
                    inner_callback({"status":1,"message":"Card has been deleted"});
                }
            });
        },
        function(inner_callback){
            user_helper.set_first_card_as_default(user_id,function(resp){
                inner_callback({"status":1,"message":"Card has been deleted"});
            });
        }
    ],function(err,resp){
        if(err){
            callback(err);
        } else {
            callback(resp);
        }
    });
}

/*
 * find_car_by_user_id is used to fetch single car by user_id
 * 
 * @param   user_id   user_id for which car info need to find
 * 
 * @return  status  0 - If any error occur in finding car, with error
 *          status  1 - If Car found, with found car document
 *          status  404 - If Car not found, with appropriate error message
 * 
 * @developed by "ar"
 */
user_helper.find_car_by_user_id = function(user_id,callback){
    User.findOne({_id:user_id}).select('car').populate({path : 'car',model:'cars'}).lean().exec(function (err, car_data) {
        if (err) {
            callback({"status":0,"err":err});
        } else {
            if(car_data){
                callback({"status":1,"car":car_data.car});
            } else {
                callback({"status":404,"err":"Car not available"});
            }
        }
    });
};

user_helper.update_user_card = function(user_id,card_id,is_default,callback){
    User.update({_id:{$eq: user_id},"card.card":{$eq:card_id}},{$set:{"card.$.is_default":is_default}},function(err,update_data){
        if(err){
            callback({"status":0,"message":"Card fail to update"});
        }
        callback({"status":1,"message":"Card updated"});
    });
};

user_helper.set_card_as_default_for_user = function(user_id,card_id,callback){
    console.log("Finding user data");
    console.log("user_id = ",user_id);
    console.log("card_id = ",card_id);
    
    user_helper.find_user_by_id(user_id,function(data){
        if(data.status === 1){
            console.log("Found user data");
            // User found
            async.eachSeries(data.user.card,function(card,loop_callback){
                console.log("looping for card : ",card);
                if(card.card && card.card._id && JSON.stringify(card.card._id) === JSON.stringify(card_id) && card.is_default === false){
                    console.log("Found default card. going to set as true for it");
                    user_helper.update_user_card(user_id,card_id,true,function(resp){
                        console.log("Found default card. going to set as true for it : resp = ",resp);
                        loop_callback();
                    });
                } else {
                    if(card.card && card.card._id && card.is_default === true && card.card._id !== card_id){
                        console.log("is default is true. Going to make it false for card = ",card.card);
                        user_helper.update_user_card(user_id,card.card._id,false,function(resp){
                            console.log("resp = ",resp);
                            loop_callback();
                        });
                    } else {
                        console.log("Skip as it already false. Card_id = ",card.card);
                        loop_callback();
                    }
                }
            },function(err){
                callback({"status":1,"message":"Card has been set as default"});
            });
        } else {
            callback({"status":0,"message":"Card has failed to update"});
        }
    });
};

module.exports = user_helper;