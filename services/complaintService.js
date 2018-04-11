const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var currentDate = new Date();
var rootPath = index.myPath;
var complaintRepo = require('../repositories/complaintRepository');


var complaintService = module.exports = {
    getComplaintStatus: async function (response, callback) {
        await model.ComplaintModel.findById(response, function (err, data) {
            if (data) {
                callback(data.Status);
            }
            else {
                callback(401);
            }
        })
    },

    AddComplaint: async function (req, res, callback) {
        await complaintRepo.AddComplaint(req, res, function (data) {
            callback(data);
        });
    },

    AddCasePayment: function (req, res, callback) {
        complaintRepo.AddCasePayment(req, res, function (data) {
            callback(data);
        });
    },

    //GET USER DATE ON DASHBOARD, STATUS CODE 3 IS FOR INVITEE
    VerifyAndReturnPaymentData: async function (req, res, code) {
        var userId = req.user.id;
        var role = req.session.role;
        if (role == 'user') {
            complaintService.ValidateUserDashboard(req, res, code, () => { });
        }
        if (role == 'invitee') {
            model.InviteeModel.findOne({ userId: req.user.id }).populate('CaseId').exec(async (err, data) => {
                await model.ComplaintModel.findById(data.CaseId.ComplaintId, function (err, complaintData) {
                    if (complaintData) {
                        res.json({ status: 3, invData: data, complaintData: complaintData });
                    }
                });
            });
        }
    },

    ValidateUserDashboard: async (req, res, code) => {
        await complaintRepo.ValidatePaymentUser(req, res, code, async (casePaymentData) => {
            if (casePaymentData === 0) res.json({ status: 0 });
            else if (casePaymentData === 401) {
                await model.FileModel.findOne({ userId: req.user.id }, (err, user) => {
                    res.json({ status: 4, result: user });
                });
            }
            else if (casePaymentData) {
                if (casePaymentData.IsPaymentMade == true) {
                    await model.CaseModel.findOne({ ComplaintId: casePaymentData.ComplaintId._id }, function (err, casedata) {
                        if (casedata) {
                            res.json({ status: 1, result: casePaymentData, caseId: casedata._id, mediator: casedata.Mediator_Name });
                        }
                    });
                }
                else res.json({ status: 2, result: casePaymentData });
            }
        });
    },

    AddCaseAndUpdate: function (mediatorId, mediatorName, ID, userId, callback) {
        complaintRepo.AddCase(mediatorId, mediatorName, ID, userId, function (data) {
            callback(data);
        });
    },

}