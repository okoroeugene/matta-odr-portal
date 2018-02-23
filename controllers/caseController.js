const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../repositories/utility');
var currentDate = new Date();
var rootPath = index.myPath;
var mail = require('../services/mail');
var crypto = require('crypto');
var path = require('path');

module.exports.viewCase = function (req, res) {
    if (req.params.id == undefined) {
        res.redirect('/error');
    }
    model.CaseModel.findById(req.params.id)
        .populate('ComplaintId')
        .exec(function (err, data, next) {
            var role = utility.UserRole.GetRoleName(req);
            if (data) {
                //Authenticate Mediator Role
                if (role == 'mediator' && data.MediatorId != req.user.id) res.redirect('/error');
                else res.sendFile(rootPath + '/views/layout.html')
                //Authenticate User
                if (role == 'user') {
                    model.FileModel.findOne({ FileCode: data.ComplaintId.FileCode }, function (err, file) {
                        if (file) {
                            if (file.Key != req.session.key) res.redirect('/error');
                            else res.sendFile(rootPath + '/views/layout.html')
                        }
                        else res.redirect('/error');
                    });
                }
                if (role == 'invitee') {
                    model.InviteeModel.findOne({ SecretToken: req.session.SecretToken }, function (err, inv) {
                        if (inv.CaseId != data._id) res.redirect('/error');
                        else res.sendFile(rootPath + '/views/layout.html')
                    });
                }
            }
            else res.redirect('/error');
        });
}

module.exports.chat = function (req, res) {
    var code;
    var mediator;
    var role = utility.UserRole.GetRoleName(req);
    var _chat = new model.ChatModel({ CaseId: req.params.id, Content: req.body.Content, Date: currentDate });
    if (role == 'user' || role == 'invitee') {
        _chat.TP_Name = req.session.name;
        _chat.Mediator_Name = null;
    }
    if (role == 'mediator') {
        mediator = req.user.FullName;
        _chat.TP_Name = null;
        _chat.Mediator_Name = mediator;
    }
    _chat.save(function (err, data) {
        if (err) res.json({ status: 0, message: err.message });
        else res.json({ status: 1, key: data._id });
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
    else {
        model.ChatModel.find()
            .where('CaseId')
            .in(ID)
            .populate('CaseId')
            .exec(function (err, data) {
                res.json(data);
            })
    }
}

exports.acceptCase = function (req, res) {
    if (req.user != undefined) {
        model.ComplaintModel.findByIdAndUpdate(req.body.complaintId, { Status: 1 }, function (err, data) {
            if (err) res.json({ status: 0, message: err.message });
            // else {
            //     console.log(data);
            // }
        });
        model.CaseModel.create({
            MediatorId: req.user._id,
            Mediator_Name: req.user.FullName,
            ComplaintId: req.body.complaintId,
            Date: currentDate
        }, function (err, data) {
            if (err) res.json({ status: 0, message: err.message });
            else {
                res.json({ status: 1, message: data.id });
            }
        });
    }
    else {
        res.redirect('/error');
    }
}


module.exports.inviteUser = function (req, res) {
    //send email
    // string html = ''
    var caseId = req.body.caseId;
    model.CaseModel.findById(caseId)
        .populate('ComplaintId')
        .exec(function (err, data) {
            // console.log(data);
            if (data) {
                var inviteeName = data.ComplaintId.TPName;
                var path = rootPath + '/views/Invite.html';
                var secretToken = utility.randomNumber.generateRan(8);
                var _res = mail.mail(path, secretToken, data.ComplaintId.TPEmail, inviteeName, 'MATTA needs you!');
                var invite = model.InviteeModel.create({
                    FullName: data.ComplaintId.TPName, //TP means third party
                    Email: data.ComplaintId.TPEmail,
                    SecretToken: secretToken,
                    CaseId: req.body.caseId,
                    DateInvited: currentDate
                }, function (err, data) {
                    if (err) res.json({ status: 0, message: err.message });
                    else res.json({ status: 1 });
                });
            }
        });
}

module.exports.uploadfile = function (req, res) {
    // res.json('file' + req.body.files[1]);
    var caption = req.query.caption;
    var files = JSON.stringify(req.body);
    var key = crypto.randomBytes(16).toString("hex");
    var caption = req.body.caption;
    // utility.uploadFile.apiUpload(files, key);

    console.log(req.body)
    var code;
    var mediator;
    var role = utility.UserRole.GetRoleName(req);
    var _chat = new model.ChatModel({ CaseId: req.body.caseId, Content: caption, File: req.body, Date: currentDate });
    if (role == 'user' || role == 'invitee') {
        _chat.TP_Name = req.session.name;
        _chat.Mediator_Name = null;
    }
    if (role == 'mediator') {
        mediator = req.user.FullName;
        _chat.TP_Name = null;
        _chat.Mediator_Name = mediator;
    }
    _chat.save(function (err, data) {
        if (err) res.json({ status: 0, message: err.message });
        else res.json({ status: 1, key: data._id });
    });
};

// module.exports.previewfile = function (req, res) {
//     var ImageFile = [];
//     var key = crypto.randomBytes(16).toString("hex");
//     if (req.body.names) {
//         var files = req.body.names;
//         utility.uploadFile.previewUpload(req, key);
//         for (var i = 0; i < files.length; ++i) {
//             ImageFile.push({
//                 'filename': key + files[i]
//             });
//         }
//         res.json(ImageFile);
//     }
// };

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