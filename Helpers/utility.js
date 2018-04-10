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
    GetRoleName: async function (req, res) {
        if (req.session !== undefined) {
            return req.session.role;
        }
    },

    // GetRoleNameByUserId: function (id, callback) {
    //     model.MediatorModel.findById(id, function (err, data) {
    //         if (data)
    //             callback('mediator');
    //     });
    //     model.FileModel.findOne({ Key: id }, function (err, data) {
    //         if (data)
    //             callback('user');
    //     });
    //     model.InviteeModel.findOne({ Key: id }, function (err, data) {
    //         if (data)
    //             callback('invitee');
    //     });
    // },

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
        if (req.user) userId = req.user.id;
        // if (req.session.key)
        //     userId = req.session.key;
        // else if (req.user)
        //     userId = req.user._id;
        return userId;
    },

    name: async function (req, res, callback) {
        var username;
        if (req.session.role === 'mediator') {
            await model.MediatorModel.findOne({ userId: req.user.id }, function (err, data) {
                callback(data.firstname + ' ' + data.lastname);
            });
        }
        if (req.session.role === 'user') {
            await model.FileModel.findOne({ userId: req.user.id }, function (err, data) {
                callback(data.firstname + ' ' + data.lastname);
            });
        }
        if (req.session.role === 'invitee') {
            await model.InviteeModel.findOne({ userId: req.user.id }, function (err, data) {
                callback(data.FullName);
            });
        }
    }
}

// module.exports.GetUserNameByUserId = async function (req, id, callback) {
//     var username;
//     await model.UserModel.find(id, function (err, data) {
//         callback(data.username);
//     });
// }

module.exports.GetUserNameByUserId = async function (req, id, callback) {
    var username;
    if (req.session.role === 'mediator') {
        await model.MediatorModel.findOne({ userId: id }, function (err, data) {
            callback(data.firstname + ' ' + data.lastname);
        });
    }
    if (req.session.role === 'user') {
        await model.FileModel.findOne({ userId: id }, function (err, data) {
            callback(data.firstname + ' ' + data.lastname);
        });
    }
    if (req.session.role === 'invitee') {
        await model.InviteeModel.findOne({ userId: id }, function (err, data) {
            callback(data.fullname);
        });
    }
}

module.exports.GetUserNameByUserIdAndRole = async function (req, id, role, callback) {
    var username;
    if (role === 'mediator') {
        await model.MediatorModel.findOne({ userId: id }, function (err, data) {
            callback(data.firstname + ' ' + data.lastname);
        });
    }
    if (role === 'user') {
        await model.FileModel.findOne({ userId: id }, function (err, data) {
            callback(data.firstname + ' ' + data.lastname);
        });
    }
    if (role === 'invitee') {
        await model.InviteeModel.findOne({ userId: id }, function (err, data) {
            callback(data.fullname);
        });
    }
}

module.exports.Authorize = {
    user: async function (req, res, next) {
        var url = req.url;
        req.session.returnUrl = url;
        if (req.session.role !== 'user') res.redirect('/login?returnUrl=' + url);
        else next();
    },
    mediator: async function (req, res, next) {
        var url = req.url;
            req.session.returnUrl = url;
            if (req.session.role !== 'mediator') res.redirect('/login?returnUrl=' + url);
            else next();
    },
    invitee: async function (req, res, next) {
        var url = req.url;
            req.session.returnUrl = url;
            if (req.session.role !== 'invitee') res.redirect('/login?returnUrl=' + url);
            else next();
    },
    userandinvitee: async function (req, res, next) {
        var url = req.url;
            req.session.returnUrl = url;
            if (req.session.role !== 'user' && req.session.role !== 'invitee') res.redirect('/login?returnUrl=' + url);
            else next();
    },
    admin: async function (req, res, next) {
        var url = req.url;
        req.session.returnUrl = url;
        if (req.session.role !== 'admin') res.redirect('/login?returnUrl=' + url);
        else next();
    },
    all: function (req, res, next) {
        if (req.user === undefined) {
            var url = req.url;
            req.session.returnUrl = url;
            res.redirect('/login?returnUrl=' + url);
        }
        else next();
    }
}

module.exports.uploadFile = {
    myUpload: function (req, err, callback) {
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


module.exports.createuser = async function (username, email, password, role, callback) {
    await model.UserModel.findOne({ username: username }, async function (err, user) {
        if (err) console.log(err.message);
        else {
            if (user) { callback(0); }
            else {
                var _user = await new model.UserModel({
                    username: username,
                    email: email,
                    password: password,
                    role: role,
                });
                await _user.save(async (err, new_user) => {
                    if (new_user) {
                        callback(new_user);
                    }
                });
            }
        }
    });
}