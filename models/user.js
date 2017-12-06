//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var CarSchema = new Schema({
    brand: String,
    model: String,
    color: String,
    plate_number: String,
    transmission_type: {type: String, enum: ["Automatic", "Manual"]},
});

var CardSchema = new Schema({
    card : mongoose.Schema.Types.ObjectId,
    is_default : Boolean
});

var RateSchema = new Schema({
    total_rate_point : Number, // Total rate point for user
    total_rate : Number, // Total number of times rate has been given to user
    avg_rate : Number
});

var UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    password: String,
    user_avatar: String,
    refresh_token: String,
    phone_verified: {type: Boolean, default:false},
    otp: String,
    is_active: {type: Boolean, default:true},
    is_deleted: {type: Boolean, default:false},
    registration_date: { type: Date, default: Date.now },
    last_login_date: Date,
    password_changed_date: Date,
    current_lat: String,
    current_long: String,
    emergency_contact : String,
    car : CarSchema,
    card: [CardSchema],
    rate : RateSchema,
    driver_id : mongoose.Schema.Types.ObjectId,
    role : {type:String, enum: ["rider", "driver", "both"]}
}, { versionKey: false });

// Compile model from schema
var User = mongoose.model('users', UserSchema, 'users');

module.exports = User;