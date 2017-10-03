//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    to_id: mongoose.Schema.Types.ObjectId,
    to_role: String,
    from_id: mongoose.Schema.Types.ObjectId,
    from_role: String,
    message: String,
    is_read: Boolean,
    date_time: {type:Date,default:Date.now}
}, {versionKey: false});

// Compile model from schema
var Notification = mongoose.model('notifications', NotificationSchema, 'notifications');

module.exports = Notification;