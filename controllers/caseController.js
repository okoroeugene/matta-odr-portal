const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var currentDate = new Date();
var rootPath = index.myPath;
var mail = require('../Helpers/mail');
var crypto = require('crypto');
var path = require('path');
var caseService = require('../services/caseService');
var bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10;
var passport = index.myPassport;

module.exports.viewCase = function (req, res) {
    var ID = req.params.id;
    var _result = caseService.ValidateCaseView(req, res, ID);
}

module.exports.chat = function (req, res) {
    var code;
    var mediator;
    var role = utility.UserRole.GetRoleName(req, res);
    caseService.AddCaseChat(req, res, req.body.Content, null, function (data) {
        if (data)
            res.json({ status: 1, result: data });
        else
            res.json({ status: 0, message: 'Something went wrong!!' });
    });
}

module.exports.caseDetails = async function (req, res) {
    await model.CaseModel.findById(req.params.id)
        .populate('ComplaintId')
        .exec(function (err, data) {
            // if (err) console.log(err.message);
            res.json(data);
        })
}

module.exports.chatDetails = function (req, res) {
    var ID = req.params.id;
    if (ID == 'undefined' || ID == null) {
        res.json(0);
    }
    caseService.GetAllChatsByCaseId(ID, function (data) {
        res.json(data);
    });
}

exports.acceptCase = async function (req, res) {
    if (req.user != undefined) {
        // model.ComplaintModel.findByIdAndUpdate(req.body.complaintId, { Status: 2 }).populate('FileCode')
        await model.ComplaintModel.findById(req.body.complaintId).populate('FileId')
            .exec(function (err, data) {
                var mediatorId = req.user._id;
                var mediatorName = req.user.FullName;
                var ID = req.body.complaintId;
                caseService.AddCaseAndUpdate(mediatorId, mediatorName, ID, data.FileId.userId, function (data) {
                    if (data) {
                        res.json({ status: 1, message: data.id });
                    }
                    else {
                        res.json({ status: 0, message: 'Something went wrong!!' });
                    }
                });
            })
    }
    else {
        res.redirect('/error');
    }
}


module.exports.inviteUser = async function (req, res) {
    var caseId = req.body.caseId;
    await model.CaseModel.findById(caseId)
        .populate('ComplaintId')
        .exec(function (err, data) {
            // console.log(data);
            caseService.SendMailToInvitee(data, caseId, function (_result) {
                if (_result === 0) res.json({ status: 0 });
                if (_result) res.json({ status: 1 });
                else res.json({ status: 0 });
            });
        });
}

module.exports.uploadfile = function (req, res) {
    caseService.uploadcasefiles(req, res, function (files) {
        var caseId = req.params.id;
        var caption = req.body.caption;
        var role = utility.UserRole.GetRoleName(req, res);
        caseService.AddCaseChat(req, res, caption, files, function (data) {
            if (data) res.json({ status: 1, result: data });
            else res.json({ status: 0, message: 'Something went wrong!!' });
        });
    });
};

module.exports.checkinvite = async function (req, res) {
    var caseId = req.params.id;
    await model.InviteeModel.findOne({ CaseId: caseId }, function (err, data) {
        if (data) res.json(1);
        else res.json(0);
    });
}

module.exports.GetChatDataById = async function (req, res) {
    var Id = req.params.id;
    await model.ChatModel.findById(Id, function (err, data) {
        res.json(data);
    });
}

module.exports.updatechatcontent = async function (req, res) {
    var Id = req.params.id;
    await model.ChatModel.findByIdAndUpdate(Id, { Content: req.body.Content }, function (err, data) {
        if (data) res.json(1);
        else res.json(0);
    });
}

module.exports.MarkAsResolved = async function (req, res) {
    var Id = req.params.id;
    await model.ComplaintModel.findByIdAndUpdate(Id, { Status: 2 }, function (err, data) {
        if (data) res.json(1);
        else res.json(0);
    });
}

module.exports.DeleteChatContent = async function (req, res) {
    var Id = req.params.id;
    await model.ChatModel.findByIdAndRemove(Id, async function (err, data) {
        if (data) {
            await model.NotificationModel.findOneAndRemove({ ChatId: Id }, function (err, notify) {
                if (notify) res.json(1);
            });
        }
        else res.json(0);
    });
}

module.exports.getInvitee = async function (req, res) {
    var Id = req.params.id;
    caseService.getInviteeByToken(Id, cb => {
        res.json(cb);
    });
}

module.exports.validateInvitee = async (req, res, next) => {
    var Id = req.params.id;
    caseService.getInviteeByToken(Id, cb => {
        if (cb.userId.password !== '000000') res.redirect('/login');
        next();
    });
}

module.exports.regInvitee = async function (req, res, next) {
    var Id = req.params.id;
    await model.InviteeModel.findOne({ token: Id }).populate('userId').exec(async (err, data) => {
        if (data) {
            if (data.userId.password === '000000') {
                bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                    if (err) return next(err);
                    bcrypt.hash(req.body.password, salt, null, async (err, hash) => {
                        if (err) return next(err);
                        await model.UserModel.findByIdAndUpdate(data.userId.id, { password: hash }, async (err, user) => {
                            if (user) {
                                await passport.authenticate('local-sign-in', {});
                                await req.login(user, loginErr => {
                                    if (loginErr) { }
                                    else {
                                        req.session.role = 'invitee';
                                        res.json(data.CaseId);
                                        next();
                                    }
                                });
                            }
                        });
                    });
                });
            }
        }
    });
}


//UPDATE ANY DATA
// app.get('/g', function (req, res) {
//     model.ComplaintModel.findByIdAndUpdate('5a762125e44542435c4ccbda', { TPEmail: 'obinna.okoro@tenece.com' },
//         function (err, data) {
//             if (data) res.json('success');
//         })
// })