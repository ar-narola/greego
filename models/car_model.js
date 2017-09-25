//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var CarModelSchema = new Schema({
    brand: String,
    model: String,
    model_trim: String,
    year: Number,
    body: String,
    transmission_type: {type: String, enum: ["Automatic", "Manual"]},
}, {versionKey: false});

// Compile model from schema
var Car_model = mongoose.model('car_models', CarModelSchema, 'car_models');

module.exports = Car_model;