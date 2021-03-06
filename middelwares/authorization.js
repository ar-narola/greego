var config = require('../config');

module.exports = function (req, res, next) {
    if (req.decoded.role == "rider" && req.baseUrl.match('/user')) {
        req.userInfo = req.decoded;
        next();
    } else if (req.decoded.role == "admin" && req.baseUrl.match('/admin')) {
        req.userInfo = req.decoded;
        next();
    } else if (req.decoded.role == "driver" && (req.baseUrl.match('/driver') || req.originalUrl.match('/user/change_password'))) {
        req.driverInfo = req.decoded;
        req.userInfo = req.decoded;
        next();
    } else if (req.decoded.role == "both") {
        req.userInfo = req.decoded;
        next();
    } else {
        console.log("decoded = ",req.decoded);
        return res.status(config.UNAUTHORIZED).json({
            "message": 'Unauthorized access'
        });
    }
}