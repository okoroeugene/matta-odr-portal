const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var currentDate = new Date();
var crypto = require('crypto');
var fileService = require('../services/fileService');

module.exports.verifymediator = async function (req, res) {
    await model.MediatorModel.findByIdAndUpdate(req.params.id, { IsVerified: true }, function (err, data) {
        if (data) res.json(1);
    });
}

module.exports.unverifymediator = async function (req, res) {
    await model.MediatorModel.findByIdAndUpdate(req.params.id, { IsVerified: false }, function (err, data) {
        if (data) res.json(1);
    });
}

module.exports.getcounts = async function (req, res) {
    var allCounts = [];
    await model.MediatorModel.count(async function (err, data) {
        var p = {
            'mediatorCount': data
        };
        await allCounts.push(p);
    });
    await model.FileModel.count(async function (err, data) {
        var p = {
            'fileCount': data
        };
        await allCounts.push(p);
    });
    await model.ComplaintModel.count(async function (err, data) {
        var p = {
            'complaintCount': data
        };
        await allCounts.push(p);
    });
    res.json(allCounts);
}