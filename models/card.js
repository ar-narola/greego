//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var CardTypeSchema = new Schema({
    niceType: String,
    type: String,
    gaps:[{type:Number}],
    lengths:[{type:Number}],
    code:{name:String,size:Number}
});

var CardSchema = new Schema({
    card_number: String,
    first_name: String,
    last_name: String,
    month: { type: Number, min: 1, max: 12 },
    year: { type: Number, min: 2017, max: 9999 },
    cvv: { type: Number, min:100, max : 999},
    card_type : CardTypeSchema
}, {versionKey: false});

// Compile model from schema
var Card = mongoose.model('cards', CardSchema, 'cards');

module.exports = Card;