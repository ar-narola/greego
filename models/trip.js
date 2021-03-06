//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var PickupSchema = new Schema({
    "location_name":String,
    "location_lat":String,
    "location_long":String,
    "pickup_time":Date              // Trip start time
});

var DestinationSchema = new Schema({
    "location_name":String,
    "location_lat":String,
    "location_long":String,
    "reached_time":Date             // Trip completed time
});

var SentRequestSchema = new Schema({
    "driver_id":mongoose.Schema.Types.ObjectId,
    "status":{type:String,enum:["not-answered","accepted","rejected","aborted"],default:"not-answered"},
    "updated_at":{type: Date, default: Date.now},
});

var TripSchema = new Schema({
    pickup:PickupSchema,
    destination:DestinationSchema,
    fare: Number,
    user_id: mongoose.Schema.Types.ObjectId,
    driver_id: mongoose.Schema.Types.ObjectId,
    sent_request : [SentRequestSchema],
    car: {
        brand: String,
        model: String,
        color: String,
        year: String,
        plate_number: String,
        transmission_type: {type: String, enum: ["Automatic", "Manual"]},
    },
    status: {type:String, enum:["driver-requested","request-accepted","driver-reached","in-progress","completed"]},
    rate_to_user: { type: Number, min:1, max : 5}, // Driver will rate to user
    rate_to_driver : { type: Number, min:1, max : 5}, // User will rate to driver
    date: {type: Date, default: Date.now},
    request_accepted_at : Date,
    driver_reached_at : Date
}, {versionKey: false});

// Compile model from schema
var Trip = mongoose.model('trips', TripSchema, 'trips');

module.exports = Trip;