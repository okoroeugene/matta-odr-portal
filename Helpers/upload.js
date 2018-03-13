var index = require('../app');
var fs = require('file-system');
var rootPath = index.myPath;

module.exports.uploadFile = {
    myUpload: function (req, err) {
        if (err) return 0;
        else {
            var file = req.file.originalname;
            var path = req.file.path;
            // console.log(path);
            fs.rename(file, path, function (response) {
                // console.log(response);
            });
        }
    },
    myMultipleUpload: function (req, err) {
        if (err) return 0;
        else {
            var file = req.files;
            file.forEach(item => {
                var newFile = item.originalname;
                var path = item.path;
                fs.rename(newFile, path, function (response) {
                    // something here
                });
            });
            
            
        }
    },
    delete: function () {

    }
}