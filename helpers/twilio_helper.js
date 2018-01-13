var twilio = require('twilio');
var config = require('../config');
var VoiceResponse = twilio.twiml.VoiceResponse;
var twilio_helper = {};
var client = new twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

/*
 * sendSMS is used to send sms to specified number
 * 
 * @param   card_object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting card, with error
 *          status  1 - If card found, with inserted card document and appropriate message
 * 
 * @developed by "ar"
 */
/* 
 * Send sms to specified number
 * @param Integer to phone number to whom sms will be send
 * @param String msg content of message
 * @param String successMsg Success message
 * @param String err Error Message
 * @param Object res Response object of parent api
*/
twilio_helper.sendSMS = function (to, msg, callback) {
    client.messages.create({
        to: to,
        from: config.TWILIO_NUMBER,
        body: msg
    }, function (error, message) {
        if (!error) {
            logger.trace("Message sent - Twilio message = ",message);
            console.log("message : ",message);
            callback({"status":1,"message":"Message has been sent"});
        } else {
            logger.trace("Message error - Twilio message = ",error);
            callback({"status":0,"err":error});
        }
    });
}

module.exports = twilio_helper;