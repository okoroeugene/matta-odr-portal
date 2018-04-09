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

//AUTHENTICATES USER BASED ON SUPPLIED CREDENTIALS
module.exports.authenticateUser = function (req, res, next) {
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
                    // if (user.role === 'invitee') {
                    //     await model.InviteeModel.findOne({ SecretToken: user.username }, (err, inv) => {
                    //         return res.json({ success: true, role: user.role, caseId: inv.CaseId });
                    //     });
                    // }
                    // else return res.json({ success: true, role: user.role });
                    return res.json({ success: true, role: user.role });
                }
            } catch (error) {
                console.log(error);
            }
        });
    })(req, res, next);
}

//CREATES A NEW MEDIATOR, BUT MEDIATOR REMAINS UNVERIFIED UNTIL ADMIN VERIFIES HE/SHE
module.exports.createMediator = async function (req, res) {
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
}

//GETS CURRENT LOGGED IN USER USERNAME
module.exports.getUserName = function (req, res) {
    var userName;
    if (req.user !== undefined) userName = req.user.username;
    else userName = 'No User';
    res.json(userName);
};

//GETS CURRENT LOGGED IN USER ROLE
module.exports.getrole = async function (req, res) {
    var roles = await utility.UserRole.GetRoleName(req, res);
    if (roles == 'user') res.json({ role: 'user' });
    if (roles == 'mediator') res.json({ role: 'mediator' });
    if (roles == 'invitee') res.json({ role: 'invitee' });
};

//GETS ALL USER NOTIFIICATION DETAILS INCLUDING THE COUNT
module.exports.getnotificationdata = async function (req, res) {
    var userId = utility.getCurrentLoggedInUser.id(req, res);
    await getUserNotificationData(userId, function (data) {
        var result = {
            'count': data.length,
            'content': data
        }
        res.json(result);
    });
};

//GETS NOTIFICATION DATA BASED ON USERID
async function getUserNotificationData(response, callback) {
    await model.NotificationModel.find({ ReceiverId: response, IsRead: false }).populate('ChatId').exec(function (err, data) {
        if (data)
            callback(data);
    });
}

//FLAGS A NOTIFICATION AS READ
module.exports.MarkAsRead = async function (req, res) {
    var userId = utility.getCurrentLoggedInUser.id(req);
    await model.NotificationModel.update({ ReceiverId: userId }, { IsRead: true }, { multi: true }, function (err, data) {
        if (data)
            res.json(1);
    });
}

//GETS CURRENT LOGGED IN USER ROLE BY USERID
module.exports.getRoleById = function (req, res) {
    var id = utility.getCurrentLoggedInUser.id(req, res);
    res.json(req.session.role);
};

//GETS USER DATA AND DISPLAYS IN POP-OVER
module.exports.popoverdata = async function (req, res) {
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
};

//GETS CURRENT LOGGED IN USER ID
module.exports.getuserid = function (req, res) {
    var id = utility.getCurrentLoggedInUser.id(req, res);
    res.json(id);
}

//GET USER PROFILE PICTURE
module.exports.getprofilepic = async function (req, res) {
    var id = utility.getCurrentLoggedInUser.id(req, res);
    await model.ProfilePicModel.findOne({ UserId: id }).sort({ _id: -1 }).exec(function (err, data) {
        res.json(data);
    });
}

//RETRIEVE USER PASSWORD
module.exports.forgotpassword = async function (req, res) {
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
}

//GET USER DATA BASED ON THE PROVIDED TOKEN
module.exports.GetUserDataByToken = async function (req, res) {
    var token = req.params.id;
    await model.ResetPasswordModel.findOne({ token: token }).populate('userId').exec(function (err, data) {
        if (!data) res.json(0);
        res.json(data);
    });
}


//RESET USER PASSWORD AFTER CHECKING IF THE TOKEN IS VALID
module.exports.resetpassword = async function (req, res) {
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
}

// module.exports.allusers = function (req, res) {
//     model.ComplaintModel.find()
//         .exec(function (err, data) {
//             res.json(data);
//         })
// }