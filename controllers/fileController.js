const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../repositories/utility');
var currentDate = new Date();
var crypto = require('crypto');

module.exports.verifyCode = function (req, res) {
    var returnUrl = req.session.returnUrl;
    var code = req.body.FileCode;
    model.FileModel.findOne({ 'FileCode': code }, function (err, data) {
        // console.log(data);
        if (data) {
            req.session.code = code;
            req.session.name = data.Name;
            req.session.key = data.Key;
            if (returnUrl != undefined) {
                res.json({ status: 3, url: returnUrl });
            }
            else {
                res.json(1);
            }
        }
        else {
            model.InviteeModel.findOne({ SecretToken: code }, function (err, data) {
                if (err) {
                    console.log(err.message);
                }
                if (!data) res.json(0);
                else if (data) {
                    req.session.SecretToken = code;
                    req.session.name = data.FullName;
                    if (returnUrl != undefined) {
                        res.json({ status: 3, url: returnUrl });
                    }
                    else {
                        res.json({ status: 2, id: data.CaseId })
                    }
                }
                else res.json(0);
            });
        }
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