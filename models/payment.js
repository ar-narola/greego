//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    trip_id: mongoose.Schema.Types.ObjectId,
    card_id: mongoose.Schema.Types.ObjectId,
    trip_fare: Number,
    paid_amount: Number,
    date_time: { type: Date, default: Date.now }
}, {versionKey: false});

// Compile model from schema
var Payment = mongoose.model('payments', PaymentSchema, 'payments');

module.exports = Payment;