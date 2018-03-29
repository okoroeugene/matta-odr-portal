const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var currentDate = new Date();
var rootPath = index.myPath;
var mail = require('../Helpers/mail');
var crypto = require('crypto');
var path = require('path');



module.exports.GetComplaintById = function (req, res) {

}

module.exports.GetAllComplaints = function (req, res) {

}

module.exports = {
    GetComplaintByFileCode: function (code, callback) {
        model.ComplaintModel.findOne({ FileCode: code }, function (err, complaintData) {
            if (complaintData) callback(complaintData);
        });
    },

    GetCasePaymentByComplaintId: function (id, callback) {
        model.CasePaymentModel.findOne({ ComplaintId: id }, function (err, data) {
            if (data) callback(data);
        });
    },

    AddComplaint: function (req, res, callback) {
        var _complaint = new model.ComplaintModel(req.body);
        var secretToken = utility.randomNumber.generateRan(8);
        model.FileModel.findOne({ FileCode: req.session.code }, function (err, data) {
            _complaint.FileCode = req.session.code;
            _complaint.DateGenerated = currentDate;
            _complaint.Status = 0;
            _complaint.FileId = data._id;
            _complaint.save(function (err, data) {
                if (data)
                    callback(data);
            })
        })
    },

    // AddInvitee: function (data, secretToken, caseId, callback) {
    //     model.InviteeModel.create({
    //         FullName: data.ComplaintId.TPName, //TP means third party
    //         Email: data.ComplaintId.TPEmail,
    //         SecretToken: secretToken,
    //         // CaseId: caseId,
    //         DateInvited: currentDate
    //     }, function (err, data) {
    //         callback(data);
    //     });
    // },

    AddCasePayment: function (req, res, callback) {
        var id = req.params.id;
        var mediatorId = utility.getCurrentLoggedInUser.id(req, res);
        model.CasePaymentModel.create({
            Amount: req.body.cost,
            ComplaintId: id,
            MediatorId: mediatorId,
            EstimatedNumberOfDays: req.body.estNoDays,
            IsPaymentMade: false,
            Date: currentDate
        }, function (err, data) {
            if (data) {
                callback(data);
            }
        })
    },

    AddCase: function (mediatorId, mediatorName, ID, userId, callback) {
        model.CaseModel.create({
            MediatorId: mediatorId,
            Mediator_Name: mediatorName,
            ComplaintId: ID,
            UserId: userId,
            Date: currentDate
        }, function (err, data) {
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
}

