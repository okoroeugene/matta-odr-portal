const express = require('express')
// var session = require('express-session');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
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
module.exports.multer = multer;
var server = app.listen(3005)
var io = require('socket.io').listen(server);
app.use(express.static(path.join(__dirname, 'public')));
var session = require('./Helpers/session');
var sharedsession = require("express-socket.io-session");
app.use(session);

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

mongoose.connect('mongodb://<matta>:<matta123>@ds237409.mlab.com:37409/heroku_24p8v70m', option, (err, database) => {
    if (err) console.log(err.message)
    else {
        // app.listen(3005, function () {
        //     console.log('listening to 3005')
        // })
        console.log('MATTA DB is Connected!')
    }
})

io.use(sharedsession(session, {
    autoSave: true,
}));
// var api = io.of('/api');
// io.on('connection', require('./Helpers/socket'));
var allConnectedUsers = [];
io.on('connection', function (socket) {
    var userId;
    if (socket.handshake.session)
        if (socket.handshake.session.key)
            userId = socket.handshake.session.key;
        else if (socket.handshake.session.passport)
            if (socket.handshake.session.passport.user)
                userId = socket.handshake.session.passport.user;


    socket.join(userId); // We are using room of socket io

    var currentCount = 0;
    socket.on('notify', function (caseId, userId, sendername, content, allData) {
        console.log(currentCount);
        currentCount = currentCount + 1;
        getChatParticipants(caseId, userId, sendername, content, allData, function (data) {
            var result = {
                'count': data.length,
                'content': data
            }
            // io.sockets.emit('notifyCount', result);
        });
    });

    //Gets active chat Participants
    var participants = null;
    var participants = [];
    function getChatParticipants(caseId, userId, sendername, content, allData, callback) {
        var clients = socket.handshake.session.allClients;
        model.ConversationModel.find({ CaseId: caseId, ParticipantId: { $ne: userId } }, function (err, convo) {
            for (let i = 0; i < convo.length; i++) {
                let lastLoop = convo.length - 1;
                if (convo)
                    // var result = check(convo[i].ParticipantId);
                    getUserNotificationData(convo[i].ParticipantId, function (data) {
                        var result = {
                            'count': data.length,
                            'content': data
                        }

                        io.sockets.in(convo[i].ParticipantId).emit('notifyCount', result, sendername, content, convo[i].ParticipantId, allData, currentCount);
                    });
                else console.error('Something went wrong!!');
            }
        });
    }

    // var chatData = [];
    function getUserNotificationData(response, callback) {
        model.NotificationModel.find({ ReceiverId: response, IsRead: false }).populate('ChatId').exec(function (err, data) {
            if (data)
                callback(data);
        });
    }
});

require('./routes');
// require('./repositories/caseRepository');
// require('./services/caseService');
// require('./Helpers/socket'); 
// require('./controllers');
module.exports.io = io;
// module.exports = app;