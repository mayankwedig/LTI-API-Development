var readingdatas = require('../helpers').readingdatas;

//Create and save new user
exports.getDataFromAPI = function (req, res) { 
    readingdatas.getDataFromAPI(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
};
