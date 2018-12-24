// Configuring the database
var dbConfig = require('../../../config/database.config.js');

exports.executeQuery = function(query,values_arr) {
    return new Promise(function(resolve, reject) {
        dbConfig.query(query,values_arr, function(err,response) {  
            console.log(this.sql);          
            if (err) {
                reject(err);
            } else {                
                resolve(response);
            }
          
    });
    
});
   
}