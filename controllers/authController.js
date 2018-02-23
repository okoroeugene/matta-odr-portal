const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../repositories/utility');
var passport = index.myPassport;
var currentDate = new Date();

module.exports.authenticateUser = function (req, res, next) {
    passport.authenticate('local-sign-in', function (err, user, info) {
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
            else return res.json({ success: true });
        });
    })(req, res, next);
}

module.exports.createUser = function (req, res) {
    model.MediatorModel.findOne({ Email: req.body.email }, function (err, user) {
        if (err) console.log(err.message);
        else {
            if (user) { res.json("User already exists!"); }
            else {
                model.MediatorModel.create({
                    FullName: req.body.fullname,
                    Email: req.body.email,
                    Password: req.body.password
                }, function (err, new_user) {
                    passport.authenticate('local-sign-in', {});
                    res.json(1);
                });
            }
        }
    });
}

app.get('/user', function (req, res) {
    var user = req.session.code;
    var mediator = req.user;
    var invitee = req.session.SecretToken;
    if (user == undefined && mediator == undefined && invitee == undefined) res.json(0);
    else {
        if (user != undefined || invitee != undefined) res.json(req.session.name);
        if (mediator != undefined) res.json(req.user.FullName);
    }
});

app.get('/getroles', function (req, res) {
    var roles = utility.UserRole.GetRoleName(req);
    if (roles == 'user') res.json({role: 'user'});
    if (roles == 'mediator') res.json({role: 'mediator'});
    if (roles == 'invitee') res.json({role: 'invitee'});
});