var index = require('../app');
var app = index.myApp;
var rootPath = index.myPath;
var passport = index.myPassport;
var client = require('twilio')(
    'AC1f8c11eb30bf50fcb6d32b3120f3b032',
    '415e95b2990f3f433c0a1b017aabb1f8'
);



module.exports.Twilio = {
    SendSMS: function (from, to, body) {
        client.messages.create({
            from: from,
            to: to,
            body: body
        }).then((message) => console.log('Message successfully sent!'));
    }
}