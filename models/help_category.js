//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var HelpCategory = new Schema({
    name: String,
    image: String,
    content: String,
    is_active: {type:Boolean, default:true},
    parent_id: mongoose.Schema.Types.ObjectId
}, {versionKey: false});

// Compile model from schema
var Category = mongoose.model('help_categories', HelpCategory, 'help_categories');

module.exports = Category;