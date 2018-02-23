const express = require('express')
var session = require('express-session');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
const Schema = mongoose.Schema
const path = require('path');
module.exports.myApp = app;
module.exports.myBodyParser = bodyParser;
var passport = require("passport");
module.exports.myPassport = passport;
var auth = require('./services/session');
var model = require('./models/entitymodels');
module.exports.myPath = __dirname + '/public';
var routes = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));

//connect server
var option = {
    server: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 30000
        }
    }
};

// mongoose.connect('mongodb://localhost/mattaDb', option).then(function (err, database) {
//     if (err) console.log(err)
//     app.listen(3005, function () {
//         console.log('listening to 3005')
//     })
//     console.log('Server is Connected!')
// }, function (err) {
//     //err handle
// });
mongoose.connect('mongodb://127.0.0.1/mattaDb', option, (err, database) => {
    if (err) console.log(err.message)
    else {
        app.listen(3005, function () {
            console.log('listening to 3005')
        })
        console.log('Server is Connected!')
    }
})

require('./routes');
// require('./controller/product');
// require('./controller/category');
// require('./controller/user'); 
// require('./controller/coupon');