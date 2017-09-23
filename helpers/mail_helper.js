var nodemailer = require('nodemailer');
var mailHelper = {};

mailHelper.send = function(to, from, subject, plainText, html, callback) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        tls: { rejectUnauthorized: false },
        auth: {
            user: 'gns.usak@gmail.com',
            pass: 'Gnsusa12'
        }
    });

    var mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: plainText,
        html: html,
        replyTo: 'support@greego.co'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            callback({"status":0,"err":error});
        } else {
            callback({"status":1,"message":info});
        }
    });
}

module.exports = mailHelper;