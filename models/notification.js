//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    message: String,
    is_read: Boolean,
    date_time: Date
}, {versionKey: false});

// Compile model from schema
var Notification = mongoose.model('notifications', NotificationSchema, 'notifications');

module.exports = Notification;