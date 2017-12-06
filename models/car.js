// Not in use anymore

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var CarSchema = new Schema({
    brand: String,
    car: String,
    model: String,
    Color: String,
    plate_number: String,
    transmission_type: {type: String, enum: ["Automatic", "Manual"]},
}, {versionKey: false});

// Compile model from schema
var Car = mongoose.model('cars', CarSchema, 'cars');

module.exports = Car;