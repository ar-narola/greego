var config = require('../config');

module.exports = function (req, res, next) {
    if (req.decoded.role == "user" && req.baseUrl.match('/user')) {
        req.userInfo = req.decoded;
        next();
    } else if (req.decoded.role == "driver" && req.baseUrl.match('/driver')) {
        req.driverInfo = req.decoded;
        next();
    } else {
        return res.status(config.UNAUTHORIZED).json({
            "message": 'Unauthorized access'
        });
    }
}