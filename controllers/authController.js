const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var passport = index.myPassport;
var currentDate = new Date();
var mediatorService = require('../services/mediatorService');
var mail = require('../Helpers/mail');
var rootPath = index.myPath;
var bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10;

var authCtrl = module.exports = {
    //AUTHENTICATES USER BASED ON SUPPLIED CREDENTIALS
    authenticateUser: function (req, res, next) {
        passport.authenticate('local-sign-in', function (err, user, info) {
            var returnUrl = req.session.returnUrl;
            if (err) { }
            if (!user) return res.json({ success: false, message: 'authentication failed' });
            req.login(user, async loginErr => {
                if (loginErr) { }
                try {
                    if (user.role === 'user') req.session.code = user.username;
                    req.session.role = user.role;
                    if (returnUrl !== undefined)
                        return res.json({ success: true, url: returnUrl });
                    else {
                        return res.json({ success: true, role: user.role });
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        })(req, res, next);
    },

    //CREATES A NEW MEDIATOR, BUT MEDIATOR REMAINS UNVERIFIED UNTIL ADMIN VERIFIES HE/SHE
    createMediator: async function (req, res) {
        utility.createuser(req.body.email, req.body.email, req.body.password, 'mediator', async cb => {
            mediatorService.NewMediator(req.body.firstname, req.body.lastname, req.body.email, cb.id, async med => {
                if (med) {
                    await passport.authenticate('local-sign-in', {});
                    req.login(cb, loginErr => {
                        if (loginErr) { }
                        else {
                            req.session.role = 'mediator';
                            res.json(1);
                        }
                    });
                }
            })
        });
    },

    //GETS CURRENT LOGGED IN USER USERNAME
    getUserName: function (req, res) {
        var userName;
        if (req.user !== undefined) userName = req.user.username;
        else userName = 'No User';
        res.json(userName);
    },

    //GETS CURRENT LOGGED IN USER ROLE
    getrole: async function (req, res) {
        var roles = await utility.UserRole.GetRoleName(req, res);
        if (roles == 'user') res.json({ role: 'user' });
        if (roles == 'mediator') res.json({ role: 'mediator' });
        if (roles == 'invitee') res.json({ role: 'invitee' });
    },

    //GETS ALL USER NOTIFIICATION DETAILS INCLUDING THE COUNT
    getnotificationdata: async function (req, res) {
        var userId = utility.getCurrentLoggedInUser.id(req, res);
        await authCtrl.getUserNotificationData(userId, function (data) {
            var result = {
                'count': data.length,
                'content': data
            }
            res.json(result);
        });
    },

    //GETS NOTIFICATION DATA BASED ON USERID
    getUserNotificationData: async function (response, callback) {
        await model.NotificationModel.find({ ReceiverId: response, IsRead: false }).populate('ChatId').exec(function (err, data) {
            if (data)
                callback(data);
        });
    },

    //FLAGS A NOTIFICATION AS READ
    MarkAsRead: async function (req, res) {
        var userId = utility.getCurrentLoggedInUser.id(req);
        await model.NotificationModel.update({ ReceiverId: userId }, { IsRead: true }, { multi: true }, function (err, data) {
            if (data)
                res.json(1);
        });
    },

    //GETS CURRENT LOGGED IN USER ROLE BY USERID
    getRoleById: function (req, res) {
        var id = utility.getCurrentLoggedInUser.id(req, res);
        res.json(req.session.role);
    },

    //GETS USER DATA AND DISPLAYS IN POP-OVER
    popoverdata: async function (req, res) {
        await model.ProfilePicModel.findOne({ UserId: req.params.id }).sort({ _id: -1 }).exec(function (err, data) {
            utility.UserRole.GetRoleNameByUserId(req.params.id, function (result) {
                var src;
                if (data)
                    src = data.Image;
                else
                    src = '../Images/u1.png';
                var p = {
                    'role': result,
                    'src': src
                };
                res.json(p);
            });
        });
    },

    //GETS CURRENT LOGGED IN USER ID
    getuserid: function (req, res) {
        var id = utility.getCurrentLoggedInUser.id(req, res);
        res.json(id);
    },

    //GET USER PROFILE PICTURE
    getprofilepic: async function (req, res) {
        var id = utility.getCurrentLoggedInUser.id(req, res);
        await model.ProfilePicModel.findOne({ userId: id }).sort({ _id: -1 }).exec(function (err, data) {
            res.json(data);
        });
    },

    //RETRIEVE USER PASSWORD
    forgotpassword: async function (req, res) {
        var username = req.body.username;
        var path = rootPath + '/views/ForgotPasswordTemplate.html';
        var token = utility.randomNumber.generateRan(30);
        await model.UserModel.findOne({ username: username }, async (err, user) => {
            await utility.GetUserNameByUserIdAndRole(req, user.id, user.role, async _name => {
                var _reset = await new model.ResetPasswordModel({ userId: user.id, token: token, date: currentDate });
                await mail.mail(path, null, token, user.email, _name, 'Password Reset', async cb => {
                    if (cb === 1) {
                        await _reset.save((err, data) => {
                            if (data) res.json(1);
                        });
                    }
                    else res.json(0);
                });
            });
        });
    },

    //GET USER DATA BASED ON THE PROVIDED TOKEN
    GetUserDataByToken: async function (req, res) {
        var token = req.params.id;
        await model.ResetPasswordModel.findOne({ token: token }).populate('userId').exec(function (err, data) {
            if (!data) res.json(0);
            res.json(data);
        });
    },


    //RESET USER PASSWORD AFTER CHECKING IF THE TOKEN IS VALID
    resetpassword: async function (req, res) {
        var password = req.body.password;
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(req.body.password, salt, null, async (err, hash) => {
                if (err) return next(err);
                await model.ResetPasswordModel.findOne({ token: req.params.id }, async (err, data) => {
                    await model.UserModel.findByIdAndUpdate(data.userId, { password: hash }, (err, user) => {
                        if (user) res.json(1);
                    });
                });
            });
        });
    },

    //CHANGE USER PASSWORD
    changepassword: async function (req, res) {
        var oldpassword = req.body.oldpassword;
        var newpassword = req.body.newpassword;
        await model.UserModel.findById(req.user.id, async (err, user) => {
            await bcrypt.compare(oldpassword, user.password, async (err, result) => {
                if (result) {
                    await authCtrl.ImplementChanges(newpassword, req.user.id, cb => {
                        if (cb) res.json(1);
                    });
                } else {
                    res.json(0);
                }
            });
        });
    },

    ImplementChanges: async (newpassword, userId, callback) => {
        await bcrypt.genSalt(SALT_WORK_FACTOR, async (err, salt) => {
            await bcrypt.hash(newpassword, salt, null, async (err, hash) => {
                await model.UserModel.findByIdAndUpdate(userId, { password: hash }, (err, user) => {
                    if (user) callback(1);
                    else callback(0);
                });
            });
        });
    },
}


// allusers . function (req, res) {
//     model.ComplaintModel.find()
//         .exec(function (err, data) {
//             res.json(data);
//         })
// }