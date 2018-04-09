const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var currentDate = new Date();
var rootPath = index.myPath;
var mail = require('../Helpers/mail');
var crypto = require('crypto');
var path = require('path');

module.exports = {
    NewMediator: async function (firstname, lastname, email, userId, callback) {
        await model.MediatorModel.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            IsVerified: false,
            userId: userId
        }, function (err, data) {
            if (data) callback(data);
        });
    },
};
