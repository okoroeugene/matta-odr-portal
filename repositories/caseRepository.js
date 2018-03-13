const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var currentDate = new Date();
var rootPath = index.myPath;
var mail = require('../Helpers/mail');
var crypto = require('crypto');
var path = require('path');


var caseRepo = module.exports = {
    GetCaseById: function (ID, callback) {
        model.CaseModel.findById(ID)
            .populate('ComplaintId')
            .exec(function (err, data) {
                callback(data);
            });
    },

    GetAllCases: function (req, res, callback) {
        model.CaseModel.find()
            .populate('ComplaintId')
            .exec(function (err, data) {
                callback(data);
            });
    },

    AddInvitee: function (data, secretToken, caseId, key, callback) {
        model.InviteeModel.create({
            FullName: data.ComplaintId.TPName, //TP means third party
            Email: data.ComplaintId.TPEmail,
            SecretToken: secretToken,
            CaseId: caseId,
            Key: key,
            DateInvited: currentDate
        }, function (err, data) {
            callback(data);
        });
    },

    AddCase: function (mediatorId, mediatorName, ID, userId, callback) {
        model.CaseModel.create({
            MediatorId: mediatorId,
            Mediator_Name: mediatorName,
            ComplaintId: ID,
            UserId: userId,
            Date: currentDate
        }, function (err, data) {
            // var userId;
            // if (req.session != undefined)
            //     userId = req.session.key;
            // if (req.user != undefined)
            //     userId = req.user._id;
            var participant = [mediatorId, userId];
            for (let i = 0; i < participant.length; i++) {
                model.ConversationModel.create({
                    CaseId: data._id,
                    ParticipantId: participant[i]
                });
            }
            callback(data);
        });
    },

    AddCaseChat: function (caseId, content, role, callback) {
        var _chat = new model.ChatModel({ CaseId: caseId, Content: content, Date: currentDate });
        if (role == 'user' || role == 'invitee') {
            _chat.TP_Name = req.session.name;
            _chat.TP_Id = req.session.key;
            _chat.Mediator_Name = null;
        }
        if (role == 'mediator') {
            mediator = req.user.FullName;
            _chat.TP_Name = null;
            _chat.Mediator_Id = req.user._id;
            _chat.Mediator_Name = mediator;
        }
        _chat.save(function (err, data) {
            callback(data);
        });
    },

    SendMailToInvitee: function (data, caseId, callback) {
        if (data) {
            var key = crypto.randomBytes(16).toString("hex");
            var inviteeName = data.ComplaintId.TPName;
            var path = rootPath + '/views/Invite.html';
            var secretToken = utility.randomNumber.generateRan(8);
            var _res = mail.mail(path, secretToken, data.ComplaintId.TPEmail, inviteeName, 'MATTA needs you!');
            caseRepo.AddInvitee(data, secretToken, caseId, key, function (_invitee) {
                if (_invitee) {
                    model.ConversationModel.create({
                        CaseId: caseId,
                        ParticipantId: key
                    }, function (err, conversation) {
                        if (conversation)
                            callback(_invitee);
                    });
                }
            });
        }
    }
}