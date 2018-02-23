const index = require('./app');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
var model = require('./models/entitymodels');
var app = index.myApp;
var multer = require('multer');
var rootPath = index.myPath;
var utility = require('./repositories/utility');
var currentDate = new Date();
var passport = index.myPassport;
var session = require('./services/session');
var auth = require('./services/auth');
var upload = multer({ dest: 'public/uploads/' })
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
var mail = require('./services/mail');
var sms = require('./services//twilio');
var caseCtrl = require('./controllers/caseController');
var complaintsCtrl = require('./controllers/complaintsCtrl');
var fileCtrl = require('./controllers/fileController');
var authCtrl = require('./controllers/authController');
var profileCtrl = require('./controllers/profileController');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(flash())
app.get('/', function (req, res) {
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
app.get('/new-complaint', utility.Authorize.user, complaintsCtrl.viewNewComplaints);
app.post('/new-complaint', complaintsCtrl.createComplaint);
app.get('/case/:id', utility.Authorize.all, caseCtrl.viewCase);
app.post('/addchat/:id', caseCtrl.chat);
app.get('/casedata/:id', caseCtrl.caseDetails);
app.get('/casechat/:id', caseCtrl.chatDetails);
app.get('/complaints', utility.Authorize.mediator, profileCtrl.getMediatorCases);
app.post('/createcase', caseCtrl.acceptCase);
app.post('/InviteThirdParty', caseCtrl.inviteUser);
app.get('/checkinvite/:id', caseCtrl.checkinvite);
app.post('/uploadfile', utility.Authorize.all, caseCtrl.uploadfile)
// app.post('/previewfile', upload.array('Images', 6), utility.Authorize.all, caseCtrl.previewfile)