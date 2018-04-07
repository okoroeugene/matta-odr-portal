const mongoose = require('mongoose')
const Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
})

var MediatorDataSchema = new Schema({
    userId: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    // password: { type: String, required: true },
    NotificationLastRead: Date,
    IsVerified: { type: Boolean, required: true }
})

// UserSchema.pre('save', function (next) {
//     var user = this;
//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified(user.Password)) return next();
//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
//         if (err) return next(err);
//         console.log(salt);
//         // hash the password using our new salt
//         bcrypt.hash(user.Password, salt, function (err, hash) {
//             if (err) return next(err);
//             console.log(hash);
//             // override the cleartext password with the hashed one
//             user.Password = hash;
//             next();
//         });
//     });
// });

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
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
    TPWebsite: { type: String },
    Complaint: { type: String, required: true },
    UName: { type: String, required: true },
    UPhone: { type: String, required: true },
    UAddress: { type: String, required: true },
    UEmail: { type: String, required: true },
    DateGenerated: Date,
    Status: String, //0-New Case, 1-Pending, 2-Resolved, 3-Resolved
    FileCode: { type: String },
    FileId: { type: String, ref: 'File' }
})

var FileSchema = new Schema({
    userId: { type: String, required: true },
    filecode: { type: String, required: true },
    // password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    // Key: { type: String, required: true },
    date: Date,
    // NotificationLastRead: Date
});

var CaseSchema = new Schema({
    MediatorDataId: { type: String },
    UserId: { type: String },
    TP_Id: { type: String },
    Mediator_Name: { type: String },
    ComplaintId: { type: String, required: true, ref: 'Complaint' },
    Date: Date
});

var CasePaymentSchema = new Schema({
    Amount: { type: String, required: true },
    EstimatedNumberOfDays: { type: String, required: true },
    ComplaintId: { type: String, required: true, ref: 'Complaint' },
    MediatorDataId: { type: String, required: true, ref: 'Mediator' },
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

var InviteeSchema = new Schema({
    userId: { type: String, required: true },
    FullName: { type: String }, //TP means third party
    Email: { type: String, required: true },
    SecretToken: { type: String, required: true },
    CaseId: { type: String, required: true, ref: 'Case' },
    // Key: { type: String },
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

var ProfilePicSchema = new Schema({
    Image: { type: String, required: true },
    UserId: { type: String, required: true },
});

var MediatorProfileSchema = new Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    OtherNames: { type: String },
    MiniBio: { type: String, required: true },
    Phone: { type: String, required: true },
    Address: { type: String, required: true },
    MediatorCertificate: { type: String, required: true },
    MediatorDataId: { type: String, required: true, ref: 'Mediator' },
    Date: Date,
});

var User = mongoose.model('User', UserSchema);
module.exports.UserModel = User;

var Mediator = mongoose.model('Mediator', MediatorDataSchema);
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

var ProfilePic = mongoose.model('ProfilePic', ProfilePicSchema);
module.exports.ProfilePicModel = ProfilePic;

var MediatorProfile = mongoose.model('MediatorProfile', MediatorProfileSchema);
module.exports.MediatorProfileModel = MediatorProfile;