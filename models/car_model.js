//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var CarModelSchema = new Schema({
    brand: String,
    car: String,
    model: String,
    Color: String,
    plate_number: String,
    transmission_type: {type: String, enum: ["Automatic", "Manual"]},
}, {versionKey: false});

// Compile model from schema
var Car_model = mongoose.model('car_models', CarModelSchema, 'car_models');

module.exports = Car_model;