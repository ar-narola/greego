//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var PickupSchema = new Schema({
    "location_name":String,
    "location_lat":String,
    "location_long":String,
    "pickup_time":Date
});

var DestinationSchema = new Schema({
    "location_name":String,
    "location_lat":String,
    "location_long":String,
    "reached_time":Date
});

var TripSchema = new Schema({
    pickup:PickupSchema,
    destination:DestinationSchema,
    fare: Number,
    user_id: mongoose.Schema.Types.ObjectId,
    driver_id: mongoose.Schema.Types.ObjectId,
    car_id: mongoose.Schema.Types.ObjectId,
    status: {type:String, enum:["driver-requested","invitaion-accepted","driver-reached","in-progress","completed"]},
    rate_user: { type: Number, min:1, max : 5}, // Driver will rate to user
    rate_driver : { type: Number, min:1, max : 5}, // User will rate to driver
    date: {type: Date, default: Date.now},
    invitation_accepted_at : Date,
    driver_reached_at : Date
}, {versionKey: false});

// Compile model from schema
var Trip = mongoose.model('trips', TripSchema, 'trips');

module.exports = Trip;