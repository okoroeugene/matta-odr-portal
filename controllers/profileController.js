const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var currentDate = new Date();


app.post('/uploadpic', utility.Authorize.mediator, function (req, res) {
    // console.log(req.file);
    if (req.file) {
        var files = req.file;
        utility.uploadFile.myUpload(req);
        model.ProfilePicModel.create({
            File: req.file.filename,
            MediatorId: req.user._id
        }, function (err, data) {
            if (err) res.json({ status: 0, message: err.message });
            else {
                res.json({ status: 1, message: data.id });
            }
        })
    }
});

module.exports.getMediatorCases = function (req, res) {
    var userId = req.user._id;
    model.CaseModel.find()
        .where('MediatorId').in(userId)
        .populate('ComplaintId')
        .exec(function (err, data) {
            if (err) console.log(err.message);
            else {
                res.json(data);
            }
        });
}

module.exports.getallCases = function (req, res) {
    model.ComplaintModel.find()
        .exec(function (err, data) {
            if (err) console.log(err.message);
            else {
                res.json(data);
            }
        });
}

