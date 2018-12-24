var mysql = require('mysql');
var db = mysql.createConnection({
    host: '10.10.212.14',
    user: 'root',
    password: 'Wedig!2468',
    database: 'lti_uppcl'
});

db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});


var mongoose = require('mongoose');
mongoose.connect('mongodb://10.10.212.16:27017/lti');
var db1 = mongoose.connection;
db1.on('error', console.error.bind(console, 'connection error:'));
db1.once('open', function () {
    // we're connected!
    console.log("mongo connected!!");
});

require('mongoose').set('debug', true)

module.exports = db;