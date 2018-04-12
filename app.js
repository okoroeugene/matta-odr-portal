var compression = require('compression')
const express = require('express')
// var session = require('express-session');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
var currentDate = new Date();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Schema = mongoose.Schema
const path = require('path');
module.exports.myApp = app;
module.exports.myBodyParser = bodyParser;
var passport = require("passport");
module.exports.myPassport = passport;
var auth = require('./Helpers/session');
var model = require('./models/entitymodels');
module.exports.myPath = __dirname + '/public';
var routes = require('./routes');
var multer = require('multer');
var utility = require('./Helpers/utility');
module.exports.multer = multer;
var server = app.listen(process.env.PORT || 3005);
module.exports.server = server;
var io = require('socket.io').listen(server);
app.use(express.static(path.join(__dirname, 'public')));
var session = require('./Helpers/session');
var socket = require('./Helpers/socket');
var sharedsession = require("express-socket.io-session");
app.use(compression());
app.use(session);
app.use(logErrors);

//connect server
// var option = {
//     server: {
//         socketOptions: {
//             keepAlive: 300000,
//             connectTimeoutMS: 30000
//         }
//     },
//     replset: {
//         socketOptions: {
//             keepAlive: 300000,
//             connectTimeoutMS: 30000
//         }
//     }
// };

// "dev": "node app.js",
//     "start": "node app.js"

mongoose.connect('mongodb://matta:matta123@ds237409.mlab.com:37409/heroku_24p8v70m', {useMongoClient: true}, (err, database) => {
// mongoose.connect('mongodb://127.0.0.1/mattaDb', (err, database) => {
    if (err) console.log(err.message)
    else {
        // app.listen(3005, function () {
        //     console.log('listening to 3005')
        // })
        console.log('MATTA DB is Connected!')
    }
});

//Create first admin user
app.get('/CreateAdminUser', async function (req, res) {
    utility.createuser('admin', 'admin@matta.com.ng', '@matta123#', 'admin', async cb => {
        //Successful
    });
});

async function logErrors(err, req, res, next) {
   await model.ErrorStackModel.create({ error: err.stack, date: currentDate });
    next(err);
}

// var allConnectedUsers = [];
// io.on('connection', function (socket) {
//     module.exports.socket = socket;
// });
// module.exports.io = io;
// var api = io.of('/api');
// io.on('connection', require('./Helpers/socket'));


require('./routes');
// require('./repositories/caseRepository');
// require('./services/caseService');
// require('./Helpers/socket'); 
// require('./controllers');
// module.exports.io = io;
// module.exports = app;