const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var passport = index.myPassport;
var twilio = require('../Helpers/twilio');
var currentDate = Date.now();
var crypto = require('crypto');
var fileService = require('../services/fileService');

module.exports.verifyCode = function (req, res) {
    var returnUrl = req.session.returnUrl;
    var code = req.body.FileCode;
    fileService.GetFileByFileCode(code, function (data) {
        fileService.ValidateUser(req, res, data, code, returnUrl);
    });
}

module.exports.genFileNumber = async function (req, res) {
    // var code = 'MATTA/' + await utility.randomNumber.generateNum(4) + '-' + await utility.randomNumber.generateNum(4);
    // req.session.fileNumber = code;
    // req.session.firstname = req.body.firstname;
    // req.session.lastname = req.body.lastname;
    // req.session.email = req.body.email;
    // req.session.phone = req.body.phone;
    // req.session.role = req.body.role;
    // res.json(1);
}

//STATUS CODE 401 - USER ALREADY EXISTS
module.exports.openFile = async function (req, res, next) {
    var code = 'MATTA/' + await utility.randomNumber.generateNum(4) + '-' + await utility.randomNumber.generateNum(4);
    utility.createuser(code, req.body.email, req.body.password, 'user', async cb => {
        var key = crypto.randomBytes(16).toString("hex");
        if (cb === 0) {
            res.json(401);
            next();
        }
        await model.FileModel.create({
            filecode: code, firstname: req.body.firstname, lastname: req.body.lastname,
            email: req.body.email, phone: req.body.phone, date: currentDate, userId: cb._id
        }, async (err, data) => {
            if (data) {
                var phone;
                phone = '+234' + req.body.phone;
                // if (!phone.substring(1, 3).includes('234') || !phone.substring(1, 4).includes('+234')) phone = '+234' + req.body.phone;
                var smsBody = 'Hello, ' + req.body.firstname + '. Welcome to MATTA ODR Portal. Your File Number is: ' + code;
                await twilio.Twilio.SendSMS(phone, smsBody);
                await passport.authenticate('local-sign-in', {});
                req.session.code = code;
                req.session.role = 'user';
            }
            req.login(cb, loginErr => {
                if (loginErr) next(loginErr);
                else res.json(1);
            });
        });
    });
}

module.exports.getNewRegData = function (req, res) {
    var fileCode = req.session.fileNumber;
    res.json(fileCode);
}

module.exports.filedetails = async (req, res) => {
    await model.FileModel.findOne({ userId: req.user.id }, (err, data) => {
        res.json(data);
    });
}