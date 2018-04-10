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

var complaintRepo = module.exports = {
    GetComplaintByFileCode: async function (code, callback) {
       await model.ComplaintModel.findOne({ FileCode: code }, function (err, complaintData) {
            if (complaintData) callback(complaintData);
        });
    },

    GetCasePaymentByComplaintId: async function (id, callback) {
        await model.CasePaymentModel.findOne({ ComplaintId: id }, function (err, data) {
            if (data) callback(data);
        });
    },

    AddComplaint: async function (req, res, callback) {
        var _complaint = new model.ComplaintModel(req.body);
        var secretToken = utility.randomNumber.generateRan(8);
        await model.FileModel.findOne({ filecode: req.session.code }, function (err, data) {
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

    AddCasePayment: async function (req, res, callback) {
        var id = req.params.id;
        var mediatorId = utility.getCurrentLoggedInUser.id(req, res);
        await model.CasePaymentModel.create({
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

    AddCase: async function (mediatorId, mediatorName, ID, userId, callback) {
        await model.CaseModel.create({
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

    ValidatePaymentUser: async function (req, res, code, callback) {
        await complaintRepo.GetComplaintByFileCode(code, async data => {
            if (data) {
                if (data.Status == 0) res.json({ status: 0 });
                await complaintRepo.GetCasePaymentByComplaintId(data._id, async function (newData) {
                    if (newData) {
                        var result = {
                            'CasePaymentId': newData._id,
                            'Email': data.UEmail,
                            'Phone': data.UPhone,
                            'UName': data.UName,
                            'TPName': data.TPName,
                            'FileCode': code,
                            'Amount': newData.Amount
                        };
                        callback(newData, result, data);
                    }
                });
            }
        });
    },
    
    ValidatePaymentInvitee: async function (req, res, callback) {
        await complaintRepo.AddCasePayment(req, res, function (data) {
            callback(data);
        });
    }
}

