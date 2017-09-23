//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var FareSchema = new Schema({
    state: String,
    base: String,
    per_min: String,
    per_mile: String,
    service_fee: String,
    minimum_charge: String,
    cancellation_fee: String,
    cancellation_duration: String // If cancel in specified duration, cancellation charge will not applicable, Duration is in seconds
}, {versionKey: false});

// Compile model from schema
var Fare = mongoose.model('fares', FareSchema, 'fares');

module.exports = Fare;