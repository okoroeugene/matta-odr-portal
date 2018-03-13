const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var currentDate = new Date();
var rootPath = index.myPath;
var complaintService = require('../services/complaintService');

module.exports.viewNewComplaints = function (req, res) {
    var fileCode = req.session.code;
    model.ComplaintModel.findOne({ FileCode: fileCode }, function (err, data) {
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

module.exports.allcomplaints = function (req, res) {
    model.ComplaintModel.find()
        .exec(function (err, data) {
            res.json(data);
        })
}

module.exports.getcomplaintdata = function (req, res) {
    var id = req.params.id;
    model.ComplaintModel.findById(id, function (err, data) {
        res.json(data);
    });
}

module.exports.addcomplaintpayment = function (req, res) {
    var id = req.params.id;
    complaintService.AddCasePayment(req, res, function (_result) {
        if (_result) {
            model.ComplaintModel.findByIdAndUpdate(id, { Status: 1 }, function (err, data) {
                if (data) res.json(1);
            });
        }
        else {
            res.json(0);
        }
    });
}

module.exports.pendingcomplaint = function (req, res) {
    var filecode = req.session.code;
    model.ComplaintModel.findOne({ FileCode: filecode }, function (err, complaintData) {
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

module.exports.makecomplaintpayment = function (req, res) {
    model.CasePaymentModel.findByIdAndUpdate(req.params.id, { IsPaymentMade: 1 }, function (err, data) {
        if (data) {
            res.json(1);
        }
        else res.json(0);
    });
}

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



