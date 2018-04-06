const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var currentDate = new Date();
var rootPath = index.myPath;
var complaintRepo = require('../repositories/complaintRepository');

module.exports.getComplaintStatus = async function (response, callback) {
    await model.ComplaintModel.findById(response, function (err, data) {
        if (data) {
            callback(data.Status);
        }
        else {
            callback(401);
        }
    })
}

module.exports.AddComplaint = async function (req, res, callback) {
    await complaintRepo.AddComplaint(req, res, function (data) {
        callback(data);
    });
}

module.exports.AddCasePayment = function (req, res, callback) {
    complaintRepo.AddCasePayment(req, res, function (data) {
        callback(data);
    });
}

module.exports.VerifyAndReturnPaymentData = function (req, res, code) {
    complaintRepo.GetComplaintByFileCode(code, function (data) {
        if (data) {
            if (data.Status == 0) res.json({ status: 0 });
            complaintRepo.GetCasePaymentByComplaintId(data._id, async function (newData) {
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
                    if (newData.IsPaymentMade == true) {
                        await model.CaseModel.findOne({ ComplaintId: data._id }, function (err, casedata) {
                            if (casedata) {
                                res.json({ status: 1, result: result, caseId: casedata._id, mediator: casedata.Mediator_Name });
                            }
                            // else res.json({ status: 3, result: result });
                        });
                    }
                    else {
                        res.json({ status: 2, result: result });
                    }
                }
                // else res.json({ status: 0 });
            });
        }
    });
}

module.exports.AddCaseAndUpdate = function (mediatorId, mediatorName, ID, userId, callback) {
    complaintRepo.AddCase(mediatorId, mediatorName, ID, userId, function (data) {
        // model.ComplaintModel.findByIdAndUpdate(ID, { Status: 2 }, function (err, result) {
        //     if (result)
        //         callback(data);
        // })
        callback(data);
    });
};