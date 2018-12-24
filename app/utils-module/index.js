var dbUtils = require('./lib/db');
var stringUtils = require('./lib/stringsFunctions');
var templates= require('./lib/templates/');
var notifications= require('./lib/notifications');
module.exports = {
    db:dbUtils,
    str:stringUtils,
    notify:notifications,
    templ:templates
}

