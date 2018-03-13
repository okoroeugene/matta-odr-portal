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