const mongoose = require('mongoose')
const Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10;

var MediatorSchema = new Schema({
    FullName: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    NotificationLastRead: Date
})

MediatorSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified(user.Password)) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        console.log(salt);
        // hash the password using our new salt
        bcrypt.hash(user.Password, salt, function (err, hash) {
            if (err) return next(err);
            console.log(hash);
            // override the cleartext password with the hashed one
            user.Password = hash;
            next();
        });
    });
});

MediatorSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var ComplaintSchema = new Schema({
    TPName: { type: String, required: true },
    TPEmail: { type: String, required: true },
    TPAddress: { type: String, required: true },
    TPPhone: { type: String, required: true },
    TPWebsite: { type: String, required: true },
    Complaint: { type: String, required: true },
    UName: { type: String, required: true },
    UPhone: { type: String, required: true },
    UAddress: { type: String, required: true },
    UEmail: { type: String, required: true },
    DateGenerated: Date,
    Status: String, //0-New Case, 1-Pending, 2-Accepted, 3-Resolved
    FileCode: { type: String },
    FileId: { type: String, ref: 'File' }
})

var FileSchema = new Schema({
    FileCode: { type: String, required: true },
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Phone: { type: String, required: true },
    Key: { type: String, required: true },
    Date: Date,
    NotificationLastRead: Date
});

var CaseSchema = new Schema({
    MediatorId: { type: String },
    UserId: { type: String },
    TP_Id: { type: String },
    Mediator_Name: { type: String },
    ComplaintId: { type: String, required: true, ref: 'Complaint' },
    Date: Date
});

var CasePaymentSchema = new Schema({
    Amount: { type: String },
    ComplaintId: { type: String, required: true, ref: 'Complaint' },
    IsPaymentMade: Boolean,
    Date: Date
});

var ChatSchema = new Schema({
    Content: String,
    File: [],
    SenderName: { type: String }, //TP means third party
    SenderId: { type: String },
    // Mediator_Name: { type: String },
    CaseId: { type: String, required: true, ref: 'Case' },
    Date: Date,
});

var ProfilePicSchema = new Schema({
    File: { type: String, required: true },
    MediatorId: { type: String, required: true }
})

var InviteeSchema = new Schema({
    FullName: { type: String }, //TP means third party
    Email: { type: String, required: true },
    SecretToken: { type: String, required: true },
    CaseId: { type: String, required: true, ref: 'Case' },
    Key: { type: String },
    DateInvited: Date
});

var NotificationSchema = new Schema({
    SenderId: { type: String },
    ReceiverId: { type: String },
    ChatId: { type: String, required: true, ref: 'Chat' },
    IsRead: { type: Boolean },
    Date: Date
});

var ConversationSchema = new Schema({
    CaseId: { type: String },
    ParticipantId: { type: String },
});

var Mediator = mongoose.model('Mediator', MediatorSchema);
module.exports.MediatorModel = Mediator;

var Complaint = mongoose.model('Complaint', ComplaintSchema);
module.exports.ComplaintModel = Complaint;

var MyFile = mongoose.model('File', FileSchema);
module.exports.FileModel = MyFile;

var Case = mongoose.model('Case', CaseSchema);
module.exports.CaseModel = Case;

var Chat = mongoose.model('Chat', ChatSchema);
module.exports.ChatModel = Chat;

var Pic = mongoose.model('ProfilePic', ProfilePicSchema);
module.exports.ProfilePicModel = Pic;

var Invitee = mongoose.model('Invitee', InviteeSchema);
module.exports.InviteeModel = Invitee;

var CasePayment = mongoose.model('CasePayment', CasePaymentSchema);
module.exports.CasePaymentModel = CasePayment;

var Notification = mongoose.model('Notification', NotificationSchema);
module.exports.NotificationModel = Notification;

var Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports.ConversationModel = Conversation;