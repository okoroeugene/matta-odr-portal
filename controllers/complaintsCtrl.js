const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var currentDate = new Date();
var rootPath = index.myPath;
var utility = require('../Helpers/utility');
var complaintService = require('../services/complaintService');

module.exports.viewNewComplaints = async function (req, res) {
    var fileCode = req.session.code;
    await model.ComplaintModel.findOne({ FileCode: fileCode }, function (err, data) {
        if (data) {
            res.redirect('/pending');
        }
        else res.sendFile(rootPath + '/views/layout.html')
    });
}

module.exports.createComplaint = function (req, res) {
    complaintService.AddComplaint(req, res, function (data) {
        if (data) res.json(1);
        else res.json(0);
    });
}

module.exports.allcomplaints = async function (req, res) {
    await model.ComplaintModel.find()
        .exec(function (err, data) {
            res.json(data);
        })
}

module.exports.getcomplaintdata = async function (req, res) {
    var id = req.params.id;
    await model.ComplaintModel.findById(id, function (err, data) {
        res.json(data);
    });
}

module.exports.addcomplaintpayment = function (req, res,) {
    var id = req.params.id;
    if (req.body.cost === undefined || req.body.estNoDays === undefined)
        res.json(0);
    else
    {
        complaintService.AddCasePayment(req, res, async function (_result) {
            if (_result) {
                await model.ComplaintModel.findByIdAndUpdate(id, { Status: 1 }, function (err, data) {
                    if (data) res.json(1);
                });
            }
            else {
                res.json(0);
            }
        });
    }
}

module.exports.pendingcomplaint = async function (req, res) {
    var filecode = req.session.code;
    await model.ComplaintModel.findOne({ FileCode: filecode }, function (err, complaintData) {
        if (complaintData) {
            res.sendFile(rootPath + '/views/layout.html')
            // complaintService.getComplaintStatus(complaintData, function (data) {
            //     if (data == 2 || data == 3) res.redirect('/error');
            //     res.sendFile(rootPath + '/views/layout.html')
            // });
        }
        else {
            res.redirect('/new-complaint')
        }
    });
}

module.exports.verifypayment = function (req, res) {
    var code = req.session.code;
    complaintService.VerifyAndReturnPaymentData(req, res, code);
}

module.exports.makecomplaintpayment = async function (req, res) {
    await model.CasePaymentModel.findByIdAndUpdate(req.params.id, { IsPaymentMade: 1 }, function (err, data) {
        if (data) {
            model.ComplaintModel.findById(data.ComplaintId).populate('FileId')
                .exec(function (err, result) {
                    var mediatorId = data.MediatorId;
                    var mediatorName = utility.getCurrentLoggedInUser.name(req, res, function (userName) {
                        complaintService.AddCaseAndUpdate(mediatorId, userName, data.ComplaintId, result.FileId.Key, function (e) {
                            if (e) {
                                // res.json({ status: 1, message: e.id });
                                res.json(1);
                            }
                            // else {
                            //     res.json({ status: 0, message: 'Something went wrong!!' });
                            // }
                        });
                    })
                })
        }
        else res.json(0);
    });
}

module.exports.getawaitingpayment = async function (req, res) {
    var mediatorId = utility.getCurrentLoggedInUser.id(req, res);
    await model.CasePaymentModel.find({ MediatorId: mediatorId })
    .populate('ComplaintId')
    .exec(function (err, data) {
        if (data)
            res.json(data);
    });
};

module.exports.declinecase = async function(req,res) {
    await model.CasePaymentModel.findById(req.params.id, async function(err, data) {
        if (data)
        {
            await model.ComplaintModel.findByIdAndUpdate(data.ComplaintId, { Status: 0 }, async function(err, result) { 
                if (result)
                {
                    await model.CasePaymentModel.findByIdAndRemove(req.params.id, function(err, data) {
                        res.json(1);
                    });
                }
            });
        }
    });
};

//UPDATE ANY DATA
// app.get('/g', function (req, res) {
//     model.ComplaintModel.find()
//         .exec(function (err, data) {
//             data.forEach(item => {
//                 model.ComplaintModel.findByIdAndUpdate(item._id, { Status: 2 },
//                     function (err, newData) {
//                         if (newData) res.json('success');
//                     })
//             });
//         })
// })

// app.get('/g', function (req, res) {
//     model.ComplaintModel.findByIdAndRemove('5a9810c4df59d142343193ee', function (err, data) {
//         if (err) console.log(err)
//         else res.json('Success');
//     })
// })



