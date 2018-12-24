var express = require('express');
var bodyParser = require('body-parser');
var Promise = require('promise');
var jwt = require('jsonwebtoken');
var _ = require('underscore');
var cors = require('cors');
const logger = require('morgan');
var app = express();
var moment = require('moment-timezone');
//moment.tz.setDefault('Asia/Kolkata');
moment.tz(Date.now(), "Asia/Kolkata");

process.env.SECRET_KEY = "lti-uppcl";
//Setting current Date Time
var current_date_new = new Date();
//console.log(current_date_new);

var current_date = new Date(current_date_new.getTime() + (+5.30 * 60 * 60 * 1000));

/* Set Global variables values */
/* global.upload=upload; */
global.success_code = "200";
global.error_code = "100";
global.success_status_value = true;
global.failure_status_value = false;

global.current_datetime = current_date;

/* User Module*/
global.empty_user_email = "Please enter user name.";
global.empty_user_mobile_number = "Please enter mobile number.";
global.user_is_already_exits = "Username already exist, please try with another username.";
global.email_is_already_exits = "Email already exist, please try with another email.";
global.mobile_is_already_exits = "Mobile No. already exist, please try with another mobile no.";
global.account_is_already_exits = "Your account number is already registered with us,";
global.account_already_used_by_someone_else = "This account number has already registered with us, please try using another account.";
global.database_error = 'Something went wrong. Please try again!';
global.registration_success_msg = "User registered successfully!";
global.empty_user_password = "Please enter password.";
global.empty_device_token = "Please send device token.";
global.user_is_not_exits = "User does not exists.";
global.user_account_is_not_active = "Your account is deactivated, please contact to admin.";
global.user_password_not_matched = "Username and password did not match.";
global.user_login_success_msg = "Login successfully.";
global.otp_sent_msg = "OTP is sent on your supplied email address or mobile number, please check your inbox.";
global.otp_sent_error_msg = 'Error Occured! while sending otp, Please try again later';
global.data_listed = "Data listed successfully.";
global.empty_params = "Please fill required parameters.";
global.profileUpdated = "Your profile has been updated successfully.";
global.updatedMSG = "Account updated successfully.";
global.removedMSG = "Account removed successfully.";
global.account_is_already_exits = "Your account number has already linked with your profile.";
global.account_added = "Your account number has been linked successfully.";
global.account_not_exists = "Please enter a valid account number.";
global.account_verified = "Your account has been verified successfully.";
global.account_number_not_exits_in_soa = "Account number does not exists.";
global.account_is_already_exits_soa_check = "Account number is already registered with us.";
global.complaint_added = "Your complaint has been registered successfully.";
global.request_added = "Your service request has been registered successfully.";
global.data_not_found = "No complaint registered.";
global.data_not_found_service = "No service request registered.";


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
// app.use(bodyParser.json());
// var router = express.Router();
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//var busboy = require('connect-busboy');

//app.use(busboy({ immediate: true }));

//app.use(logger('dev'));

//for header

//end header


//app.use( cookieParser() );


app.get('/favicon.ico', (req, res) => res.sendStatus(204));


app.use(cors());


app.use(function (req, res, next) {

    global.current_dates = moment().format('YYYY-MM-DD HH:mm:ss');


    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,  Origin,OPTIONS,Accept,Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method,Access-Control-Request-Headers,token');

    var appData = {};
    var url = req.url;
    var url_arr = url.split('/');
    var method = url_arr[url_arr.length - 1];

    var url_arr2 = url.split('/');
    var method2 = url_arr2[parseInt(url_arr2.length) - 2];

    //  return;
    var token = req.headers['token'];
    // console.log("======>");
    // console.log(req.body);
    // console.log("<<<<<<<<<<======>");
    // console.log(req.headers);
 
   // console.log(method2);
    // return;

        // console.log("<<<<<<<<<<======>>>>>");
        // console.log(method2);
        // console.log("/////////////");
      


    app.use(express.static('public'));


    
    var noAuth = ['register', 'login', 'forgotpassword', 'importdata','csvImportdataClient','FTPClient',
    'questionList','forgotPassword','otpVerify','resetPassword','YTDdatafromurlautomatic',
    'ODRdatafromurlautomatic','monthlyDataFromurlAutomatic','dailyDataFromurlAutomatic','hourlyDataFromurlAutomatic',
    'allYearlyDataFromurlAutomatic','weeklyDataFromurlAutomatic','SOAaddAccount','otpVerifyRegistration'];
    var noAuth2 = ['profile_image', 'csv','exceltemp','downloads','consumption','billing'  ];
    if (!_.contains(noAuth, method) && !_.contains(noAuth2, method2)) {
       
     
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY, function (err_jwt, result_jwt) {
                if (err_jwt) {
                    appData["status"] = 0;
                    appData["data"] = [];
                    appData["authCode"] = global.error_code;
                    appData["msg"] = "Invalid token";
                    res.status(500).json(appData);
                } else {
                    if (!result_jwt || !result_jwt.userId) {
                        appData["status"] = 0;
                        appData["data"] = [];
                        appData["authCode"] = global.error_code;
                        appData["msg"] = "Please check headers token params.";
                        //appData["data"] = "Please send a token";
                        res.status(401).json(appData);
                    } else {
                        var utils = require('./app/utils-module');
                        var base64 = require('base-64');
                        var crypto = require('crypto');
                        //var decodeCustomerId = base64.decode((customerId));
                        //var decodePassword = base64.decode((password));
                        // var decodeCustomerId = Buffer.from(customerId, 'base64').toString('ascii');
                        // var decodePassword = Buffer.from(password, 'base64').toString('ascii');
                        // console.log(decodeCustomerId);
                        // return;

                        // var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
                        // var decryptedPassword = mykey.update(decodePassword, 'utf8', 'hex') + mykey.final('hex');
                        utils.db.executeQuery('SELECT `id` FROM `users` WHERE (`id` = ?) LIMIT 1', [result_jwt.userId]).then(function (result) {
                            if (result.length > 0) {
                                next();
                            } else {
                                appData["status"] = 0;
                                appData["data"] = [];
                                appData["authCode"] = global.error_code;
                                appData["msg"] = "Please check headers param.";
                                //appData["data"] = "Please send a token";
                                res.status(401).json(appData);
                            }
                        });
                    }
                }
            });
        } else {
            appData["status"] = 0;
            appData["data"] = [];
            appData["authCode"] = global.error_code;
            appData["msg"] = "Please send a token";
            //appData["data"] = "Please send a token";
            res.status(401).json(appData);
        }
    } else {
       // console.log("yeahhh");
       
        next();
    }
       // if (!req.query.pesapal_transaction_tracking_id) {
    // } else {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length,offset,current_link,app_id,event_name,event_slug,type,offset,event_id_str,title,email_address,username,monitor_id_str,new_password,confirm_password,old_password,first_name,last_name,permissions,modified_by,created_by,account_user_id,password,account_user_id_str,no_of_days,item_per_page,event_id,operator_data_set,action,order_by,sort_by,random_event_id,start_date,end_date,select_fields_str,fields_str,user_email,search_string,Client_id,font_colour,user_type,loggedIn_userId,monitor_id_str,slug,field,chart_type,day_month_wise,user_id,app_id,flag,type,action_type,shedultedReportData, user_activity_log_id,export_type,updated_fields_arr,Old_fields_str,aggregate,aggregateFields,user_notification_id,action_id,unsubscribe_time,customreport_id,custom_fields,index,track_id,assigned_user_id,task_status,log_id");
    //     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    //     res.header("Access-Control-Allow-Credentials", "true");
    //     next();
    // }
   
});

require('./app/routes/users.routes')(app);
require('./app/routes/readingdatas.routes')(app);
// listen for requests
app.set('port', process.env.PORT || 3002);
var server = app.listen(app.get('port'), function () {

    console.log('Server started, listening on port ' + app.get('port'));
},"0.0.0.0");
server.timeout = 100000000;
module.exports = app;
