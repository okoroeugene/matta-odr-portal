var app = require('../app');
var model = require('../models/entitymodels');
var session = require('express-session');
var io = app.io;

module.exports = function (socket) {
    // console.info(`Client connected [id=${socket.id}]`);
    var allConnectedUsers = [];
    var userId;
    if (socket.handshake.session)
        if (socket.handshake.session.key)
            userId = socket.handshake.session.key;
        else if (socket.handshake.session.passport)
            if (socket.handshake.session.passport.user)
                userId = socket.handshake.session.passport.user;

    // allConnectedUsers.push({
    //     'userId': userId,
    //     'socketId': socket.id
    // })
    // console.log(allConnectedUsers)

    // socket.on('notify', function (currentUserId) {
    //     io.sockets.emit('notifyCount', currentUserId);
    // });

    socket.on('notify', function (currentUserId) {
        getUserNotificationData(currentUserId, function (data) {
            let result = {
                'count': data.length,
                'content': data
            }
            io.sockets.emit('notifyCount', result);
        });
    });

    let chatData = [];
    function getUserNotificationData(response, callback) {
        model.NotificationModel.find({ ReceiverId: response, IsRead: false }, function (err, data) {
            if (data)
                for (let i = 0; i < data.length; i++) {
                    model.ChatModel.findById(data[i].ChatId, function (err, _chat) {
                        let lastLoop = data.length - 1;
                        if (_chat)
                            chatData.push(_chat);
                        if (i == lastLoop)
                            callback(chatData);
                    });
                }
        })
    }
};

// model.ChatModel.find().and([{ _id: { $ne: Id }, SenderId: { $ne: response } }])