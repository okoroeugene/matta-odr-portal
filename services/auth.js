// var express = require('express');
const index = require('../app');
var app = index.myApp;
const auth = index.myPassport;
var app = index.myApp;
// const flash = require('connect-flash');
const bodyParser = index.myBodyParser;
var model = require('../models/entitymodels');
var passport = index.myPassport;
var LocalStrategy = require('passport-local').Strategy;
var session = require('../services/session');
var cookieParser = require('cookie-parser');
// var methodOverride = require('method-override')


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    // console.log(user);
    done(null, user.id)
})

passport.deserializeUser((userId, done) => {
    // console.log(userId);
    model.MediatorModel.findById(userId, (error, user) => {
        if (error) return done(error, false)
        //console.log(user)
        done(null, user)
    })
})

passport.use('local-sign-in', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback: true
},
    function (req, email, password, done) {
        model.MediatorModel.findOne({ Email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (user.Password != password) { done(null, false, { message: 'bad password' }); }
            // console.log(user)
            return done(null, user);
        });
    }
));

// passport.use('local-sign-up', new LocalStrategy({
//     usernameField: 'Email',
//     passwordField: 'Password',
//     passReqToCallback: true
// },
//     function (req, email, password, done) {
//         console.log('g:' + email);
//         model.UserSchema.findOne({ Email: email }, function (err, user) {
//             if (err) { return done("User already exists!"); }
//             if (user) { return done(null, false); }
//             var new_user = model.UserSchema();
//             new_user.Email = email;
//             new_user.Password = password;
//             console.log(user)
//             return done(null, user);
//         });
//     }
// ));
