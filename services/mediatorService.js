const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var currentDate = new Date();
var rootPath = index.myPath;
var mail = require('../Helpers/mail');
var crypto = require('crypto');
var path = require('path');
var mediatorRepo = require('../repositories/mediatorRepository');

var medService = module.exports = {
    NewMediator: async function (firstname, lastname, email, userId, callback) {
        await mediatorRepo.NewMediator(firstname, lastname, email, userId, function (data) {
            callback(data);
        });
    },
}