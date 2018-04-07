var index = require('../app');
var app = index.myApp;
var rootPath = index.myPath;
var handlebars = require('handlebars');
var fs = require('fs');

var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;

var sender = 'eugy45@gmail.com'
var password = 'history2'

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: sender,
        pass: password
    }
});


module.exports.mail = function (path, secretToken, email, name, subject, callback) {
    // console.log(path, email, name, subject);
    // var path = rootPath + '/views/Invite.html';
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            var template = handlebars.compile(html);
            var replacements = {
                username: name,
                token: secretToken
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'no-reply@matta.com.ng',
                to: email,
                subject: subject,
                html: htmlToSend
            };

            transporter.sendMail(mailOptions, function (err, info) {
                // console.log(info);
                if (err) {
                    callback(0);
                } else {
                    callback(1);
                }
            });
        }
    });
};
