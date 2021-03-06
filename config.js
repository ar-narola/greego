var log4js = require( "log4js" );
log4js.configure({
  appenders: { development: { type: 'file', filename: 'log_file.log' } },
  categories: { default: { appenders: ['development'], level: 'trace' } }
});

module.exports = {
    "node_port": 4000,
	"SITE_URL": "http://clientapp.narola.online/HD/greego/",
    "database": "mongodb://127.0.0.1:27017/greego",
    //"database": "mongodb://greego:greego_2017@52.45.35.157/greego?authSource=greego",

    // Twilio account Test
    "TWILIO_ACCOUNT_SID" : "ACd2286c4bd0f56430aaceb3620da03475",//"",
    "TWILIO_AUTH_TOKEN" : "4a916cd762a6da67a7defc1a2cf3918a",//"",
    "TWILIO_NUMBER" : "+15005550006",

    // Twilio account Production
//    "TWILIO_ACCOUNT_SID" : "AC6d02aad8e7113fc6aebd76570d6b5ad4",//"ACd2286c4bd0f56430aaceb3620da03475",
//    "TWILIO_AUTH_TOKEN" : "b50f8eedf3b2454dff62fbd740083984",//"4a916cd762a6da67a7defc1a2cf3918a",
//    "TWILIO_NUMBER" : "+15622100010",
    
    "ACCESS_TOKEN_SECRET_KEY": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "REFRESH_TOKEN_SECRET_KEY": "ZYXWVUTSRQPONMLKJIHGFEDCBA",
    
    "HOST": "127.0.0.1",
    //"REMOTE_HOST": "",
    
    // Google API Key
    "GOOGLE_API_KEY": "AIzaSyC9uZERqo8nJbZVx8ZbnGo59-1dV3QTjgc",

    "OK_STATUS": 200,
    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "NOT_FOUND": 404,
    "MEDIA_ERROR_STATUS": 415,
    "VALIDATION_FAILURE_STATUS": 417,
    "DATABASE_ERROR_STATUS": 422,
    "INTERNAL_SERVER_ERROR": 500,
    
    "logger": log4js.getLogger( "development" ),
    
    "DRIVER_DOC_URL" : "http://52.45.35.157:4000/uploads/driver_doc/",
    "ADMIN_EMAIL" : "info@gnsfin.com"
};