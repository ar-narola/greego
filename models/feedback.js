//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    message: String,
    is_read: {type: Boolean, default: false},
    date_time: {type: Date, default: Date.now}
}, {versionKey: false});

// Compile model from schema
var Feedback = mongoose.model('feedback', FeedbackSchema, 'feedback');

module.exports = Feedback;