//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var CardSchema = new Schema({
    card_number: String,
    month: { type: Number, min: 1, max: 12 },
    year: { type: Number, min: 2017, max: 9999 },
    cvv: { type: Number, min:100, max : 999}
}, {versionKey: false});

// Compile model from schema
var Card = mongoose.model('cards', CardSchema, 'cards');

module.exports = Card;