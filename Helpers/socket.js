var app = require('../app');
var model = require('../models/entitymodels');
var session = require('../Helpers/session');
var sharedsession = require("express-socket.io-session");
var server = app.server;
var io = require('socket.io').listen(server);
io.use(sharedsession(session, {
    autoSave: true,
}));

var allConnectedUsers = [];
io.on('connection', function (socket) {
    var userId;
    if (socket.handshake.session.passport)
        if (socket.handshake.session.passport.user)
            userId = socket.handshake.session.passport.user;


    socket.join(userId); // We are using room of socket io

    var currentCount = 0;
    socket.on('notify', function (caseId, userId, sendername, content, allData) {
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