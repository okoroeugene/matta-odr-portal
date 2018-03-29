const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var passport = index.myPassport;
var currentDate = new Date();

module.exports.allmediators = function (req, res) {
    model.MediatorModel.find()
        .exec(function (err, data) {
            res.json(data);
        })
}

module.exports.getmediatordata = function (req, res) {
    var id = req.params.id;
    model.MediatorModel.findById(id, function (err, data) {
        res.json(data);
    });
}

module.exports.getmediatorbycomplaintId = function (req, res) {
    var id = req.params.id;
    model.CaseModel.findOne({ ComplaintId: id }, function (err, data) {
        if (data) {
            res.json(data.Mediator_Name);
        }
    });
}

module.exports.uploadMediatorImage = function (req, res) {
    if (req.file && req.user !== undefined)
        utility.uploadFile.myUpload(req);   
        model.ProfilePicModel.create({
            Image: req.file.filename,
            UserId: req.user._id
        });
        res.redirect('/profile');
    // console.log('Invalid Credentials!');
};

module.exports.getprofilepic = function (req, res) {
    var userId = utility.getCurrentLoggedInUser.id(req, res);
    model.ProfilePicModel.findOne({ UserId: userId }).sort({ _id: -1 }).exec(function (err, data) {
        res.json(data)
    });
}