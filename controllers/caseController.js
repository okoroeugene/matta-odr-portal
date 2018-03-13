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

module.exports.viewCase = function (req, res) {
    var ID = req.params.id;
    var _result = caseService.ValidateCaseView(req, res, ID);
}

module.exports.chat = function (req, res) {
    var code;
    var mediator;
    var role = utility.UserRole.GetRoleName(req);
    caseService.AddCaseChat(req, res, null, function (data) {
        if (data)
            res.json({ status: 1, result: data });
        else
            res.json({ status: 0, message: 'Something went wrong!!' });
    });
}

module.exports.caseDetails = function (req, res) {
    model.CaseModel.findById(req.params.id)
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

exports.acceptCase = function (req, res) {
    if (req.user != undefined) {
        // model.ComplaintModel.findByIdAndUpdate(req.body.complaintId, { Status: 2 }).populate('FileCode')
        model.ComplaintModel.findById(req.body.complaintId).populate('FileId')
            .exec(function (err, data) {
                var mediatorId = req.user._id;
                var mediatorName = req.user.FullName;
                var ID = req.body.complaintId;
                caseService.AddCaseAndUpdate(mediatorId, mediatorName, ID, data.FileId.Key, function (data) {
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


module.exports.inviteUser = function (req, res) {
    var caseId = req.body.caseId;
    model.CaseModel.findById(caseId)
        .populate('ComplaintId')
        .exec(function (err, data) {
            // console.log(data);
            caseService.SendMailToInvitee(data, caseId, function (_result) {
                if (_result) res.json({ status: 1 });
                else res.json({ status: 0 });
            });
        });
}

module.exports.uploadfile = function (req, res) {
    caseService.uploadcasefiles(req, res, function (files) {
        var caseId = req.params.id;
        var caption = req.body.caption;
        var role = utility.UserRole.GetRoleName(req);
        caseService.AddCaseChat(req, res, files, function (data) {
            if(data) res.json({ status: 1, result: data });
            else res.json({ status: 0, message: 'Something went wrong!!' });
        });
    });
};

module.exports.checkinvite = function (req, res) {
    var caseId = req.params.id;
    model.InviteeModel.findOne({ CaseId: caseId }, function (err, data) {
        if (data) res.json(1);
        else res.json(0);
    });
}



//UPDATE ANY DATA
// app.get('/g', function (req, res) {
//     model.ComplaintModel.findByIdAndUpdate('5a762125e44542435c4ccbda', { TPEmail: 'obinna.okoro@tenece.com' },
//         function (err, data) {
//             if (data) res.json('success');
//         })
// })