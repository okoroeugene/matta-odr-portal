const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var currentDate = new Date();
var rootPath = index.myPath;
var mail = require('../Helpers/mail');
var crypto = require('crypto');
var path = require('path');
var fileRepo = require('../repositories/fileRepository');


var fileService = module.exports = {
    GetFileByFileCode: function (code, callback) {
        fileRepo.GetFileByFileCode(code, function (data) {
            callback(data);
        });
    },

    // GetInviteeByToken: function (code, callback) {
    //     fileRepo.GetInviteeByToken(code, function (err, data) {
    //         callback(data);
    //     });
    // },

    ValidateUser: function (req, res, data, code, returnUrl) {
        if (data !== 0) {
            req.session.code = code;
            req.session.name = data.Name;
            req.session.key = data.Key;
            if (returnUrl != undefined) {
                res.json({ status: 3, url: returnUrl });
            }
            else res.json(1);
        }
        else {
            fileRepo.GetInviteeByToken(code, function (inv) {
                if (inv == 0)
                    res.json(0);
                else
                    fileService.ValidateInvitee(req, res, inv, code, returnUrl);
            });
        }
    },

    ValidateInvitee: async function (req, res, data, code, returnUrl) {
        if (data) {
            req.session.SecretToken = code;
            req.session.name = data.FullName;
            req.session.key = data.Key;
            if (returnUrl != undefined) {
                res.json({ status: 3, url: returnUrl });
            }
            else {
                await model.InviteeModel.findOne({ SecretToken: code }, function (err, response) {
                    if (response)
                        res.json({ status: 4, caseId: response.CaseId });
                });
            }
        }
        else {
            res.json(0);
        }
    },
}