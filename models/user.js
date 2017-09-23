//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var CardSchema = new Schema({
    card : mongoose.Schema.Types.ObjectId,
    is_default : Boolean
});

var UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    emergency_contact : String,
    password: String,
    user_avatar: String,
    refresh_token: String,
    car : mongoose.Schema.Types.ObjectId,
    card: [CardSchema],
    otp: String,
    phone_verified: {type: Boolean, default:false},
    is_active: {type: Boolean, default:true},
    is_deleted: {type: Boolean, default:false},
    registration_date: { type: Date, default: Date.now },
    last_login_date: Date,
    password_changed_date: Date,
    current_lat: String,
    current_long: String
}, { versionKey: false });

// Compile model from schema
var User = mongoose.model('users', UserSchema, 'users');

module.exports = User;