var async = require('async');

var Invoice = require("../models/invoice");
var invoice_helper = {};

/*
 * 
 */
invoice_helper.get_paid_invoice_for_driver = function (driver_id, callback) {
    Invoice.find({"driver_id": {$eq: driver_id}, "status":"paid"}).lean().exec(function (err, invoice_data) {
        if (err) {
            callback({"status": 0, "err": err});
        } else {
            if (invoice_data.length > 0) {
                callback({"status": 1, "invoice": invoice_data});
            } else {
                callback({"status": 404, "err": "No invoice found"});
            }
        }
    });
};

module.exports = invoice_helper;