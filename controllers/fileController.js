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

module.exports.openFile = function (req, res) {
    var code = 'MATTA/' + utility.randomNumber.generateNum(4) + '-' + utility.randomNumber.generateNum(4);
    var key = crypto.randomBytes(16).toString("hex");
    model.FileModel.create({
        FileCode: code,
        Name: req.body.fullname,
        Email: req.body.email,
        Phone: req.body.phone,
        Key: key,
        Date: currentDate,
    }, function (err, data) {
        if (err) res.json(err.message);
        else res.json(1);
    });
}