const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var currentDate = new Date();
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
    var code = 'MATTA/' + await utility.randomNumber.generateNum(4) + '-' + await utility.randomNumber.generateNum(4);
    req.session.fileNumber = code;
    req.session.fullname = req.body.fullname;
    req.session.email = req.body.email;
    req.session.phone = req.body.phone;
    res.json(1);
}

module.exports.openFile = async function (req, res) {
    var key = crypto.randomBytes(16).toString("hex");
    await model.FileModel.create({
        FileCode: req.session.fileNumber,
        Name: req.session.fullname,
        Email: req.session.email,
        Phone: req.session.phone,
        Key: key,
        Password: req.body.password,
        Date: currentDate,
    }, function (err, data) {
        if (err) console.log(err.message);
        else {
            req.session.code = req.session.fileNumber;
            req.session.name = req.session.fullname;
            req.session.key = key;
            res.json(1);
        }
    });
}

module.exports.getNewRegData = function (req, res) {
    var fileCode = req.session.fileNumber;
    res.json(fileCode);
}