//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var InvoiceSchema = new Schema({
    start_date: Date,
    end_date: Date,
    total_amount: Number,
    driver_id: mongoose.Schema.Types.ObjectId,
    status: {type:String, enum: ["active", "paid"]},
    trips:[mongoose.Schema.Types.ObjectId],
    date_time: { type: Date, default: Date.now }
}, {versionKey: false});

// Compile model from schema
var Invoice = mongoose.model('invoices', InvoiceSchema, 'invoices');

module.exports = Invoice;