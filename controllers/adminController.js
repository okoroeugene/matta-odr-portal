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