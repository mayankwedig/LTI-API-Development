var stringsFunctions = require('./stringsFunctions');
var db = require('./db');
var templ = require('./templates/lib/templates');
var utils = {
    str: stringsFunctions,
    db: db,
    templ: templ
}
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'user1.guts@gmail.com',
        pass: 'wedig@123'
    }
});
/* 
send email option as following 
var mailOptions = {
    from: '"Jay Marks" <user1.guts@gmail.com>',
    to: '',
    subject: '',
    html: ''
}; */
var sendEmail = function (emailOptions) { // send email
    return new Promise(function (resolve, reject) {
        transporter.sendMail(emailOptions, function (error, info) {
            if (error) {
                reject(error);

            } else {
                resolve(info);
            }
        });
    });

};
var daysInMonth = function (month, fullData) { // send email
    return new Promise(function (resolve, reject) {
      //  var i;
        var currentTime = new Date();
        var yearData = currentTime.getFullYear();
        var monthData = month;
        // console.log(fullData.length);
        // return;
        let lastData = new Array();
        for (inc = 1; inc <= month; inc++) {
         
            var j = 1;
            fullData.forEach(function (elements, idx, element) {
                // console.log("=======>");
               // console.log(element.length);
                // console.log("<<<<<<<<<<<<<<<<<<<=======>");
                // console.log(idx);
                // return;
                var dateCreate = new Date(elements.created).getDay();
                // console.log(dateCreate);
                // console.log("=======>");
                // console.log(inc);
                // console.log("<<<<<<=======>");
                //return;
                if (dateCreate == inc) {
                    //console.log(elements);
                    lastData.push(elements.dates);
                    return;
                } else {
                    if (idx+1 == element.length) {
                        //console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");

                        var dataInitial = {
                            recordGeneratedTimestamp: 0,
                            amount: 0,
                            readKWH: 0,
                            meterSeriolNumber: 0,
                            meterBadgeNumber: 0,
                            accountNumber: 0,
                            dates: 10,
                            recordGeneratedTimestamp: 0
                        };
                        // console.log(dataInitial);
                        lastData.push(dataInitial);
                        return;


                        // return;
                    }else{
                        return;
                       // lastData.push(element);
                    } 
                    // else {
                    //     lastData[i] = element;
                    // }
                 
                }
          

                //  j++;
                // console.log(lastData);
                //console.log("=======>");
                // console.log(dateCreate);
                //return;
              
            });
         // return;
        if(lastData.length > 31){continue;}
         
        }

         // console.log(month);
         //  console.log(lastData);
        //   return
        //  var dateRet =  new Date(year, month, 0).getDate();
        resolve(lastData);
       // return;
  
    });

};
/* function for sending notification currently two type of notification  can be send email and firbase push notification 
    we can  use templates for sending email notifications  send email options as follwing:
    mailOptions['to'] = receiver_email_address;
    mailOptions['subject'] = email_subject;
    mailOptions['from'] = '"Jay Marks" <user1.guts@gmail.com>';
    Msg will be attached using template file.
						              
*/
var sendNotification = function (notification_type, template_file_name, mailOpts, data) {
    var type = notification_type || "email"; // defulat will be email
    var template_file_name = template_file_name || "";
    var mailOpts = mailOpts || "";
    var data = data || "";
    var response = {};
    return new Promise(function (resolve, reject) {
        if (type == 'email') {// if type is Email.

            if (mailOpts != "" && typeof mailOpts === 'object')// if email options are set and type is object
            {
                if (!utils.str.isEmptyObj(mailOpts))// if email options object is not empty and type is object
                {
                    if (template_file_name != "") {// if tempate file is set
                        var options = {};
                        utils.templ.getTemplate(type, template_file_name, data, options).then(function (res) {// getting email template
                            mailOpts['html'] = res;
                            sendEmail(mailOpts).then(function (sendMeailResponse) {
                                resolve(sendMeailResponse);
                            }, function (error) {
                                response['authCode'] = error_code;
                                response['success'] = failure_status_value;
                                response['msg'] = 'Error occured while sending Email.';
                                reject(response);
                                throw error;
                            });
                        }, function (error) {
                            response['authCode'] = error_code;
                            response['success'] = failure_status_value;
                            response['msg'] = 'Error occured while getting template file.';
                            reject(response);
                            throw error;
                        });

                    } else {// if tempate file is not set. Process notification without tempate.
                        response['authCode'] = error_code;
                        response['success'] = failure_status_value;
                        response['msg'] = 'Please send template file name';
                        reject(response);
                    }

                } else {// email objects are empty throw error
                    response['authCode'] = error_code;
                    response['success'] = failure_status_value;
                    response['msg'] = 'Email options object can not be blank';
                    reject(response);
                }

            } else { //
                response['authCode'] = error_code;
                response['success'] = failure_status_value;
                response['msg'] = 'Please set email options';
                reject(response);


            }
        }/* else{ //push notification will goes here

        } */
    });
};
exports.sendEmail = sendEmail;
exports.sendNotification = sendNotification;
exports.daysInMonth = daysInMonth;
