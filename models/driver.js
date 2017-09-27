//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var DriverSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    password: String,
    driver_avatar: String,
    drive_type: [{type: String, enum: ["Sedan", "SUV", "Van"]}],
    transmission_type: {type: String, enum: ["Automatic", "Manual"]},
    license: String,
    birth_certi: String,
    insurance: String,
    bank_routing_no: String,
    bank_account_no: String,
    ssn: String,
    current_lat: String,
    current_long: String,
    location_updated_at: Date,
    refresh_token: String,
    is_active: {type: Boolean, default: true},
    is_deleted: {type: Boolean, default: false},
    is_verified: {type: Boolean, default: false},
    registration_date: {type: Date, default: Date.now},
    last_login_date: Date
}, {versionKey: false});

// Compile model from schema
var Driver = mongoose.model('drivers', DriverSchema, 'drivers');

module.exports = Driver;

/*
 * Need extra field for current location of driver
 */