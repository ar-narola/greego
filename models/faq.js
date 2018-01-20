//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var FAQ = new Schema({
    question: String,
    answer: String,
    category_id: mongoose.Schema.Types.ObjectId,
    is_active: {type:Boolean, default:true}
}, {versionKey: false});

// Compile model from schema
var Faqs = mongoose.model('faqs', FAQ, 'faqs');

module.exports = Faqs;