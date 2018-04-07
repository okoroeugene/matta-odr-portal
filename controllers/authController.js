const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var passport = index.myPassport;
var currentDate = new Date();

module.exports.authenticateUser = function (req, res, next) {
    passport.authenticate('local-sign-in', function (err, user, info) {
        // console.log(user);
        var returnUrl = req.session.returnUrl;
        if (err) {
            // return next(err); // will generate a 500 error
        }
        if (!user) {
            return res.json({ success: false, message: 'authentication failed' });
        }
        req.login(user, loginErr => {
            if (loginErr) {
                // return next(loginErr);
            }
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
}

module.exports.createMediator = async function (req, res) {
    utility.createuser(req.body.email, req.body.email, req.body.password, 'mediator', async cb => {
        await model.MediatorModel.findOne({ Email: req.body.email }, async function (err, user) {
            await model.MediatorModel.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                // password: req.body.password,
                IsVerified: false,
                userId: cb.id
            }, async function (err, med) {
                if (med) {
                    await passport.authenticate('local-sign-in', {});
                    req.login(cb, loginErr => {
                        if (loginErr) {
                            // return next(loginErr);
                        }
                        else {
                            req.session.role = 'mediator';
                            res.json(1);
                        }
                    });
                }
            });
        });
    });
}

module.exports.getUserName = function (req, res) {
    // var Id = req.user.id;
    // var user = req.session.code;
    // var mediator = req.user;
    // var invitee = req.session.SecretToken;
    // if (user == undefined && mediator == undefined && invitee == undefined) res.json(0);
    // else {
    //     if (user != undefined || invitee != undefined) res.json(req.session.name);
    //     if (mediator != undefined) res.json(req.user.FullName);
    // }
    var userName;
    if (req.user !== undefined) userName = req.user.username;
    else userName = 'No User';
    res.json(userName);
};

module.exports.getrole = async function (req, res) {
    var roles = await utility.UserRole.GetRoleName(req, res);
    if (roles == 'user') res.json({ role: 'user' });
    if (roles == 'mediator') res.json({ role: 'mediator' });
    if (roles == 'invitee') res.json({ role: 'invitee' });
};

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

async function getUserNotificationData(response, callback) {
    await model.NotificationModel.find({ ReceiverId: response, IsRead: false }).populate('ChatId').exec(function (err, data) {
        if (data)
            callback(data);
    });
}

module.exports.MarkAsRead = async function (req, res) {
    var userId = utility.getCurrentLoggedInUser.id(req);
    await model.NotificationModel.update({ ReceiverId: userId }, { IsRead: true }, { multi: true }, function (err, data) {
        if (data)
            res.json(1);
    });
}

module.exports.getRoleById = function (req, res) {
    var id = utility.getCurrentLoggedInUser.id(req, res);
    res.json(req.session.role);
};

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

module.exports.getuserid = function (req, res) {
    var id = utility.getCurrentLoggedInUser.id(req, res);
    res.json(id);
}

module.exports.getprofilepic = async function (req, res) {
    var id = utility.getCurrentLoggedInUser.id(req, res);
    await model.ProfilePicModel.findOne({ UserId: id }).sort({ _id: -1 }).exec(function (err, data) {
        res.json(data);
    });
}

// module.exports.allusers = function (req, res) {
//     model.ComplaintModel.find()
//         .exec(function (err, data) {
//             res.json(data);
//         })
// }