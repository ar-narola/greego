var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fileUpload = require('express-fileupload');
var expressValidator = require('express-validator');

var config = require('./config');
var db = require('./models/db');

var index = require('./routes/index');
var driver = require('./routes/driver');
var user = require('./routes/user');
var admin = require('./routes/admin');

var app = express();
app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'doc')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(expressValidator());

app.use('/', index);
app.use('/user', user);
app.use('/driver', driver);
app.use('/admin', admin);

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message
    });
});

module.exports = app;