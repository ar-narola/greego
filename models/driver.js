//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var RateSchema = new Schema({
    total_rate_point : {type:Number, default:0}, // Total rate point for user
    total_rate : {type:Number, default:0}, // Total number of times rate has been given to user
    avg_rate : {type:Number, default:0}
});

var DriverSchema = new Schema({
    residential_status: {type: String,enum:["Citizen","Greencard","Visa"]},
    address:String,
    city:String,
    state:String,
    zipcode:String,
    drive_type: [{type: String, enum: ["Sedan", "SUV", "Van"]}],
    transmission_type: [{type: String, enum: ["Automatic", "Manual"]}],
    license: String,
    birth_certi: String,
    home_insurance: String,
    auto_insurance: String,
    pay_stub:String,
    bank_routing_no: String,
    bank_account_no: String,
    ssn: String,
    rate : RateSchema
}, {versionKey: false});

// Compile model from schema
var Driver = mongoose.model('drivers', DriverSchema, 'drivers');

module.exports = Driver;

/*
 * Need extra field for current location of driver
 */