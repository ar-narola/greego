//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var TripSchema = new Schema({
    pickup_location_name: String,
    pickup_location_lat: String,
    pickup_location_long: String,
    destination_location_name: String,
    destination_location_lat: String,
    destination_location_long: String,
    fare: Number,
    user_id: mongoose.Schema.Types.ObjectId,
    driver_id: mongoose.Schema.Types.ObjectId,
    car_id: mongoose.Schema.Types.ObjectId,
    status: {type:String, enum:["pending","driver-reached","in-progress","completed"]},
    pickup_time: Date,
    drop_time: Date,
    date: {type: Date, default: Date.now}
}, {versionKey: false});

// Compile model from schema
var Trip = mongoose.model('trips', TripSchema, 'trips');

module.exports = Trip;