module.exports = function(app) {
    var readingdatas = require('../controllers/readingdatas.controller.js');
    // Read data
        app.post('/readingdatas/getDataFromAPI', readingdatas.getDataFromAPI);
    }

