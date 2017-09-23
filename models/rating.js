//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var RatingSchema = new Schema({
    trip_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    driver_id: mongoose.Schema.Types.ObjectId,
    rating: { type: Number, min:1, max : 5}
}, {versionKey: false});

// Compile model from schema
var Rating = mongoose.model('ratings', RatingSchema, 'ratings');

module.exports = Rating;