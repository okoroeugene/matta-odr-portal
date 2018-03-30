const index = require('./app');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
var model = require('./models/entitymodels');
var app = index.myApp;
var multer = require('multer');
var rootPath = index.myPath;
var utility = require('./Helpers/utility');
var currentDate = new Date();
var passport = index.myPassport;
var session = require('./Helpers/session');
var auth = require('./Helpers/auth');
var upload = multer({ dest: 'public/uploads/' })
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
var mail = require('./Helpers/mail');
var sms = require('./Helpers/twilio');
var caseCtrl = require('./controllers/caseController');
var complaintsCtrl = require('./controllers/complaintsCtrl');
var fileCtrl = require('./controllers/fileController');
var authCtrl = require('./controllers/authController');
var profileCtrl = require('./controllers/profileController');
var mediatorCtrl = require('./controllers/mediatorController');

app.use(flash())
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/views/index.html')
});
app.get('/verify', function (req, res) {
    var returnUrl = req.query.returnUrl;
    if (returnUrl != undefined) {
        req.session.returnUrl = returnUrl;
    }
    res.sendFile(__dirname + '/public/views/auth.html')
});
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/views/auth.html')
});
app.post('/login', authCtrl.authenticateUser);
app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/public/views/auth.html')
});
app.post('/register', authCtrl.createUser);
app.get('/error', function (req, res) {
    res.sendFile(__dirname + '/public/views/error.html')
});
app.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.json(1);
})
app.get('/open-file', function (req, res) {
    res.sendFile(__dirname + '/public/views/auth.html')
});
app.post('/checkcode', fileCtrl.verifyCode);
app.get('/portal', function (req, res) {
    res.sendFile(__dirname + '/public/views/layout.html')
});
app.get('/profile', utility.Authorize.mediator, function (req, res) {
    res.sendFile(__dirname + '/public/views/layout.html')
});
app.post('/openfile', fileCtrl.openFile);
app.post('/genFileNumber', fileCtrl.genFileNumber);
app.get('/new-complaint', utility.Authorize.user, complaintsCtrl.viewNewComplaints);
app.post('/new-complaint', utility.Authorize.user, complaintsCtrl.createComplaint);
app.get('/case/:id', utility.Authorize.all, caseCtrl.viewCase);
app.post('/addchat/:id', caseCtrl.chat);
app.get('/casedata/:id', caseCtrl.caseDetails);
app.get('/casechat/:id', caseCtrl.chatDetails);
app.get('/complaints', utility.Authorize.mediator, profileCtrl.getMediatorCases);
app.post('/createcase', caseCtrl.acceptCase);
app.post('/InviteThirdParty', caseCtrl.inviteUser);
app.get('/checkinvite/:id', caseCtrl.checkinvite);
app.post('/uploadfile/:id', upload.array('uploadfile', 6), utility.Authorize.all, caseCtrl.uploadfile)
app.get('/pending', utility.Authorize.user, complaintsCtrl.pendingcomplaint);
app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/public/views/admin/adminlayout.html')
})
app.get('/admin/complaints', function (req, res) {
    res.sendFile(__dirname + '/public/views/admin/adminlayout.html')
})
app.get('/allcomplaints', complaintsCtrl.allcomplaints);
app.get('/admin/mediators', function (req, res) {
    res.sendFile(__dirname + '/public/views/admin/adminlayout.html')
})
app.get('/validate', function (req, res) {
    if (req.session.fileNumber === undefined)
        res.redirect('/open-file');
    else
        res.sendFile(__dirname + '/public/views/auth.html')
});
app.get('/allmediators', mediatorCtrl.allmediators);
app.get('/checkstatus', complaintsCtrl.pendingcomplaint);
app.get('/getmediatordata/:id', mediatorCtrl.getmediatordata);
app.get('/getcomplaintdata/:id', complaintsCtrl.getcomplaintdata);
app.post('/addcasepayment/:id', utility.Authorize.mediator, complaintsCtrl.addcomplaintpayment);
app.get('/verifypayment', utility.Authorize.user, complaintsCtrl.verifypayment);
app.post('/makecomplaintpayment/:id', complaintsCtrl.makecomplaintpayment);
app.get('/getMediatorName/:id', mediatorCtrl.getmediatorbycomplaintId);
app.get('/legal-tips', function (req, res) {
    res.sendFile(__dirname + '/public/views/admin/adminlayout.html')
})
app.get('/mediator-profile', function (req, res) {
    res.sendFile(__dirname + '/public/views/layout.html')
})
app.post('/legal-tips')
app.get('/getallcases', utility.Authorize.mediator, profileCtrl.getallCases);
app.post('/markasread', authCtrl.MarkAsRead);
app.post('/uploadmediatorimage', upload.single('Image'), mediatorCtrl.uploadMediatorImage);
app.get('/getprofilepic', utility.Authorize.mediator, mediatorCtrl.getprofilepic);
app.get('/getawaitingpayment', utility.Authorize.mediator, complaintsCtrl.getawaitingpayment)
app.get('/user', authCtrl.getUserName);
app.get('/getroles', authCtrl.getrole);
app.get('/notificationcount', authCtrl.getnotificationdata);
app.get('/userrole', authCtrl.getRoleById);
app.get('/getpopoverdata/:id', authCtrl.popoverdata);
app.post('/declinecase/:id', utility.Authorize.mediator, complaintsCtrl.declinecase);
app.get('/getNewRegData', fileCtrl.getNewRegData);
// app.post('/previewfile', upload.array('Images', 6), utility.Authorize.all, caseCtrl.previewfile)