var ejs = require('ejs'); // using ejs for templating
 const path = require("path");
/* 

temp_type= 'email/mobile_push';
tempate_file_name='Msg Template file name';
data= that need to be display in template file;
options= optional template settings.


*/
module.exports.getTemplate=function(temp_type,tempate_file_name,data,options){ // function for get template function
    var type  = temp_type || "email"; // default will be email
    var templ_path=path.join(__dirname, './templ/'); // html template file folder
       /*  var response={};  */
       if(type='email'){
            templ_path+='email/'; // email template folder.
            templ_path+=tempate_file_name;
       }
    return new Promise(function(resolve,reject){
        
        if(type='email'){ // if type is email currently supported.
           
            ejs.renderFile(templ_path, data, options, function(err, str) { // rendering html file  template.
                if (err) {
                    reject(err);
                } else {
                    resolve(str);
                }
            });
        }/* else{ //process other types of templates currenlty this case is rejected.
            response['authCode'] = error_code;
            response['success'] = failure_status_value;
            response['msg'] = 'Please send template type';
            reject(response);
        } */
    });
}
