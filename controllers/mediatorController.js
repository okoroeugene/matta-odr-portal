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

module.exports.GetMediatorDataById = async function (req, res) {
    var id = req.params.id;
    await model.MediatorProfileModel.findOne({ MediatorId: id }).populate('MediatorId').exec(function (err, data) {
        model.ProfilePicModel.findOne({ UserId: id }).sort({ _id: -1 }).exec(function (err, img) {
            var p = {
                'MedProfileData': data,
                'Image': img
            };
            res.json(p);
        });
    });
}

module.exports.getmediatordata = async function (req, res) {
    var id = utility.getCurrentLoggedInUser.id(req, res);
    await model.MediatorModel.findById(id).exec(async function (err, data) {
        await model.ProfilePicModel.findOne({ UserId: id }).sort({ _id: -1 }).exec(function (err, img) {
            var p = {
                'MedProfileData': data,
                'Image': img
            };
            res.json(p);
        });
    });
}

module.exports.getmediatorbycomplaintId = async function (req, res) {
    var id = req.params.id;
    await model.CaseModel.findOne({ ComplaintId: id }, function (err, data) {
        if (data) {
            res.json(data.Mediator_Name);
        }
    });
}

module.exports.uploadMediatorImage = async function (req, res) {
    if (req.file && req.user !== undefined)
        utility.uploadFile.myUpload(req);
    await model.ProfilePicModel.create({
        Image: req.file.filename,
        UserId: req.user._id
    });
    res.redirect('/profile');
    // console.log('Invalid Credentials!');
};

module.exports.getprofilepic = async function (req, res) {
    var userId = utility.getCurrentLoggedInUser.id(req, res);
    await model.ProfilePicModel.findOne({ UserId: userId }).sort({ _id: -1 }).exec(function (err, data) {
        res.json(data)
    });
}

app.post('/uploadpic', utility.Authorize.mediator, async function (req, res) {
    // console.log(req.file);
    if (req.file) {
        var files = req.file;
        utility.uploadFile.myUpload(req);
       await model.ProfilePicModel.create({
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

module.exports.getMediatorCases = async function (req, res) {
    var userId = req.user._id;
    await model.CaseModel.find()
        .where('MediatorId').in(userId)
        .populate('ComplaintId')
        .exec(function (err, data) {
            if (err) console.log(err.message);
            else {
                res.json(data);
            }
        });
}

module.exports.getallCases = async function (req, res) {
    await model.ComplaintModel.find()
        .exec(function (err, data) {
            if (err) console.log(err.message);
            else {
                res.json(data);
            }
        });
}

module.exports.createmediatorprofile = async function (req, res) {
    await model.MediatorProfileModel.findOne({ MediatorId: req.user._id }, async function (err, data) {
        var _profile = new model.MediatorProfileModel(req.body);
        if (data) {
            _profile.MediatorCertificate = data.MediatorCertificate;
            await model.MediatorProfileModel.findByIdAndRemove(data._id, async function (err, result) { });
        }
        if (req.file !== undefined) {
            await utility.uploadFile.myUpload(req);
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

module.exports.existingmediatorprofile = async function (req, res) {
    await model.MediatorProfileModel.findOne({ MediatorId: req.user._id })
        .exec(function (err, data) {
            if (err) console.log(err.message);
            else {
                res.json(data);
            }
        });
}

