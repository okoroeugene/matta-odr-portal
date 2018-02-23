var index = require('../app');
var session = require('../services/session');
var multer = require('multer');
var fs = require('file-system');
var model = require('../models/entitymodels');
var rootPath = index.myPath;

module.exports.randomNumber = {
    generateRan: function (response) {
        //alert('success. transaction ref is ' + response.reference);
        function makeid() {
            var mytext = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < response; i++)
                mytext += possible.charAt(Math.floor(Math.random() * possible.length));
            return mytext;
        }
        return makeid();
    },

    generateNum: function (response) {
        //alert('success. transaction ref is ' + response.reference);
        function makeid() {
            var mytext = "";
            var possible = "0123456789";

            for (var i = 0; i < response; i++)
                mytext += possible.charAt(Math.floor(Math.random() * possible.length));
            return mytext;
        }
        return makeid();
    }
}

module.exports.UserRole = {
    GetRoleName: function (req) {
        if (req.session != undefined) {
            if (req.session.code != undefined) {
                return 'user';
            }
            if (req.session.SecretToken != undefined) {
                return 'invitee';
            }
        }
        if (req.user != undefined) {
            if (req.user.Email != undefined) {
                return 'mediator';
            }
        }
    }
}

module.exports.Authorize = {
    user: function (req, res, next) {
        if (req.session.code == undefined) {
            res.redirect('/error');
        }
        else next();
    },
    mediator: function (req, res, next) {
        if (req.user == undefined) {
            res.redirect('/error');
        }
        else next();
    },
    // invitee: function (re, res, next) {
    //     var token = req.body.seretToken;
    //     model.InviteeModel.findOne({ SecretToken: token }, function (err, data) {
    //         if (err) {
    //             console.log(err.message);
    //             next();
    //         } 
    //         else if(!data) next();
    //         else if(data) res.sendFile(rootPath + '/views/layout.html')
    //         else next();
    //     });
    // },
    all: function (req, res, next) {
        if (req.session.code == undefined && req.user == undefined && req.session.SecretToken == undefined) {
            res.redirect('/error');
        }
        else next();
    }
}

module.exports.uploadFile = {
    myUpload: function (req, err) {
        if (err) return 0;
        else {
            var file = req.file.originalname;
            var path = req.file.path;
            // console.log(path);
            fs.rename(file, path, function (response) {
                // console.log(response);
            });
        }
    },
    myMultipleUpload: function (req, err) {
        if (err) return 0;
        else {
            var file = req.files;
            file.forEach(item => {
                var newFile = item.originalname;
                var path = item.path;
                fs.rename(newFile, path, function (response) {
                    // something here
                });
            });


        }
    },
    apiUpload: function (files, key, err) {
        if (err) return 0;
        else {
            files.forEach(item => {
                console.log(item);
                var newFile = key + item;
                // var path = item.path;
                var file = rootPath + '/uploads/' + newFile;
                fs.writeFile(file, newFile, function (response) {
                    if (err) console.log(err);
                });
            });
            // file.forEach(item => {
            //     console.log(item);
            //     var newFile = item;
            //     // var path = item.path;
            //     fs.rename(newFile, function (response) {
            //         // something here
            //     });
            // })
        }
    },
    delete: function () {

    }
}