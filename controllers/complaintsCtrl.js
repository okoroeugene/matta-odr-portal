const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var currentDate = new Date();

module.exports.viewNewComplaints = function (req, res) {
    var fileCode = req.session.code;
    model.ComplaintModel.findOne({ FileCode: fileCode }, function (err, data) {
        if (data) {
            if (data.Status == '0' || data.Status == '1') {
                model.CaseModel.findOne({ ComplaintId: data._id }, function (err, data) {
                    res.redirect('/case/' + data._id);
                });
            }
            else res.sendFile(__dirname + '/public/views/layout.html')
        }
        else res.redirect('/error');
    });
}

module.exports.createComplaint = function (req, res) {
    var _complaint = new model.ComplaintModel(req.body, function (err, data) {
        if (err) res.json(0);
        else {
            console.log(_complaint);
            res.json(1);
        }
    });
}



