const index = require('../app');
var app = index.myApp;
var model = require('../models/entitymodels');
var utility = require('../Helpers/utility');
var passport = index.myPassport;
var currentDate = new Date();

module.exports.allmediators = function (req, res) {
    model.MediatorModel.find()
        .exec(function (err, data) {
            res.json(data);
        })
}

module.exports.GetMediatorDataById = function (req, res) {
    var id = req.params.id;
    model.MediatorProfileModel.findOne({ MediatorId: id }).populate('MediatorId').exec(function (err, data) {
        model.ProfilePicModel.findOne({ UserId: id }).sort({ _id: -1 }).exec(function (err, img) {
            var p = {
                'MedProfileData': data,
                'Image': img
            };
            res.json(p);
        });
    });
}

module.exports.getmediatordata = function (req, res) {
    var id = utility.getCurrentLoggedInUser.id(req, res);
    model.MediatorModel.findById(id).exec(function (err, data) {
        model.ProfilePicModel.findOne({ UserId: id }).sort({ _id: -1 }).exec(function (err, img) {
            var p = {
                'MedProfileData': data,
                'Image': img
            };
            res.json(p);
        });
    });
}

module.exports.getmediatorbycomplaintId = function (req, res) {
    var id = req.params.id;
    model.CaseModel.findOne({ ComplaintId: id }, function (err, data) {
        if (data) {
            res.json(data.Mediator_Name);
        }
    });
}

module.exports.uploadMediatorImage = function (req, res) {
    if (req.file && req.user !== undefined)
        utility.uploadFile.myUpload(req);
    model.ProfilePicModel.create({
        Image: req.file.filename,
        UserId: req.user._id
    });
    res.redirect('/profile');
    // console.log('Invalid Credentials!');
};

module.exports.getprofilepic = function (req, res) {
    var userId = utility.getCurrentLoggedInUser.id(req, res);
    model.ProfilePicModel.findOne({ UserId: userId }).sort({ _id: -1 }).exec(function (err, data) {
        res.json(data)
    });
}

app.post('/uploadpic', utility.Authorize.mediator, function (req, res) {
    // console.log(req.file);
    if (req.file) {
        var files = req.file;
        utility.uploadFile.myUpload(req);
        model.ProfilePicModel.create({
            File: req.file.filename,
            MediatorId: req.user._id
        }, function (err, data) {
            if (err) res.json({ status: 0, message: err.message });
            else {
                res.json({ status: 1, message: data.id });
            }
        })
    }
});

module.exports.getMediatorCases = function (req, res) {
    var userId = req.user._id;
    model.CaseModel.find()
        .where('MediatorId').in(userId)
        .populate('ComplaintId')
        .exec(function (err, data) {
            if (err) console.log(err.message);
            else {
                res.json(data);
            }
        });
}

module.exports.getallCases = function (req, res) {
    model.ComplaintModel.find()
        .exec(function (err, data) {
            if (err) console.log(err.message);
            else {
                res.json(data);
            }
        });
}

module.exports.createmediatorprofile = function (req, res) {
    model.MediatorProfileModel.findOne({ MediatorId: req.user._id }, function (err, data) {
        var _profile = new model.MediatorProfileModel(req.body);
        if (data) {
            _profile.MediatorCertificate = data.MediatorCertificate;
            model.MediatorProfileModel.findByIdAndRemove(data._id, function (err, result) { });
        }
        if (req.file !== undefined) {
            utility.uploadFile.myUpload(req);
            _profile.MediatorCertificate = req.file.filename;
        }
        _profile.Date = currentDate;
        _profile.MediatorId = req.user._id;
        _profile.save(function (err, data) {
            if (data)
                res.json(1);
        });
    });
}

module.exports.uploadmediatorcert = function (req, res) {
    console.log(req.file);
    // utility.uploadFile.myUpload(req);
    // req.session.mediatorCertFileName = req.file.filename;
    // res.json(req.file.filename);
}

module.exports.existingmediatorprofile = function (req, res) {
    model.MediatorProfileModel.findOne({ MediatorId: req.user._id })
        .exec(function (err, data) {
            if (err) console.log(err.message);
            else {
                res.json(data);
            }
        });
}

