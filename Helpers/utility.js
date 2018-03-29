var index = require('../app');
var session = require('../Helpers/session');
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
    GetRoleName: function (req, res) {
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
    },

    GetRoleNameByUserId: function (id, callback) {
        model.MediatorModel.findById(id, function (err, data) {
            if (data)
                callback('mediator');
        });
        model.FileModel.findOne({ Key: id }, function (err, data) {
            if (data)
                callback('user');
        });
        model.InviteeModel.findOne({ Key: id }, function (err, data) {
            if (data)
                callback('invitee');
        });
    },

    // GetRoleNameandAuthenticate: function (req) {
    //     if (role == 'mediator' && data.MediatorId != req.user.id) res.redirect('/error');
    //     else res.sendFile(rootPath + '/views/layout.html')
    //     //Authenticate User
    //     if (role == 'user') {
    //         model.FileModel.findOne({ FileCode: data.ComplaintId.FileCode }, function (err, file) {
    //             if (file) {
    //                 if (file.Key != req.session.key) res.redirect('/error');
    //                 else res.sendFile(rootPath + '/views/layout.html')
    //             }
    //             else res.redirect('/error');
    //         });
    //     }
    //     if (role == 'invitee') {
    //         model.InviteeModel.findOne({ SecretToken: req.session.SecretToken }, function (err, inv) {
    //             if (inv.CaseId != data._id) res.redirect('/error');
    //             else res.sendFile(rootPath + '/views/layout.html')
    //         });
    //     }
    // }
}

module.exports.getCurrentLoggedInUser = {
    id: function (req, res) {
        var userId;
        if (req.session)
            if (req.session.key)
                userId = req.session.key;
            else if (req.user)
                userId = req.user._id;
        return userId;
    },

    name: function (req, res) {
        var username;
        if (req.session)
            username = req.session.name;
        else if (req.user)
            username = req.user.FullName;
        return username;
    }
}

module.exports.GetUserNameByUserId = function (id, callback) {
    model.MediatorModel.findById(id, function (err, data) {
        if (data)
            callback(data.FullName);
    });
    model.FileModel.findOne({ Key: id }, function (err, data) {
        if (data)
            callback(data.Name);
    });
    model.InviteeModel.findOne({ Key: id }, function (err, data) {
        if (data)
            callback(data.FullName);
    });
}

module.exports.Authorize = {
    user: function (req, res, next) {
        if (req.session.code == undefined) {
            var url = req.url;
            res.redirect('/verify?returnUrl=' + url);
        }
        else next();
    },
    mediator: function (req, res, next) {
        if (req.user == undefined) {
            var url = req.url;
            res.redirect('/login?returnUrl=' + url);
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
            var url = req.url;
            res.redirect('/verify?returnUrl=' + url);
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
                var newFile = key + item.originalname;
                var path = item.path;
                fs.rename(newFile, path, function (response) {
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