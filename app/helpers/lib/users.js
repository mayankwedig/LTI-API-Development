var utils = require('../../utils-module');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
process.env.SECRET_KEY = "lti-uppcl";
var formidable = require('formidable');
//create and save new user
var Consumption = require('./../../models/Consumption');
var ConsumptionHour = require('./../../models/ConsumptionHour');
var ConsumptionScalar = require('./../../models/ConsumptionScalar');
var VpnDownload = require('./../../models/VpnDownload');

var ConsumptionYTD = require('./../../models/ConsumptionYTD');
var ConsumptionODR = require('./../../models/ConsumptionODR');

var ConsumptionYear = require('./../../models/ConsumptionYear');
var DailyConsumption = require('./../../models/DailyConsumption');
var HourlyConsumption = require('./../../models/HourlyConsumption');
var AllYearsConsumption = require('./../../models/AllYearsConsumption');
var WeeklyConsumption = require('./../../models/WeeklyConsumption');
var SoaMonthlyConsumption = require('./../../models/SoaMonthlyConsumption');
var SoaDailyConsumption = require('./../../models/SoaDailyConsumption');
var SoaHourlyConsumption = require('./../../models/SoaHourlyConsumption');
var SoaYearlyConsumption = require('./../../models/SoaYearlyConsumption');
var SOAWeeklyConsumption = require('./../../models/SOAWeeklyConsumption');

var Billing = require('./../../models/Billing');

var BillingYear = require('./../../models/BillingYear');
var SoaNetMeter = require('./../../models/SoaNetMeter');

//SoaNetMeter









//ConsumptionScalars
var formidable = require('formidable');
var fs = require("fs-extra");
var async = require('async');
var moment = require('moment');
var gm = require("gm").subClass({ imageMagick: true });;

var _ = require('underscore');


module.exports = {
    //console.log("In");
    registration: function (req) {

        return new Promise(function (resolve, reject) {
            var user_name = req.body.username ? req.body.username : "";
            var password = req.body.password ? req.body.password : "";
            var email = req.body.email ? req.body.email : "";
            var mobile_number = req.body.mobile ? req.body.mobile : "";
            var org_password = password;

            ///q1
            var question1 = req.body.questionsList1 ? req.body.questionsList1 : "";
            var answer1 = req.body.ansques1 ? req.body.ansques1 : "";
            ///q2
            var question2 = req.body.questionsList2 ? req.body.questionsList2 : "";
            var answer2 = req.body.ansques2 ? req.body.ansques2 : "";

            var questionData = req.body.questions ? JSON.parse(req.body.questions) : "";
            var accountNumberReq = req.body.accountNumber ? req.body.accountNumber : "";
            var current_datetime = require('moment')().format('YYYY-MM-DD HH:mm:ss');


            var response = {};
            if (utils.str.is_not_empty(user_name) && utils.str.is_not_empty(mobile_number)
                && utils.str.is_not_empty(email) && utils.str.is_not_empty(accountNumberReq)) {

                var query = "select username from users where (username=?)";
                utils.db.executeQuery(query, [user_name]).then(function (result) {
                    if (result.length > 0) {

                        response['authCode'] = error_code;
                        response['status'] = failure_status_value;
                        response['msg'] = user_is_already_exits;
                        reject(response);
                    } else {
                        var queryEmailCheck = "select email from users where (email=?)";
                        utils.db.executeQuery(queryEmailCheck, [email]).then(function (resultEmail) {
                            if (resultEmail.length > 0) {

                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = email_is_already_exits;
                                reject(response);
                            } else {

                                var queryMobileCheck = "select mobile from users where (mobile=?)";
                                utils.db.executeQuery(queryMobileCheck, [mobile_number]).
                                    then(function (resultMobile) {
                                        if (resultMobile.length > 0) {
                                            response['authCode'] = error_code;
                                            response['status'] = failure_status_value;
                                            response['msg'] = mobile_is_already_exits;
                                            reject(response);
                                        } else {

                                            var queryMobileCheck = "select account_number from user_accounts where (account_number=?)";
                                            utils.db.executeQuery(queryMobileCheck, [accountNumberReq]).
                                                then(function (resultMobile) {
                                                    if (resultMobile.length > 0) {
                                                        response['authCode'] = error_code;
                                                        response['status'] = failure_status_value;
                                                        response['msg'] = account_is_already_exits;
                                                        reject(response);
                                                    } else {
                                                        var cipher = crypto.createCipher('aes-128-cbc', 'mypassword');
                                                        var encroptedPassword = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
                                                        // console.log(req.body.user_name);
                                                        // return;
                                                        utils.db.executeQuery("INSERT INTO `users` SET ?", [{
                                                            username: user_name,
                                                            created: current_datetime,
                                                            password: encroptedPassword,
                                                            modified: current_datetime,
                                                            org_password: org_password,
                                                            email: email,
                                                            mobile: mobile_number
                                                        }
                                                        ]).then(function (result) {
                                                            var insertId = result.insertId;
                                                            if (result.affectedRows > 0) {

                                                                var queryAccountCheck = "select * from user_account_soa where (account_number=?)";
                                                                utils.db.executeQuery(queryAccountCheck, [accountNumberReq]).
                                                                    then(function (resultAccount) {

                                                                        userAccountArray = [[1, resultAccount[0]['discom'], insertId, accountNumberReq, resultAccount[0]['account_name'], resultAccount[0]['billing_address'], resultAccount[0]['billing_amount'], resultAccount[0]['billing_due_date'],
                                                                            resultAccount[0]['premise_address'], resultAccount[0]['sanctioned_load'], resultAccount[0]['supply_type'], resultAccount[0]['division'], resultAccount[0]['subdivision'], resultAccount[0]['is_net_metering']]];//premise_address

                                                                        var sqlAccounts = "INSERT INTO user_accounts (is_primary,discom,user_id, account_number,account_name,billing_address,billing_amount,billing_due_date,premise_address,sanctioned_load,supply_type,division,subdivision,is_net_metering) VALUES ?";
                                                                        utils.db.executeQuery(sqlAccounts, [userAccountArray]).then(function (rs, e) {
                                                                            //update account

                                                                            var updateData = {
                                                                                account_name: resultAccount[0]['account_name'],
                                                                                area: resultAccount[0]['premise_address']
                                                                            };
                                                                            utils.db.executeQuery("UPDATE users set ? WHERE id = ?", [updateData, insertId]).then(function (rs, e) {
                                                                                ///start email functionality
                                                                                var emailId = email;
                                                                                //    console.log(emailId);
                                                                                //    return;
                                                                                // if user found
                                                                                //
                                                                                var filename = 'registration.ejs'; // registration email template
                                                                                var otp = Math.floor(1000 + Math.random() * 999999);
                                                                                var data = { USERNAME: user_name, PASSWORD: org_password }
                                                                                var mailOptions = {};
                                                                                mailOptions['to'] = emailId;
                                                                                mailOptions['subject'] = 'Your registration was successful.';
                                                                                mailOptions['from'] = '"UPPCL " <user1.guts@gmail.com>';
                                                                                utils.notify.sendNotification("email", filename, mailOptions, data).
                                                                                    then(function (respsss) { // notify user
                                                                                        //end email functionality


                                                                                        if (question1 && answer1 && question2 && answer2) {
                                                                                            var values = [];
                                                                                            var question1Ar = [];
                                                                                            question1Ar = [[insertId, question1, answer1], [insertId, question2, answer2]];
                                                                                            var sql222 = "INSERT INTO user_questions (user_id, question_id,answers) VALUES ?";
                                                                                            utils.db.executeQuery(sql222, [question1Ar]).then(function (rs, e) {
                                                                                                //console.log("aya to h");
                                                                                                response['authCode'] = success_code;
                                                                                                response['status'] = success_status_value;
                                                                                                response['msg'] = registration_success_msg;
                                                                                                response['insertId:'] = result.insertId;
                                                                                                resolve(response);
                                                                                            });
                                                                                        } else {
                                                                                            response['authCode'] = success_code;
                                                                                            response['status'] = success_status_value;
                                                                                            response['msg'] = registration_success_msg;
                                                                                            response['insertId:'] = result.insertId;
                                                                                            resolve(response);
                                                                                        }
                                                                                    });
                                                                            });
                                                                            //end update account





                                                                        });
                                                                        ///end account number
                                                                    });

                                                            } else {
                                                                response['authCode'] = error_code;
                                                                response['msg'] = database_error;
                                                                response['status'] = failure_status_value;
                                                                reject(response);
                                                            }
                                                        }, function (error) {
                                                            response['authCode'] = error_code;
                                                            response['msg'] = database_error;
                                                            response['status'] = failure_status_value;
                                                            reject(response);
                                                            throw error;
                                                        });

                                                    }
                                                })

                                        }
                                    });


                            }
                        });
                    }
                }, function (error) {

                    response['authCode'] = error_code;
                    response['msg'] = database_error;
                    response['status'] = failure_status_value;
                    reject(response);
                    throw error;

                });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Please fill mandatory fields.";
                reject(response);
            }
        });
    },
    getProfile: function (req) {

        return new Promise(function (resolve, reject) {

            var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.accountToken ? req.body.accountToken : "";

            var response = {};
            if (utils.str.is_not_empty(userId) && utils.str.is_not_empty(accountId)) {
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                var accountId = Buffer.from(accountId.toString(), 'base64').toString('ascii');

                //var query = "select id,first_name,account_name,last_name,username,email,mobile,area,profile_image from users where (id=?)";

                utils.db.executeQuery(
                    'SELECT users.id as profileId,users.mobile,users.first_name,users.last_name,users.profile_image,users.username,users.email,users.area,user_accounts.id,user_accounts.user_id,user_accounts.account_number,user_accounts.account_name,user_accounts.billing_address,user_accounts.billing_amount,user_accounts.billing_due_date,user_accounts.ebill,user_accounts.mobilebill,account_type,user_accounts.status,user_accounts.premise_address,user_accounts.sanctioned_load,user_accounts.supply_type,user_accounts.division,user_accounts.subdivision,user_accounts.bill_route FROM user_accounts JOIN users ON user_accounts.user_id = users.id WHERE user_accounts.user_id = ? and user_accounts.account_number = ?', [userId, accountId])
                    .then(function (result) {
                        if (result.length > 0) {
                            //  console.log(result);
                            var base64Img = require('base64-img');
                            var imgbase64 = base64Img.base64Sync("public/" + result[0].profile_image);
                            var fName = result[0].first_name ? result[0].first_name : '';
                            var lName = result[0].last_name ? result[0].last_name : '';
                            var uName = result[0].username ? result[0].username : '';
                            var email = result[0].email ? result[0].email : '';
                            var mobile = result[0].mobile ? result[0].mobile : '';
                            var area = result[0].area ? result[0].area : '';
                            var account_name = result[0].account_name ? result[0].account_name : '';
                            var premiseAddress = result[0].premise_address ? result[0].premise_address : '';


                            response['authCode'] = success_code;
                            response['status'] = success_status_value;
                            response['msg'] = data_listed;
                            response['data_params'] = {
                                id: result[0].id, profile_image: imgbase64,
                                username: uName, email: email,
                                mobile: mobile, area: area, account_name: account_name,
                                premise_address: premiseAddress
                            };
                            /*
                               response['data_params']['profile_image'] = result[0].imgbase64;
                             
                               response['data_params']['first_name'] = result[0].first_name;
                               response['data_params']['last_name'] = result[0].last_name;
                               response['data_params']['username'] = result[0].username;
                               response['data_params']['email'] = result[0].email;
                               response['data_params']['mobile'] = result[0].mobile;
                               response['data_params']['area'] = result[0].area;
                            */
                            //imgbase64
                            resolve(response);
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Please fill mandatory fields.";
                reject(response);
            }
        });
    },

    updateProfile: function (req) {

        return new Promise(function (resolve, reject) {

            var userId = req.body.profileToken ? req.body.profileToken : "";
            var mobileNo = req.body.mobile ? req.body.mobile : "";
            var emailId = req.body.email ? req.body.email : "";
            var firstName = req.body.first_name ? req.body.first_name : "";
            var lastName = req.body.last_name ? req.body.last_name : "";
            var area = req.body.area ? req.body.area : "";
            var imgBlob = req.body.imgBlob ? req.body.imgBlob : "";

            var response = {};
            if (utils.str.is_not_empty(userId)) {
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');

                var query = "select id,email,profile_image from users where (id=?)";
                utils.db.executeQuery(query, [userId]).then(function (resultMain) {
                    if (resultMain.length > 0) {
                        var queryForMobileCheck = "select id,mobile from users where (id !=? && mobile =?)";
                        utils.db.executeQuery(queryForMobileCheck, [userId, mobileNo]).then(function (result) {
                            if (result.length > 0) {
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = mobile_is_already_exits;
                                reject(response);
                            } else {
                                //start verify email
                                var queryForMobileCheck = "select id,email,profile_image from users where (id !=? && email =?)";
                                utils.db.executeQuery(queryForMobileCheck, [userId, emailId]).then(function (result) {
                                    if (result.length > 0) {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = email_is_already_exits;
                                        reject(response);
                                    } else {
                                        // console.log(resultMain);
                                        // return;

                                        if (imgBlob != "") {
                                            /*
                                                image save start
                                            **/
                                            var base64ToImage = require('base64-to-image');
                                            var base64Str = imgBlob
                                            var path = 'public/uploads/profile_image/';
                                            var fileName = userId + Date.now();
                                            var optionalObj = { 'fileName': fileName, 'type': 'jpeg' };

                                            var p = new Promise(function (resolve, reject) {
                                                if (base64ToImage(base64Str, path, optionalObj)) {
                                                    // console.log("if");
                                                    // return;
                                                    resolve(1)
                                                } else {
                                                    // console.log("else");
                                                    // return;
                                                    reject(0);
                                                }
                                            });
                                            p.then(function (resultsdata) {
                                                // console.log(resultsdata);
                                                // return;
                                                pathRem = 'public/' + resultMain[0].profile_image;
                                                if (resultMain[0].profile_image != "/uploads/profile_image/default.jpg") {
                                                    console.log(resultMain[0].profile_image);
                                                    fs.unlink(pathRem);
                                                }

                                                var imgBlobForSave = "/uploads/profile_image/" + fileName + "." + optionalObj.type;

                                                var updateData = {
                                                    'first_name': firstName, 'last_name': lastName,
                                                    'email': emailId, 'mobile': mobileNo, 'area': area,
                                                    'profile_image': imgBlobForSave
                                                };

                                                utils.db.executeQuery("UPDATE users set ? WHERE id = ?", [updateData, userId]).
                                                    then(function (result) {
                                                        if (result.affectedRows > 0) {
                                                            response['authCode'] = success_code;
                                                            response['status'] = success_status_value;
                                                            response['msg'] = profileUpdated;
                                                            resolve(response);
                                                        } else {
                                                            response['authCode'] = error_code;
                                                            response['msg'] = database_error;
                                                            response['status'] = failure_status_value;
                                                            reject(response);
                                                        }
                                                    }, function (error) {
                                                        response['authCode'] = error_code;
                                                        response['msg'] = database_error;
                                                        response['status'] = failure_status_value;
                                                        reject(response);
                                                        throw error;

                                                    });
                                            }, function (errorData) {
                                                // console.log(errorData)
                                                response['authCode'] = error_code;
                                                response['msg'] = database_error;
                                                response['status'] = failure_status_value;
                                                reject(response);
                                            });
                                            //  return;
                                            ///image save ends

                                        } else {
                                            var updateData = {
                                                'first_name': firstName, 'last_name': lastName,
                                                'email': emailId, 'mobile': mobileNo, 'area': area
                                            };
                                            utils.db.executeQuery("UPDATE users set ? WHERE id = ?", [updateData, userId]).
                                                then(function (result) {
                                                    if (result.affectedRows > 0) {
                                                        response['authCode'] = success_code;
                                                        response['status'] = success_status_value;
                                                        response['msg'] = profileUpdated;
                                                        resolve(response);
                                                    } else {
                                                        response['authCode'] = error_code;
                                                        response['msg'] = database_error;
                                                        response['status'] = failure_status_value;
                                                        reject(response);
                                                    }
                                                }, function (error) {
                                                    response['authCode'] = error_code;
                                                    response['msg'] = database_error;
                                                    response['status'] = failure_status_value;
                                                    reject(response);
                                                    throw error;

                                                });
                                        }
                                        //update user profile start



                                        /// update user profile ends

                                    }
                                })
                                //end verify mobile
                            }
                        })
                    } else {
                        response['authCode'] = error_code;
                        response['status'] = failure_status_value;
                        response['msg'] = user_is_not_exits;
                        reject(response);
                    }
                }, function (error) {
                    response['authCode'] = error_code;
                    response['msg'] = database_error;
                    response['status'] = failure_status_value;
                    reject(response);
                    throw error;
                });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Please fill mandatory fields.";
                reject(response);
            }
        });
    },


    updateBillingType: function (req) {

        return new Promise(function (resolve, reject) {

            var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.account_id ? req.body.account_id : "";
            var record_id = req.body.record_id ? req.body.record_id : "";
            //    var billType = req.body.billType ? req.body.billType : "";
            var fieldType = req.body.subscribtion_to_update ? req.body.subscribtion_to_update : "";
            var update_value = req.body.update_value ? req.body.update_value : "";


            var response = {};
            if (utils.str.is_not_empty(userId) && utils.str.is_not_empty(accountId)
                && utils.str.is_not_empty(record_id)) {
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                var record_id = Buffer.from(record_id.toString(), 'base64').toString('ascii');
                var accountId = Buffer.from(accountId.toString(), 'base64').toString('ascii');

                var query = "select id from users where (id=?)";
                utils.db.executeQuery(query, [userId]).then(function (result) {
                    if (result.length > 0) {
                        //start verify email
                        var queryForMobileCheck = "select * from user_accounts where id =? && user_id =? && account_number = ?";
                        utils.db.executeQuery(queryForMobileCheck, [record_id, userId, accountId]).then(function (result) {
                            if (result.length > 0) {
                                //update user profile start
                                var updateData = {};
                                if (fieldType == "ebill") {
                                    updateData = {
                                        'ebill': update_value
                                    };
                                } else if (fieldType == "mobile") {
                                    updateData = {
                                        'mobilebill': update_value
                                    };
                                }

                                utils.db.executeQuery("UPDATE user_accounts set ? WHERE id = ?", [updateData, record_id]).
                                    then(function (result) {
                                        if (result.affectedRows > 0) {
                                            response['authCode'] = success_code;
                                            response['status'] = success_status_value;
                                            response['msg'] = updatedMSG;
                                            resolve(response);
                                        } else {
                                            response['authCode'] = error_code;
                                            response['msg'] = database_error;
                                            response['status'] = failure_status_value;
                                            reject(response);
                                        }
                                    }, function (error) {
                                        response['authCode'] = error_code;
                                        response['msg'] = database_error;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                        throw error;

                                    });
                                /// update user profile ends


                            } else {

                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = user_is_not_exits;
                                reject(response);
                            }
                        })


                    } else {
                        response['authCode'] = error_code;
                        response['status'] = failure_status_value;
                        response['msg'] = user_is_not_exits;
                        reject(response);
                    }
                }, function (error) {
                    response['authCode'] = error_code;
                    response['msg'] = database_error;
                    response['status'] = failure_status_value;
                    reject(response);
                    throw error;
                });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Please fill mandatory fields.";
                reject(response);
            }
        });
    },

    removeAccount: function (req) {

        return new Promise(function (resolve, reject) {

            var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.accountToken ? req.body.accountToken : "";

            var response = {};
            if (utils.str.is_not_empty(userId)) {
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                var accountId = Buffer.from(accountId.toString(), 'base64').toString('ascii');

                var query = "select id from users where (id=?)";
                utils.db.executeQuery(query, [userId]).then(function (result) {
                    if (result.length > 0) {

                        //start verify email
                        var queryForMobileCheck = "select id,user_id from user_accounts where id =? && user_id =?";
                        utils.db.executeQuery(queryForMobileCheck, [accountId, userId]).then(function (result) {
                            if (result.length > 0) {
                                utils.db.executeQuery("DELETE from user_accounts WHERE id = ?", [accountId]).
                                    then(function (result) {
                                        if (result.affectedRows > 0) {
                                            response['authCode'] = success_code;
                                            response['status'] = success_status_value;
                                            response['msg'] = removedMSG;
                                            resolve(response);
                                        } else {
                                            response['authCode'] = error_code;
                                            response['msg'] = database_error;
                                            response['status'] = failure_status_value;
                                            reject(response);
                                        }
                                    }, function (error) {
                                        response['authCode'] = error_code;
                                        response['msg'] = database_error;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                        throw error;

                                    });
                                /// update user profile ends


                            } else {

                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = user_is_not_exits;
                                reject(response);
                            }
                        })


                    } else {
                        response['authCode'] = error_code;
                        response['status'] = failure_status_value;
                        response['msg'] = user_is_not_exits;
                        reject(response);
                    }
                }, function (error) {
                    response['authCode'] = error_code;
                    response['msg'] = database_error;
                    response['status'] = failure_status_value;
                    reject(response);
                    throw error;
                });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Please fill mandatory fields.";
                reject(response);
            }
        });
    },



    resetPassword: function (req) {

        return new Promise(function (resolve, reject) {

            var userId = req.body.resetPasswordToken ? req.body.resetPasswordToken : "";
            var password = req.body.password ? req.body.password : "";
            var confirmPassword = req.body.cpassword ? req.body.cpassword : "";

            var response = {};

            if (utils.str.is_not_empty(userId) && utils.str.is_not_empty(password)
                && utils.str.is_not_empty(confirmPassword)) {


                if (password == confirmPassword) {

                    var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');


                    var query = "select id from users where (id=?)";
                    utils.db.executeQuery(query, [userId]).then(function (result) {
                        if (result.length > 0) {
                            var cipher = crypto.createCipher('aes-128-cbc', 'mypassword');
                            var encroptedPassword = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
                            // console.log(req.body.user_name);
                            // return;
                            var updateData = { 'password': encroptedPassword, 'org_password': confirmPassword };

                            utils.db.executeQuery("UPDATE users set ? WHERE id = ?", [updateData, userId]).then(function (result) {
                                if (result.affectedRows > 0) {
                                    response['authCode'] = success_code;
                                    response['status'] = success_status_value;
                                    response['msg'] = "Your password has been reset successfully.";
                                    resolve(response);
                                } else {
                                    response['authCode'] = error_code;
                                    response['msg'] = database_error;
                                    response['status'] = failure_status_value;
                                    reject(response);
                                }
                            }, function (error) {
                                response['authCode'] = error_code;
                                response['msg'] = database_error;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw error;

                            });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    }, function (error) {

                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;

                    });

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = "Your password and confirm password doesn't match.";
                    reject(response);
                }

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Please fill mandatory fields.";
                reject(response);
            }
        });
    },

    // user login and authentication
    authentication: function (req) {
        return new Promise(function (resolve, reject) {


            var user_name = req.body.user_name ? req.body.user_name : "";
            var passwords = req.body.password;
            var response = {};
            if (utils.str.is_not_empty(user_name) && utils.str.is_not_empty(passwords)
            ) {
                utils.db.executeQuery('SELECT id, username,password FROM users WHERE username = ? LIMIT 1', [user_name]).then(function (result) {
                    if (result.length > 0) {
                        // if user found
                        var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
                        var decryptedPassword = mykey.update(passwords, 'utf8', 'hex') + mykey.final('hex');
                        var dbPassword = result[0].password;
                        //  console.log("dbpass" + dbPassword, "decrypPass" + decryptedPassword);
                        if (decryptedPassword == dbPassword) { // if password matched
                            var d = 1;
                            utils.db.executeQuery('SELECT id, user_id,account_number,is_primary FROM  user_accounts WHERE user_id = ? && is_primary = 1',
                                [result[0].id]).then(function (results) {
                                    // console.log(result);
                                    // return;

                                    if (results.length == 1) {
                                        var token = jwt.sign({
                                            userId: result[0].id,
                                            account_type: results[0].user_types, numberOfAccounts: 1,
                                            account_id: results[0].id,
                                            account_name: results[0].account_name,
                                            accountNumber: results[0].account_number,
                                            username: result[0].username
                                        }, process.env.SECRET_KEY, {});//genrating jwt token

                                    } else if (results.length > 1) {
                                        var token = jwt.sign({
                                            userId: result[0].id,
                                            account_type: '', numberOfAccounts: results.length,
                                            account_name: results[0].account_name,
                                            accountNumber: '',
                                            username: result[0].username,
                                        }, process.env.SECRET_KEY, {});//genrating jwt token

                                    } else {
                                        var token = jwt.sign({
                                            userId: result[0].id,
                                            account_type: '', numberOfAccounts: 0,
                                            account_name: "",
                                            accountNumber: '',
                                            username: result[0].username
                                        }, process.env.SECRET_KEY, {});//genrating jwt token
                                    }

                                    /* response['data_params'] = result[0]; */
                                    response['token'] = token;//passsing jwt token
                                    response['authCode'] = success_code;
                                    response['msg'] = user_login_success_msg;
                                    response['status'] = success_status_value;
                                    resolve(response);
                                });
                        } else {//if password not matched.
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_password_not_matched;
                            reject(response);
                        }
                    } else {//user not found
                        response['authCode'] = error_code;
                        response['status'] = failure_status_value;
                        response['msg'] = user_is_not_exits;
                        reject(response);
                    }
                }, function (error) { //if db erro occured
                    response['authCode'] = error_code;
                    response['msg'] = database_error;
                    response['status'] = failure_status_value;
                    reject(response);
                    throw error;
                });
            } else {
                if (!utils.str.is_not_empty(user_name)) {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_user_email;
                    reject(response);
                }
                else if (!utils.str.is_not_empty(password)) {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_user_password;
                    reject(response);
                }
                else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }

            }

        });
    },
    //get user data

    getUserData: function (req) {

        return new Promise(function (resolve, reject) {

            var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
            var passwords = req.body.password;
            //  var device_token = req.body.device_token;
            var response = {};
            if (utils.str.is_not_empty(account_numbersvalue)) {
                utils.db.executeQuery('SELECT id,email,account_number,account_name,address_line1,address_line2,address_line3,address_line4,postal_code,city,state,sanctioned_load,discom_name,meter_id,status FROM users WHERE account_number = ? LIMIT 1', [account_numbersvalue]).
                    then(function (result) {
                        // console.log(a.sql);
                        // fetch user details
                        if (result.length > 0) {


                            // if user found
                            if (result[0].status == 1) { //if account is active

                                //var token = jwt.sign({ id: result[0].id }, process.env.SECRET_KEY, {});//genrating jwt token
                                response['data_params'] = result[0];
                                //  response['token'] = token;//passsing jwt token
                                response['authCode'] = success_code;
                                response['msg'] = data_listed;
                                response['status'] = success_status_value;
                                resolve(response);

                            } else {
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = user_account_is_not_active;
                                reject(response);
                            }

                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */
            } else {
                if (!utils.str.is_not_empty(account_numbersvalue)) {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_user_email;
                    reject(response);
                }
                if (!utils.str.is_not_empty(password)) {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_user_password;
                    reject(response);
                }
                if (!utils.str.is_not_empty(device_token)) {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_device_token;
                    reject(response);
                }
            }
        });
    },

    manageAccountList: function (req) {

        return new Promise(function (resolve, reject) {

            var userId = req.body.profileToken ? req.body.profileToken : "";
            var searchKeyWord = req.body.searchKeyWord ? req.body.searchKeyWord : "";

            //  var device_token = req.body.device_token;
            var response = {};
            if (utils.str.is_not_empty(userId)) {
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery('SELECT id,user_id,account_number,account_name,billing_address,billing_amount,billing_due_date,ebill,mobilebill,account_type,status,is_primary FROM user_accounts WHERE user_id = ? AND (account_number LIKE  ? "%" OR account_name LIKE  ? "%") ORDER BY id DESC', [userId, searchKeyWord, searchKeyWord]).
                    then(function (result) {
                        //   console.log('this.sql', this.sql); 
                        // console.log(a.sql);
                        // fetch user details
                        if (result.length > 0) {
                            //var token = jwt.sign({ id: result[0].id }, process.env.SECRET_KEY, {});//genrating jwt token
                            response['data_params'] = result;
                            //  response['token'] = token;//passsing jwt token
                            response['authCode'] = success_code;
                            response['msg'] = data_listed;
                            response['status'] = success_status_value;
                            resolve(response);
                        } else {

                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = "Data not found.";
                            reject(response);
                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    //account details
    accountDetails: function (req) {

        return new Promise(function (resolve, reject) {

            var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.accountToken ? req.body.accountToken : "";

            //  var device_token = req.body.device_token;
            var response = {};
            if (utils.str.is_not_empty(userId)) {
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                var accountId = Buffer.from(accountId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery(
                    'SELECT users.id as profileId,users.mobile,users.first_name,users.last_name,users.username,users.email,users.area,user_accounts.id,user_accounts.user_id,user_accounts.account_number,user_accounts.account_name,user_accounts.billing_address,user_accounts.billing_amount,user_accounts.billing_due_date,user_accounts.ebill,user_accounts.mobilebill,account_type,user_accounts.status,user_accounts.premise_address,user_accounts.sanctioned_load,user_accounts.supply_type,user_accounts.division,user_accounts.subdivision,user_accounts.bill_route,user_accounts.current_load,user_accounts.load_extension_charges,user_accounts.security_fee,user_accounts.is_net_metering,discom	 FROM user_accounts JOIN users ON user_accounts.user_id = users.id WHERE user_accounts.user_id = ? and user_accounts.account_number = ?', [userId, accountId]).
                    then(function (result) {
                        // console.log(a.sql);
                        // fetch user details
                        if (result.length > 0) {
                            response['data_params'] = result[0];
                            //   response['data_params']['consumptionDetails'] = rVal;
                            response['authCode'] = success_code;
                            response['msg'] = data_listed;
                            response['status'] = success_status_value;
                            resolve(response);
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = "Account details not found.";
                            reject(response);
                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    // question List
    questionList: function (req) {

        // console.log("amanaya");
        // return;

        return new Promise(function (resolve, reject) {

            var types = req.body.types ? req.body.types : '';

            var response = {};
            if (utils.str.is_not_empty(types)) {
                var statuss = 1;

                utils.db.executeQuery('SELECT id,questions,status,types FROM questions WHERE (status = ? and types = ?)', [statuss, types]).
                    then(function (result) {

                        // fetch user details
                        if (result.length > 0) {
                            response['data_params'] = result;
                            //  response['token'] = token;//passsing jwt token
                            response['authCode'] = success_code;
                            response['msg'] = data_listed;
                            response['status'] = success_status_value;
                            resolve(response);
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = "Data not found.";
                            reject(response);
                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Please fill required parameters.";
                reject(response);
            }
        });
    },
    //end user data
    //forgot password.
    forgotPassword: function (req) {
        return new Promise(function (resolve, reject) {
            // if(req.body.email && req.body.email)
            var d1 = new Date(),
                d2 = new Date(d1);
            d2.setMinutes(d1.getMinutes() + 10);
            var email = req.body.email ? req.body.email : '';

            var response = {};
            if (utils.str.is_not_empty(email)) // if email is not empty
            {
                utils.db.executeQuery('SELECT * FROM users WHERE email = ? || username =? || mobile = ? LIMIT 1', [email, email, email]).then(function (result) { // fetch user details
                    if (result.length > 0) {
                        // console.log(result[0].email);
                        // return;
                        var email = result[0].email;
                        // if user found
                        var filename = 'forgotpassword.ejs'; // forgot password email template
                        var otp = Math.floor(1000 + Math.random() * 999999);
                        var data = { otp: otp }
                        var mailOptions = {};
                        mailOptions['to'] = email;
                        mailOptions['subject'] = 'Forgot Password Request';
                        mailOptions['from'] = '"UPPCL " <user1.guts@gmail.com>';
                        utils.notify.sendNotification("email", filename, mailOptions, data).
                            then(function (resp) { // notify user
                                var updateData = { 'otp': otp, 'otp_time': d2 };

                                utils.db.executeQuery("UPDATE users set ? WHERE id = ?",
                                    [updateData, result[0].id]).then(function (updResponse) { // update opt user table
                                        // let data = result[0].id;
                                        // let buff = new Buffer(data);
                                        let base64data = Buffer.from(result[0].id.toString()).toString('base64');
                                        // console.log('"' + data + '" converted to Base64 is "' + base64data + '"');
                                        // return;
                                        response['data_params'] = { 'id': base64data };
                                        response['authCode'] = success_code;
                                        response['msg'] = otp_sent_msg;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    }, function (error) { // if database errors
                                        response['authCode'] = error_code;
                                        response['msg'] = database_error;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                        throw error;
                                    });
                            }, function (err) {// if send notification error.
                                response['authCode'] = error_code;
                                response['msg'] = otp_sent_error_msg;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw err;
                            });
                    } else {//if user not found
                        response['authCode'] = error_code;
                        response['status'] = failure_status_value;
                        response['msg'] = user_is_not_exits;
                        reject(response);
                    }
                }, function (error) {// if database error
                    response['authCode'] = error_code;
                    response['msg'] = database_error;
                    response['status'] = failure_status_value;
                    reject(response);
                    throw error;
                });
            } else {
                if (!utils.str.is_not_empty(email))//if email is empty
                {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = "Please enter username or email or mobile.";
                    reject(response);
                }
            }
        });
    },
    otpVerify: function (req) {
        return new Promise(function (resolve, reject) {
            // if(req.body.email && req.body.email)
            var verifyOtp = req.body.verifyOtp ? req.body.verifyOtp : '';
            var userId = req.body.otpVerifyToken ? req.body.otpVerifyToken : '';

            var response = {};
            if (utils.str.is_not_empty(verifyOtp) && utils.str.is_not_empty(userId)) // if email is not empty
            {

                //var b64string = "aman" /* whatever */;
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                // console.log(verifyOtp);
                // let buff = new Buffer(userId, 'base64');
                // console.log(Buffer.from("Hello World").toString('base64'))
                // console.log(Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))
                // console.log("============>");
                // console.log(userIds);
                // console.log("<<<<<<<<<============>");
                // return;

                utils.db.executeQuery('SELECT id,otp,otp_time FROM users WHERE id = ? && otp =?  LIMIT 1',
                    [userId, verifyOtp]).then(function (result) { // fetch user details
                        // console.log(result);
                        if (result.length > 0) {
                            var d1 = new Date(),
                                d2 = new Date(d1);
                            // response['datecurrent'] = d2;
                            // response['dateindb'] = result[0].otp_time;

                            if (d2 <= result[0].otp_time) {
                                response['data_params'] = [];
                                response['authCode'] = success_code;
                                response['msg'] = "OTP successfully verified.";
                                response['status'] = success_status_value;
                                resolve(response);
                            } else {//if user not found
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = "You are too late please try again later.";
                                reject(response);
                            }


                        } else {//if user not found
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = "Your otp doesn't match.";
                            reject(response);
                        }
                    }, function (error) {// if database error
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    otpVerifyRegistration: function (req) {
        return new Promise(function (resolve, reject) {
            // if(req.body.email && req.body.email)
            var verifyOtp = req.body.verifyOtp ? req.body.verifyOtp : '';
            var accountNumber = req.body.otpAccountNumber ? req.body.otpAccountNumber : '';

            var response = {};
            if (utils.str.is_not_empty(verifyOtp) && utils.str.is_not_empty(accountNumber)) // if email is not empty
            {
                utils.db.executeQuery('SELECT id,otp,otp_time,account_number FROM account_otp_verification WHERE account_number = ? && otp =? ORDER BY id ASC  LIMIT 1',
                    [accountNumber, verifyOtp]).then(function (result) { // fetch user details
                        // console.log(result);
                        if (result.length > 0) {
                            var d1 = new Date(),
                                d2 = new Date(d1);
                            // response['datecurrent'] = d2;
                            // response['dateindb'] = result[0].otp_time;

                            if (d2 <= result[0].otp_time) {
                                response['data_params'] = [];
                                response['authCode'] = success_code;
                                response['msg'] = "OTP successfully verified.";
                                response['status'] = success_status_value;
                                resolve(response);
                            } else {//if user not found
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = "You are too late please try again later.";
                                reject(response);
                            }


                        } else {//if user not found
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = "Your otp doesn't match.";
                            reject(response);
                        }
                    }, function (error) {// if database error
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    csvImportdata: function (req) {
        return new Promise((resolve, reject) => {
            var response = {};
            const request = require('request')
            const csv = require('csvtojson');

            csv().fromStream(request.get('http://192.168.1.2/html_team/lti-blue/UPPCL_Daily_Consumption_Data_00000000240000000001000002018-10-06-12.52.23.csv'))

                .subscribe((json) => {

                    // console.log(json);
                    //   console.log(json.AccountNumber);
                    // return;  
                    if (typeof json === 'object' && json.AccountNumber != "") {
                        // console.log("aa gya h");
                        // return;
                        var consumptions = new Consumption({
                            accountNumber: json.AccountNumber,
                            dates: json.Dates,
                            meterBadgeNumber: json.MeterBadgeNumber,
                            // meterBadgeNumber: json.MeterBadgeNumber,
                            meterSeriolNumber: json.MeterSerialNumber,
                            readKWH: json.ReadInKWH,
                            amount: json.Amount,
                            recordGeneratedTimestamp: json.MeterBadgeNumber,
                        });
                        //    console.log(json);
                        //    return;

                        consumptions.save(
                            function (err, rrr) {
                                if (err) {
                                    response['authCode'] = error_code;
                                    response['msg'] = "Data fetching problems.";
                                    response['status'] = failure_status_value;
                                    reject(response);
                                    // throw error;
                                    //resolve(response);
                                }
                                else if (rrr) {
                                    //console.log("aa gya h2");
                                    //console.log(json);
                                    response['data_params'] = [];
                                    response['authCode'] = success_code;
                                    response['msg'] = "Successfully uploaded";
                                    response['status'] = success_status_value;
                                    resolve(1);
                                } else {
                                    //console.log("aa gya h3");
                                    //console.log("stuckss");
                                    response['data_params'] = [];
                                    response['authCode'] = success_code;
                                    response['msg'] = "Successfully uploaded";
                                    response['status'] = success_status_value;
                                    resolve(1);
                                }

                            });
                    } else {
                        // console.log("aa gya h4");
                        response['authCode'] = error_code;
                        response['msg'] = "Data fetching problems.";
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;

                    }

                    //reject(1);
                    // long operation for each json e.g. transform / write into database.
                }, (errorOn) => {
                    //   console.log("aa gya h5");
                    response['authCode'] = error_code;
                    response['msg'] = "Problem from uploading csv.";
                    response['status'] = failure_status_value;
                    reject(response);
                    // throw error;

                }, (onCompleted) => {
                    //  console.log("aa gya h6");
                    response['data_params'] = [];
                    response['authCode'] = success_code;
                    response['msg'] = "Successfully uploaded";
                    response['status'] = success_status_value;
                    resolve(response);

                })
        }, function (er, r) {
            if (er) {
                //console.log("aa gya h7");
                response['authCode'] = error_code;
                response['msg'] = er;
                response['status'] = failure_status_value;
                reject(response);
                throw error;

            } else {
                //  console.log("aa gya ");
                response['data_params'] = [];
                response['authCode'] = success_code;
                response['msg'] = "Successfully uploaded";
                response['status'] = success_status_value;
                resolve(response);

            }

        });
    },
    csvImportdataClient: function (req) {
        return new Promise((resolve, reject) => {
            var response = {};
            const request = require('request')

            const csv = require('csv-parser')
            const fs = require('fs')
            // const csv = require('csvtojson');
            var parse = require('csv-parse');

            // var inputFile = './public/csv/cc.csv';
            //var inputFile = './public/csv/interval/2018-10-12-15.42.18.csv';
            var inputFile = './public/csv/vpn/intervaldata.csv';


            if (fs.existsSync(inputFile)) {
                // Do something
                var resultdata = [];


                fs.createReadStream(inputFile)
                    .pipe(csv(['AccountNumber', 'Dates', 'MeterBadgeNumber', 'MeterSerialNumber', 'ReadInKWH',
                        'RecordGeneratedTimestamp', 'timeStamps']))
                    .on('data', function (e, errr) {


                        var json = e;
                        if (typeof json === 'object' && json.AccountNumber != "") {
                            //var moment = require('moment');
                            //   var jsonD = moment().format(json.Dates);

                            var dateFormat = require('dateformat');


                            // var current_date = dateFormat(c_date, "yyyy-mm-dd hh:mm:s");

                            var dateFields = moment(json.Dates, 'YYYY-MM-DD-HH.mm.ss').format('YYYY-MM-DD HH:mm:ss:sss');

                            var now = new Date();

                            Consumption.find({ dates: dateFields }, function (e10, dataval) {
                                if (dataval && dataval.length) {
                                    resolve(1);
                                } else {
                                    var consumptions = new Consumption({
                                        accountNumber: json.AccountNumber,
                                        dates: dateFields,
                                        meterBadgeNumber: json.MeterBadgeNumber,
                                        // meterBadgeNumber: json.MeterBadgeNumber,
                                        meterSeriolNumber: json.MeterSerialNumber,
                                        readKWH: json.ReadInKWH,
                                        amount: json.Amount,
                                        recordGeneratedTimestamp: json.IsoDateTo,
                                        timeStamps: json.timeStamps,
                                        offset: now.getTimezoneOffset()
                                    });


                                    consumptions.save(
                                        function (err, rrr) {
                                            if (err) {
                                                response['authCode'] = err;
                                                response['msg'] = "Data fetching problems.";
                                                response['status'] = failure_status_value;
                                                reject(response);
                                            }
                                            else if (rrr) {
                                                //console.log("aa gya h2");
                                                //console.log(json);
                                                response['data_params'] = [];
                                                response['authCode'] = success_code;
                                                response['msg'] = "Successfully uploaded";
                                                response['status'] = success_status_value;
                                                resolve(1);
                                            } else {
                                                //console.log("aa gya h3");
                                                //console.log("stuckss");
                                                response['data_params'] = [];
                                                response['authCode'] = success_code;
                                                response['msg'] = "Successfully uploaded";
                                                response['status'] = success_status_value;
                                                resolve(1);
                                            }

                                        });

                                }
                            })


                        } else {
                            // console.log("aa gya h4");
                            response['authCode'] = error_code;
                            response['msg'] = "Data fetching problems.";
                            response['status'] = failure_status_value;
                            reject(response);
                            // throw errr;

                        }
                        //  console.log(errr);
                    })
                    .on('end', (e, r) => {
                        // console.log("adsds");
                        //   console.loga(e);
                        //   console.log(r);
                        //   return
                        response['data_params'] = [];
                        response['authCode'] = success_code;
                        response['msg'] = "Successfully uploaded";
                        response['status'] = success_status_value;

                        fs.unlink(inputFile, (err) => {
                            if (err) throw err;
                            console.log(inputFile);
                        });

                        resolve(response);
                    });
            } else {
                response['authCode'] = error_code;
                response['msg'] = "File not found.";
                response['status'] = failure_status_value;
                reject(response);
            }
            ///  return;



            /*   return;
 
 
             csv().fromStream(request.get('http://192.168.1.2/html_team/lti-blue/UPPCL_Daily_Consumption_Data_00000000240000000001000002018-10-06-12.52.23.csv'))
 
                 .subscribe((json) => {
 
 
 
 
                     console.log(json);
                     //  console.log(json.AccountNumber);
                     return;
                     if (typeof json === 'object' && json.AccountNumber != "") {
                         // console.log("aa gya h");
                         // return;
                         var consumptions = new Consumption({
                             accountNumber: json.AccountNumber,
                             dates: json.Dates,
                             meterBadgeNumber: json.MeterBadgeNumber,
                             // meterBadgeNumber: json.MeterBadgeNumber,
                             meterSeriolNumber: json.MeterSerialNumber,
                             readKWH: json.ReadInKWH,
                             amount: json.Amount,
                             recordGeneratedTimestamp: json.MeterBadgeNumber,
                         });
                         //    console.log(json);
                         //    return;
 
                         consumptions.save(
                             function (err, rrr) {
                                 if (err) {
                                     response['authCode'] = error_code;
                                     response['msg'] = "Data fetching problems.";
                                     response['status'] = failure_status_value;
                                     reject(response);
                                     // throw error;
                                     //resolve(response);
                                 }
                                 else if (rrr) {
                                     //console.log("aa gya h2");
                                     //console.log(json);
                                     response['data_params'] = [];
                                     response['authCode'] = success_code;
                                     response['msg'] = "Successfully uploaded";
                                     response['status'] = success_status_value;
                                     resolve(1);
                                 } else {
                                     //console.log("aa gya h3");
                                     //console.log("stuckss");
                                     response['data_params'] = [];
                                     response['authCode'] = success_code;
                                     response['msg'] = "Successfully uploaded";
                                     response['status'] = success_status_value;
                                     resolve(1);
                                 }
 
                             });
                     } else {
                         // console.log("aa gya h4");
                         response['authCode'] = error_code;
                         response['msg'] = "Data fetching problems.";
                         response['status'] = failure_status_value;
                         reject(response);
                         throw error;
 
                     }
 
                     //reject(1);
                     // long operation for each json e.g. transform / write into database.
                 }, (errorOn) => {
                     //   console.log("aa gya h5");
                     response['authCode'] = error_code;
                     response['msg'] = "Problem from uploading csv.";
                     response['status'] = failure_status_value;
                     reject(response);
                     // throw error;
 
                 }, (onCompleted) => {
                     //  console.log("aa gya h6");
                     response['data_params'] = [];
                     response['authCode'] = success_code;
                     response['msg'] = "Successfully uploaded";
                     response['status'] = success_status_value;
                     resolve(response);
 
                 })*/
        }, function (er, r) {
            if (er) {
                //console.log("aa gya h7");
                response['authCode'] = error_code;
                response['msg'] = er;
                response['status'] = failure_status_value;
                reject(response);
                throw er;

            } else {
                //  console.log("aa gya ");
                response['data_params'] = [];
                response['authCode'] = success_code;
                response['msg'] = "Successfully uploaded";
                response['status'] = success_status_value;
                resolve(response);

            }

        });
    },

    csvImportdataClientScalar: function (req) {
        return new Promise((resolve, reject) => {
            var response = {};
            const request = require('request')
            // const csv = require('csvtojson');
            var parse = require('csv-parse');

            // var inputFile = './public/csv/cc.csv';
            var inputFile = './public/csv/scalar/2018-10-15-17.40.24.csv';

            const csv = require('csv-parser')
            const fs = require('fs')
            var resultdata = [];

            fs.createReadStream(inputFile)
                .pipe(csv(['AccountNumber', 'Dates', 'MeterBadgeNumber', 'MeterSerialNumber', 'ReadInKWH',
                    'RecordGeneratedTimestamp', 'timeStamps']))
                .on('data', function (e, errr) {

                    //  console.log(e);
                    //  return;
                    var json = e;
                    if (typeof json === 'object' && json.AccountNumber != "") {
                        //var moment = require('moment');
                        //   var jsonD = moment().format(json.Dates);

                        var dateFormat = require('dateformat');


                        // var current_date = dateFormat(c_date, "yyyy-mm-dd hh:mm:s");

                        var dateFields = moment(json.Dates, 'YYYY-MM-DD-HH.mm.ss').format('YYYY-MM-DD HH:mm:ss:sss');
                        const IsoDateTo = moment(json.RecordGeneratedTimestamp, 'YYYY-MM-DD-HH.mm.ss').format('YYYY-MM-DD[T]HH:mm:ss');
                        //2018-10-11-00.15.00
                        //var c_date=new Date();
                        //;

                        //var current_dateVal = dateFormat(dateFields, "isoDateTime");
                        ///  console.log(current_dates);
                        //  console.log(dateFields);
                        // console.log(dateFields.toString());
                        ////    var date = new Date(json.Dates).toDateString("yyyy-MM-dd");
                        //  console.log(dateFields);
                        //  console.log(date);
                        // return;
                        var datess = new Date(dateFields);
                        // console.log(datess);
                        var now = new Date();

                        // dateFields =  datess.toDateString()
                        var consumptionScalars = new ConsumptionScalar({
                            accountNumber: json.AccountNumber,
                            dates: dateFields,
                            meterBadgeNumber: json.MeterBadgeNumber,
                            // meterBadgeNumber: json.MeterBadgeNumber,
                            meterSeriolNumber: json.MeterSerialNumber,
                            readKWH: json.ReadInKWH,
                            amount: json.Amount,
                            recordGeneratedTimestamp: json.IsoDateTo,
                            timeStamps: json.timeStamps,
                            offset: now.getTimezoneOffset()
                        });
                        // var utcDate = moment.toDate();


                        //  console.log(datess.getTimezoneOffset());
                        // console.log(utcDate);
                        //    console.log(consumptionScalars);
                        //     return;




                        consumptionScalars.save(
                            function (err, rrr) {
                                if (err) {
                                    response['authCode'] = err;
                                    response['msg'] = "Data fetching problems.";
                                    response['status'] = failure_status_value;
                                    reject(response);
                                    // throw error;
                                    //resolve(response);
                                }
                                else if (rrr) {
                                    //console.log("aa gya h2");
                                    //console.log(json);
                                    response['data_params'] = [];
                                    response['authCode'] = success_code;
                                    response['msg'] = "Successfully uploaded";
                                    response['status'] = success_status_value;
                                    resolve(1);
                                } else {
                                    //console.log("aa gya h3");
                                    //console.log("stuckss");
                                    response['data_params'] = [];
                                    response['authCode'] = success_code;
                                    response['msg'] = "Successfully uploaded";
                                    response['status'] = success_status_value;
                                    resolve(1);
                                }

                            });
                    } else {
                        // console.log("aa gya h4");
                        response['authCode'] = error_code;
                        response['msg'] = "Data fetching problems.";
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;

                    }
                    //  console.log(errr);
                })
                .on('end', (e, r) => {
                    //   console.log(e);
                    //   console.log(r);
                    //   return
                    response['data_params'] = [];
                    response['authCode'] = success_code;
                    response['msg'] = "Successfully uploaded";
                    response['status'] = success_status_value;
                    resolve(response);
                });

        }, function (er, r) {
            if (er) {
                //console.log("aa gya h7");
                response['authCode'] = error_code;
                response['msg'] = er;
                response['status'] = failure_status_value;
                reject(response);
                throw error;

            } else {
                //  console.log("aa gya ");
                response['data_params'] = [];
                response['authCode'] = success_code;
                response['msg'] = "Successfully uploaded";
                response['status'] = success_status_value;
                resolve(response);

            }

        });
    },
    //CSV import demo
    csvImportClientScalarDemo: function (req) {
        return new Promise((resolve, reject) => {
            // console.log("aa");
            // return;
            var response = {};
            const request = require('request')
            // const csv = require('csvtojson');
            var parse = require('csv-parse');

            // var inputFile = './public/csv/cc.csv';
            var inputFile = './public/csv/scalar/2018-10-15-17.40.24.csv';

            const csv = require('csv-parser')
            const fs = require('fs')
            var resultdata = [];
            var json = [];
            fs.createReadStream(inputFile)
                .pipe(csv(['AccountNumber', 'Dates', 'MeterBadgeNumber', 'MeterSerialNumber', 'ReadInKWH',
                    'RecordGeneratedTimestamp', 'timeStamps']))
                .on('data', function (e, err) {

                    //  console.log(e);
                    //  return;

                    //  json = e;
                    json.push(e);

                    if (err) {
                        response['authCode'] = err;
                        response['msg'] = "Data fetching problems.";
                        response['status'] = failure_status_value;
                        reject(response);
                        // throw error;
                        //resolve(response);
                    }
                    else if (json) {
                        //console.log("aa gya h2");
                        //console.log(json);
                        response['data_params'] = json;
                        response['authCode'] = success_code;
                        response['msg'] = "Successfully listed";
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        //console.log("aa gya h3");
                        //console.log("stuckss");
                        response['data_params'] = [];
                        response['authCode'] = success_code;
                        response['msg'] = "Successfully listed";
                        response['status'] = success_status_value;
                        resolve(response);
                    }
                    //  console.log(errr);
                })
                .on('end', (e, r) => {
                    //   console.log(e);
                    //   console.log(json);
                    //   return
                    response['data_params'] = [];
                    response['authCode'] = success_code;
                    response['msg'] = "Successfully uploaded";
                    response['status'] = success_status_value;
                    resolve(response);
                });

        }, function (er, r) {
            if (er) {
                //console.log("aa gya h7");
                response['authCode'] = error_code;
                response['msg'] = er;
                response['status'] = failure_status_value;
                reject(response);
                throw error;

            } else {
                //  console.log("aa gya ");
                response['data_params'] = [];
                response['authCode'] = success_code;
                response['msg'] = "Successfully uploaded";
                response['status'] = success_status_value;
                resolve(response);

            }

        });
    },
    //24 hours csv
    csvImportDataPerHour: function (req) {
        return new Promise((resolve, reject) => {
            var response = {};
            const request = require('request')
            const csv = require('csvtojson');

            csv().fromStream(request.get('http://192.168.1.2/html_team/lti-blue/importfullday.csv'))

                .subscribe((json) => {

                    // console.log(json);
                    // console.log(json.RecordTiming);
                    // return;  

                    if (typeof json === 'object' && json.AccountNumber != "") {
                        // console.log("aa gya h");
                        // return;
                        var consumptionHours = new ConsumptionHour({
                            accountNumber: json.AccountNumber,
                            dates: json.Dates,

                            readKWH: json.ReadInKWH,
                            amount: json.Amount,

                            //recordTiming: new Date(json.Dates+" "+json.RecordTiming),
                            recordTiming: json.RecordTiming,
                        });
                        console.log(consumptionHours);
                        return;

                        consumptionHours.save(
                            function (err, rrr) {
                                if (err) {
                                    response['authCode'] = error_code;
                                    response['msg'] = err;
                                    response['status'] = failure_status_value;
                                    reject(response);
                                    // throw error;
                                    //resolve(response);
                                }
                                else if (rrr) {
                                    //console.log("aa gya h2");
                                    //console.log(json);
                                    response['data_params'] = [];
                                    response['authCode'] = success_code;
                                    response['msg'] = "Successfully uploaded";
                                    response['status'] = success_status_value;
                                    resolve(1);
                                } else {
                                    //console.log("aa gya h3");
                                    //console.log("stuckss");
                                    response['data_params'] = [];
                                    response['authCode'] = success_code;
                                    response['msg'] = "Successfully uploaded";
                                    response['status'] = success_status_value;
                                    resolve(1);
                                }

                            });
                    } else {
                        // console.log("aa gya h4");
                        response['authCode'] = error_code;
                        response['msg'] = "Data fetching problems.";
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;

                    }

                    //reject(1);
                    // long operation for each json e.g. transform / write into database.
                }, (errorOn) => {
                    //   console.log("aa gya h5");
                    response['authCode'] = error_code;
                    response['msg'] = "Problem from uploading csv.";
                    response['status'] = failure_status_value;
                    reject(response);
                    // throw error;

                }, (onCompleted) => {
                    //  console.log("aa gya h6");
                    response['data_params'] = [];
                    response['authCode'] = success_code;
                    response['msg'] = "Successfully uploaded";
                    response['status'] = success_status_value;
                    resolve(response);

                })
        }, function (er, r) {
            if (er) {
                //console.log("aa gya h7");
                response['authCode'] = error_code;
                response['msg'] = er;
                response['status'] = failure_status_value;
                reject(response);
                throw error;

            } else {
                //  console.log("aa gya ");
                response['data_params'] = [];
                response['authCode'] = success_code;
                response['msg'] = "Successfully uploaded";
                response['status'] = success_status_value;
                resolve(response);

            }

        });
    },

    //end 24 hours csv
    //parse .dat files
    datParser: function (req) {
        return new Promise(function (resovle, reject) {
            var datfile = require('robloach-datfile')
            /*   datfile.parseFile('http://192.168.1.2/html_team/lti-blue/lti.DAT').then(function (database) {
               // console.log("hi");    
               // console.log(database);
               // console.log("hi1");    
               })*/
        });
    },
    //end parsing .dat files

    //show data 24 hours
    dailyData: function (req) {

        return new Promise(function (resolve, reject) {
            // console.log(req.body);
            var account_numbersvalue = req.body.account_number ? req.body.account_number : "";

            var response = {};
            if (utils.str.is_not_empty(account_numbersvalue)) {

                var today = new Date();
                var months = req.body.months ? Number(req.body.months) - 1 : "";
                var dates = req.body.dates ? Number(req.body.dates) + 1 : "";


                // var curM = today.getMonth() + 1;
                var curM = req.body.months ? Number(req.body.months) : "";


                async.parallel([
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 00:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 01:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gte: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e1, r1) {
                            if (r1 && r1.length) {
                                callback(null, r1);
                            } else {
                                callback(null, []);
                            }
                        })

                    },
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 01:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 02:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e2, r2) {
                            if (r2 && r2.length) {
                                callback(null, r2);
                            } else {
                                callback(null, []);
                            }
                        })


                    },
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 02:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 03:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e3, r3) {
                            if (r3 && r3.length) {
                                callback(null, r3);
                            } else {
                                callback(null, []);
                            }

                        })
                    },
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 03:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 04:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e4, r4) {
                            if (r4 && r4.length) {
                                callback(null, r4);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 04:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 05:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e5, r5) {
                            if (r5 && r5.length) {
                                callback(null, r5);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 05:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 06:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e6, r6) {
                            if (r6 && r6.length) {
                                callback(null, r6);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 06:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 07:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e7, r7) {
                            if (r7 && r7.length) {
                                callback(null, r7);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 07:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 08:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e8, r8) {
                            if (r8 && r8.length) {
                                callback(null, r8);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 08:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 09:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e9, r9) {
                            if (r9 && r9.length) {
                                callback(null, r9);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 09:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 10:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e10, r10) {
                            if (r10 && r10.length) {
                                callback(null, r10);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 10:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 11:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e11, r11) {
                            if (r11 && r11.length) {
                                callback(null, r11);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 11:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 12:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e12, r12) {
                            if (r12 && r12.length) {
                                callback(null, r12);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 12:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 13:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e113, r13) {
                            if (r13 && r13.length) {
                                callback(null, r13);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 13:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 14:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e14, r14) {
                            if (r14 && r14.length) {
                                callback(null, r14);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 14:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 15:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e15, r15) {
                            if (r15 && r15.length) {
                                callback(null, r15);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 15:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 16:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e15, r15) {
                            if (r15 && r15.length) {
                                callback(null, r15);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 16:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 17:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e16, r16) {
                            if (r16 && r16.length) {
                                callback(null, r16);
                            } else {
                                callback(null, []);
                            }

                        })
                    },
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 17:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 18:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e17, r17) {
                            if (r17 && r17.length) {
                                callback(null, r17);
                            } else {
                                callback(null, []);
                            }

                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 18:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 19:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e18, r18) {
                            if (r18 && r18.length) {
                                callback(null, r18);
                            } else {
                                callback(null, []);
                            }
                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 19:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 20:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e19, r19) {
                            if (r19 && r19.length) {
                                callback(null, r19);
                            } else {
                                callback(null, []);
                            }
                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 20:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 21:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e20, r20) {
                            if (r20 && r20.length) {
                                callback(null, r20);
                            } else {
                                callback(null, []);
                            }
                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 21:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 22:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e21, r21) {
                            if (r21 && r21.length) {
                                callback(null, r21);
                            } else {
                                callback(null, []);
                            }
                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 22:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 23:00:00.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e22, r22) {
                            if (r22 && r22.length) {
                                callback(null, r22);
                            } else {
                                callback(null, []);
                            }
                        })
                    }
                    ,
                    function (callback) {
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 23:00:00.000";
                        var toDay = today.getFullYear() + '-' + curM + '-' + (dates - 1) + " 23:59:59.000";
                        Consumption.aggregate([
                            {
                                $match: {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $gt: new Date(yesterDay),
                                        $lte: new Date(toDay)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "$dayOfMonth": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    readKWH: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }


                        ], function (e23, r23) {
                            if (r23 && r23.length) {
                                callback(null, r23);
                            } else {
                                callback(null, []);
                            }
                        })
                    }
                ],
                    // optional callback
                    function (err, results) {
                        // the results array will equal ['one','two'] even though
                        // the second function had a shorter timeout.
                        //
                        //                  console.log(results);
                        var dataRet = [];
                        for (var i = 0; i <= 23; i++) {
                            dataRet[i] = results[i] && results[i].length ? { _id: i, readKWH: results[i][0].readKWH } : { _id: i, readKWH: 0 };
                        }

                        response['data_params'] = dataRet;
                        response['authCode'] = success_code;
                        response['msg'] = "Data listed.";
                        response['status'] = success_status_value;
                        resolve(response);
                    });
            } else {
                response['data_params'] = [];
                response['authCode'] = error_code;
                response['msg'] = "Please fill required parameters.";
                response['status'] = failure_status_value;
                resolve(response);

            }
        });
    },
    //end show data 24 hours


    getConsumptionDataAmountYearly: function (req) {

        return new Promise(function (resolve, reject) {

            var reqType = req.body.reqType ? req.body.reqType : "";
            // console.log(req.body);

            if (reqType == 1) {
                var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
                var response = {};
                if (utils.str.is_not_empty(account_numbersvalue)) {

                    Consumption.aggregate(
                        [
                            {
                                $match: {
                                    accountNumber: account_numbersvalue
                                },
                            },
                            {
                                $group: {
                                    // _id: { month: { $month: "$bookingdatetime" },
                                    _id: { $month: "$dates" },
                                    // $month: ['$dates', 5, 2]}, 
                                    numberofbookings: { $sum: "$readKWH" }
                                }
                            }
                        ],
                        function (err, res) {
                            if (res && res.length > 0) {

                                //  console.log(res);
                                var string1 = [];
                                var monthsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                                for (var i = 1; i <= 12; i++) {
                                    var flag = 0;
                                    res.forEach(function (element) {
                                        var p = parseInt(element._id);
                                        if (i === p) {
                                            flag = 2;
                                            string1.push(element);
                                            return;

                                        } else {
                                            if (flag == 0) {
                                                flag = 1;
                                            }
                                        }
                                    });
                                    if (flag == 1) {
                                        string1.push({ '_id': i, numberofbookings: 0 });
                                    }
                                }
                                // console.log(string1);
                                /**/
                                response['data_params'] = string1;
                                response['authCode'] = success_code;
                                response['msg'] = "Successfully listed data.";
                                response['status'] = success_status_value;
                                resolve(response);
                            } else if (err) {
                                response['authCode'] = error_code;
                                response['msg'] = err;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw err;
                            }
                            else {
                                response['data_params'] = res;
                                response['authCode'] = error_code;
                                response['msg'] = "No data found.";
                                response['status'] = failure_status_value;
                                resolve(response);
                            }

                        });
                }

            } else if (reqType == 2) {
                // return;
                var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
                var months = req.body.months ? req.body.months : "";
                var response = {};

                if (utils.str.is_not_empty(account_numbersvalue) && utils.str.is_not_empty(account_numbersvalue)) {

                    // July
                    // var dayInM = utils.notify.daysInMonth(7, 2009);
                    // console.log(dayInM);
                    // return;
                    const month = Number(months);
                    var currentTime = new Date()
                    var year = currentTime.getFullYear();
                    const fromDates = new Date(currentTime.getFullYear(), month - 1, 1);
                    const toDate = new Date(currentTime.getFullYear(), month, 0);
                    var condition = {
                        accountNumber: account_numbersvalue,
                        "dates": { "$gte": new Date(fromDates), "$lte": new Date(toDate) }
                    };
                    //  console.log(fromDates);
                    //  return;
                    Consumption.aggregate([
                        {
                            $match: condition
                        },
                        {
                            $group: {
                                _id: {
                                    "$dayOfMonth": {
                                        "date": "$dates", "timezone": "Asia/Kolkata"
                                    }
                                },
                                readKWH: { $sum: "$readKWH" }
                            }
                        },
                        { $sort: { "dates": 1 } }
                    ],
                        function (err, res) {
                            if (res && res.length > 0) {
                                console.log(res);
                                var string1 = [];

                                var d = new Date(year, month, 0).getDate()

                                //console.log(year);

                                for (var i = 1; i <= d; i++) {
                                    var flag = 0;
                                    res.forEach(function (element) {
                                        // console.log(element._id);
                                        var p = parseInt(element._id);
                                        if (i === p) {
                                            flag = 2;
                                            // let z = {'_id':element._id.dayOfMonth,'numberofbookings':element._id.readKWH}
                                            string1.push(element);
                                            return;

                                        } else {
                                            if (flag == 0) {
                                                flag = 1;
                                            }
                                        }
                                    });
                                    if (flag == 1) {
                                        string1.push({ '_id': i, numberofbookings: 0 });
                                    }
                                }

                                response['data_params'] = string1;
                                response['authCode'] = success_code;
                                response['msg'] = "Successfully listed data.";
                                response['status'] = success_status_value;
                                resolve(response);



                            } else if (err) {
                                response['authCode'] = error_code;
                                response['msg'] = "No data found.";
                                response['status'] = failure_status_value;
                                reject(response);
                                throw err;
                            }
                            else {
                                response['data_params'] = res;
                                response['authCode'] = error_code;
                                response['msg'] = "No data found.";
                                response['status'] = failure_status_value;
                                resolve(response);
                            }

                        });
                }

            } else {
                var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
                var response = {};
                if (utils.str.is_not_empty(account_numbersvalue)) {

                    Consumption.aggregate(
                        [
                            {
                                $match: {
                                    accountNumber: account_numbersvalue
                                },
                            },
                            {
                                $group: {
                                    // _id: { month: { $month: "$bookingdatetime" },
                                    _id: { $month: "$dates" },
                                    // $month: ['$dates', 5, 2]}, 
                                    numberofbookings: { $sum: "$readKWH" }
                                }
                            }
                        ],
                        function (err, res) {
                            if (res && res.length > 0) {

                                //  console.log(res);
                                var string1 = [];
                                var monthsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                                for (var i = 1; i <= 12; i++) {
                                    var flag = 0;
                                    res.forEach(function (element) {
                                        var p = parseInt(element._id);
                                        if (i === p) {
                                            flag = 2;
                                            string1.push(element);
                                            return;

                                        } else {
                                            if (flag == 0) {
                                                flag = 1;
                                            }
                                        }


                                    });
                                    if (flag == 1) {
                                        // console.log("ayaaaaaaaaaaaaaaa")
                                        string1.push({ '_id': i, numberofbookings: 0 });
                                        // return;
                                    }



                                    // return;
                                    // string1 += res[property1];
                                }
                                console.log(string1);
                                /**/
                                response['data_params'] = string1;
                                response['authCode'] = success_code;
                                response['msg'] = "Successfully listed data.";
                                response['status'] = success_status_value;
                                resolve(response);
                            } else if (err) {
                                response['authCode'] = error_code;
                                response['msg'] = err;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw err;
                            }
                            else {
                                response['data_params'] = res;
                                response['authCode'] = error_code;
                                response['msg'] = "No data found.";
                                response['status'] = failure_status_value;
                                resolve(response);
                            }

                        });
                }

            }



        });
    },

    getConsumptionDataAmountYearlyScalar: function (req) {

        return new Promise(function (resolve, reject) {

            var reqType = req.body.reqType ? req.body.reqType : "";
            // console.log(req.body);

            if (reqType == 1) {
                var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
                var response = {};
                if (utils.str.is_not_empty(account_numbersvalue)) {
                    ConsumptionScalar.aggregate(
                        [
                            {
                                $match: {
                                    accountNumber: account_numbersvalue
                                },
                            },
                            {
                                $group: {
                                    // _id: { month: { $month: "$bookingdatetime" },
                                    _id: { $month: "$dates" },
                                    // $month: ['$dates', 5, 2]}, 
                                    numberofbookings: { $sum: "$readKWH" }
                                }
                            },
                            { $sort: { "_id": 1 } }
                        ],
                        function (err, res) {
                            if (res.length > 0) {
                                response['data_params'] = res;
                                response['authCode'] = success_code;
                                response['msg'] = "Successfully listed data.";
                                response['status'] = success_status_value;
                                resolve(response);
                            } else if (err) {
                                response['authCode'] = error_code;
                                response['msg'] = er;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw error;
                            }
                            else {
                                response['data_params'] = res;
                                response['authCode'] = error_code;
                                response['msg'] = "No data found.";
                                response['status'] = failure_status_value;
                                resolve(response);
                            }

                        });
                }
            } else if (reqType == 2) {
                // return;
                var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
                var months = req.body.months ? req.body.months : "";
                var response = {};

                if (utils.str.is_not_empty(account_numbersvalue) && utils.str.is_not_empty(account_numbersvalue)) {

                    // July
                    // var dayInM = utils.notify.daysInMonth(7, 2009);
                    // console.log(dayInM);
                    // return;
                    const month = Number(months);
                    var currentTime = new Date()
                    var year = currentTime.getFullYear();
                    const fromDates = new Date(currentTime.getFullYear(), month - 1, 1);
                    const toDate = new Date(currentTime.getFullYear(), month, 0);




                    var condition = {
                        accountNumber: account_numbersvalue,
                        "dates": { "$gte": new Date(fromDates), "$lte": new Date(toDate) }
                    };
                    //  console.log(fromDates);
                    //  return;
                    ConsumptionScalar.aggregate([
                        {
                            $match: condition
                        },
                        { $sort: { "dates": 1 } }
                    ],
                        function (err, res) {
                            if (res.length > 0) {
                                /*var dateRet = new Date(year, month, 0).getDate();
                                //  console.log(dateRet);
                                utils.notify.daysInMonth(dateRet, res).then(function (resultRet) {
                                    //res.json(result);
                                    console.log(resultRet);
                                    response['data_params'] = resultRet;
                                    response['authCode'] = success_code;
                                    response['msg'] = "Successfully listed data.";
                                    response['status'] = success_status_value;
                                    resolve(response);
                                });*/
                                //   return;

                                // console.log(res);
                                // return;


                                response['data_params'] = res;
                                response['authCode'] = success_code;
                                response['msg'] = "Successfully listed data.";
                                response['status'] = success_status_value;
                                resolve(response);



                            } else if (err) {
                                response['authCode'] = error_code;
                                response['msg'] = er;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw error;
                            }
                            else {
                                response['data_params'] = res;
                                response['authCode'] = error_code;
                                response['msg'] = "No data found.";
                                response['status'] = failure_status_value;
                                resolve(response);
                            }

                        });
                }

            } else {
                var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
                var response = {};
                if (utils.str.is_not_empty(account_numbersvalue)) {
                    ConsumptionScalar.aggregate(
                        [
                            {
                                $match: {
                                    accountNumber: account_numbersvalue
                                },
                            },
                            {
                                $group: {
                                    // _id: { month: { $month: "$bookingdatetime" },
                                    _id: { $month: "$dates" },
                                    // $month: ['$dates', 5, 2]}, 
                                    numberofbookings: { $sum: "$readKWH" }
                                }
                            }
                        ],
                        function (err, res) {
                            if (res.length > 0) {
                                response['data_params'] = res;
                                response['authCode'] = success_code;
                                response['msg'] = "Successfully listed data.";
                                response['status'] = success_status_value;
                                resolve(response);
                            } else if (err) {
                                response['authCode'] = error_code;
                                response['msg'] = er;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw error;
                            }
                            else {
                                response['data_params'] = res;
                                response['authCode'] = error_code;
                                response['msg'] = "No data found.";
                                response['status'] = failure_status_value;
                                resolve(response);
                            }

                        });
                }

            }



        });
    },
    getConsumptionDataAmountMonthly: function (req) {

        return new Promise(function (resolve, reject) {


            var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
            var months = req.body.months ? Number(req.body.months) : "";
            var response = {};

            if (utils.str.is_not_empty(account_numbersvalue) && utils.str.is_not_empty(account_numbersvalue)) {

                const month = months;
                var currentTime = new Date()
                var year = currentTime.getFullYear();
                const fromDates = new Date(currentTime.getFullYear(), month, 01 - 30);



                const toDate = new Date(currentTime.getFullYear(), month, 0);


                var condition = {
                    accountNumber: account_numbersvalue,
                    "dates": { "$gte": new Date(fromDates), "$lte": new Date(toDate) }
                };
                //  console.log(fromDates);
                //  return;
                Consumption.aggregate([

                    {
                        // "dates": {"$gte": new Date(2018, 09, 01), "$lt": new Date(2018, 09, 30)}

                        // accountNumber: account_numbersvalue,
                        $match: condition


                    }],
                    function (err, res) {
                        if (res.length > 0) {
                            response['data_params'] = res;
                            response['authCode'] = success_code;
                            response['msg'] = "Successfully listed data.";
                            response['status'] = success_status_value;
                            resolve(response);
                        } else if (err) {
                            response['authCode'] = error_code;
                            response['msg'] = er;
                            response['status'] = failure_status_value;
                            reject(response);
                            throw error;
                        }
                        else {
                            response['data_params'] = res;
                            response['authCode'] = error_code;
                            response['msg'] = "No data found.";
                            response['status'] = failure_status_value;
                            resolve(response);
                        }

                    });
            }
        });
    },
    getConsumptionDataAmountWeekly: function (req) {

        return new Promise(function (resolve, reject) {


            var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
            var months = req.body.months ? req.body.months : "";
            var response = {};

            if (utils.str.is_not_empty(account_numbersvalue) && utils.str.is_not_empty(account_numbersvalue)) {

                Consumption.find(

                    {
                        accountNumber: account_numbersvalue,
                        "dates":
                        {
                            $gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))
                        }
                    },
                    function (err, res) {
                        if (res.length > 0) {
                            response['data_params'] = res;
                            response['authCode'] = success_code;
                            response['msg'] = "Successfully listed data.";
                            response['status'] = success_status_value;
                            resolve(response);
                        } else if (err) {
                            response['authCode'] = error_code;
                            response['msg'] = er;
                            response['status'] = failure_status_value;
                            reject(response);
                            throw error;
                        }
                        else {
                            response['data_params'] = res;
                            response['authCode'] = error_code;
                            response['msg'] = "No data found.";
                            response['status'] = failure_status_value;
                            resolve(response);
                        }

                    }).sort({ "dates": -1 });
            }
        });
    },

    getConsumptionDataReading: function (req) {
        return new Promise(function (resolve, reject) {
            var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
            var reqType = req.body.reqType ? req.body.reqType : "";

            if (reqType == 1) {
                console.log("in");
                var response = {};
                if (utils.str.is_not_empty(account_numbersvalue)) {
                    var g = {
                        $group: {
                            // _id: { month: { $month: "$bookingdatetime" },
                            _id: { $month: "$dates" },
                            // $month: ['$dates', 5, 2]}, 
                            numberofbookings: { $sum: "$readKWH" }
                        }
                    };
                    Consumption.aggregate(
                        [
                            {
                                $match: {
                                    accountNumber: account_numbersvalue
                                },

                            }, g,
                            { $sort: { "_id": 1 } }

                        ],
                        function (err, res) {
                            if (res.length > 0) {
                                response['data_params'] = res;
                                response['authCode'] = success_code;
                                response['msg'] = "Successfully listed data.";
                                response['status'] = success_status_value;
                                resolve(response);
                            } else if (err) {
                                response['authCode'] = error_code;
                                response['msg'] = er;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw error;
                            }
                            else {
                                response['data_params'] = res;
                                response['authCode'] = error_code;
                                response['msg'] = "No data found.";
                                response['status'] = failure_status_value;
                                resolve(response);
                            }
                        })
                }
            } else if (reqType == 2) {
                var account_numbersvalue = req.body.account_number ? req.body.account_number : "";
                var months = req.body.months ? req.body.months : "";
                var response = {};

                if (utils.str.is_not_empty(account_numbersvalue) && utils.str.is_not_empty(account_numbersvalue)) {

                    const month = months;
                    var currentTime = new Date()
                    var year = currentTime.getFullYear();
                    const fromDates = new Date(currentTime.getFullYear(), month, 01 - 30);



                    const toDate = new Date(currentTime.getFullYear(), month, 0);


                    var condition = {
                        accountNumber: account_numbersvalue,
                        "dates": { "$gte": new Date(fromDates), "$lte": new Date(toDate) }
                    };
                    //  console.log(fromDates);
                    //  return;
                    Consumption.aggregate([

                        {
                            // "dates": {"$gte": new Date(2018, 09, 01), "$lt": new Date(2018, 09, 30)}

                            // accountNumber: account_numbersvalue,
                            $match: condition


                        }],
                        function (err, res) {
                            if (res.length > 0) {
                                response['data_params'] = res;
                                response['authCode'] = success_code;
                                response['msg'] = "Successfully listed data.";
                                response['status'] = success_status_value;
                                resolve(response);
                            } else if (err) {
                                response['authCode'] = error_code;
                                response['msg'] = er;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw error;
                            }
                            else {
                                response['data_params'] = res;
                                response['authCode'] = error_code;
                                response['msg'] = "No data found.";
                                response['status'] = failure_status_value;
                                resolve(response);
                            }

                        });
                }

            } else {
                var response = {};
                if (utils.str.is_not_empty(account_numbersvalue)) {
                    var g = {
                        $group: {
                            // _id: { month: { $month: "$bookingdatetime" },
                            _id: { $month: "$dates" },
                            // $month: ['$dates', 5, 2]}, 
                            numberofbookings: { $sum: "$readKWH" }
                        }
                    };
                    Consumption.aggregate(
                        [
                            {
                                $match: {
                                    accountNumber: account_numbersvalue
                                },

                            }, g

                        ],
                        function (err, res) {
                            if (res.length > 0) {
                                response['data_params'] = res;
                                response['authCode'] = success_code;
                                response['msg'] = "Successfully listed data.";
                                response['status'] = success_status_value;
                                resolve(response);
                            } else if (err) {
                                response['authCode'] = error_code;
                                response['msg'] = er;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw error;
                            }
                            else {
                                response['data_params'] = res;
                                response['authCode'] = error_code;
                                response['msg'] = "No data found.";
                                response['status'] = failure_status_value;
                                resolve(response);
                            }
                        });
                }

            }
        });
    },


    commanDasboardData: function (req) {

        return new Promise(function (resolve, reject) {

            var account_numbersvalue = req.body.account_number ? req.body.account_number : "";

            var response = {};
            if (utils.str.is_not_empty(account_numbersvalue)) {
                async.parallel([

                    function (callback) {

                        var today = new Date();
                        var curM = today.getMonth() + 1;
                        var curD = today.getDate() - 1;
                        //    console.log(curD);
                        //    return;

                        var myToday = Date(today.getFullYear(), today.getMonth(), today.getDate(), 00, 00, 00);
                        var toD = new Date(today.getFullYear() + '-' + curM + '-' + today.getDate());
                        var toDs = new Date(today.getFullYear() + '-' + curM + '-' + curD);

                        var yesterDay = new Date(today.getFullYear() + '-' + curM + '-' + curD + " 00:00:00.000Z");

                        Consumption.aggregate([

                            {
                                "$match": {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $lt: toD,
                                        // $lt:new Date(new Date().setDate(new Date().getDate() - 4)),
                                        $gte: yesterDay
                                        // $lt: new Date(new Date().setDate(new Date().getDate() - 1)),
                                        // $gte: toDs
                                    }
                                },

                            },
                            {
                                $group: {
                                    // _id: { month: { $month: "$bookingdatetime" },
                                    _id: { $month: "$dates" },
                                    // $month: ['$dates', 5, 2]}, 
                                    readKWH: { $sum: "$readKWH" }
                                }
                            }
                            /**/
                        ],
                            function (err, res) {
                                // console.log(err);
                                // console.log(res);
                                if (res) {
                                    callback(null, res);
                                } else if (err) {
                                    callback(null, '');
                                } else {
                                    callback(null, '');
                                }
                            });
                    },
                    function (callback) {

                        var currentTime = new Date();
                        const month = currentTime.getMonth();

                        var year = currentTime.getFullYear();
                        const fromDates = new Date(currentTime.getFullYear(), month, 01);
                        const toDate = new Date(currentTime.getFullYear(), month, 0);


                        // var condition = { "$expr": { "$eq": [{ "$month": "$readKWH" }, 9] } };
                        //  console.log(condition);
                        //  return;
                        //end calculation of this month
                        // var days = 30;
                        var months = month + 1;
                        // console.log(month);
                        Consumption.aggregate(

                            [
                                {
                                    '$project': {
                                        "month": { "$month": "$dates" },
                                        "readKWH": "$readKWH",
                                        "accountNumber": "$accountNumber"

                                    }
                                },
                                { "$match": { "month": months, "accountNumber": account_numbersvalue } },
                                {
                                    $group: {
                                        // _id: { month: { $month: "$bookingdatetime" },
                                        _id: { $month: "$dates" },
                                        // $month: ['$dates', 5, 2]}, 
                                        numberofbookings: { $sum: "$readKWH" }
                                    }
                                }
                            ],


                            function (errCalculation, resCalculation) {
                                if (resCalculation && resCalculation.length > 0) {

                                    var lastMonthData = parseFloat(Math.round(resCalculation[0].numberofbookings * 100) / 100).toFixed(3);

                                    callback(null, lastMonthData);
                                } else if (errCalculation) {
                                    callback(null, '');
                                }
                                else {
                                    callback(null, '');
                                }

                            });

                    }
                ],
                    // optional callback
                    function (err, results) {
                        // console.log("========>");
                        // console.log(results);

                        if (err) {
                            response['authCode'] = error_code;
                            response['msg'] = errCalculation;
                            response['status'] = failure_status_value;
                            reject(response);
                            throw errCalculation;

                        } else {
                            var currentTime = new Date();
                            const toDate = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0);
                            var blankData = {
                                // "_id": "5bb611bc1e7336370471b5c3",
                                "dates": toDate,
                                "created": toDate,
                                "modified": toDate,
                                "accountNumber": account_numbersvalue,
                                "meterBadgeNumber": "000000",
                                "meterSeriolNumber": "000000",
                                "readKWH": "0.00",
                                "amount": "0.00",
                                "recordGeneratedTimestamp": "0.00",
                                "__v": 0,
                                "lastMonthRecord": "0.00"
                            }

                            response['data_params'] = results[0] && results[0].length ? results[0][0] : blankData;
                            response['data_params']['lastMonthRecord'] = results[1] ? parseFloat(Math.round(results[1] * 100) / 100).toFixed(3) : 0.00;

                            response['authCode'] = success_code;
                            response['msg'] = "Successfully listed data.";
                            response['status'] = success_status_value;
                            resolve(response);

                        }
                    });


            }
        });
    },

    //dashboard data with scalar data

    commanDasboardDataScalar: function (req) {

        return new Promise(function (resolve, reject) {

            //  var ISODate = require('ISODate');
            var account_numbersvalue = req.body.account_number ? req.body.account_number : "";

            var response = {};

            if (utils.str.is_not_empty(account_numbersvalue)) {
                async.parallel([
                    function (callback) {

                        var today = new Date();
                        var curM = today.getMonth() + 1;
                        var curD = today.getDate() - 1;

                        var toD = today.getFullYear() + '-' + curM + '-' + curD + ' 23:59:59.999';
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + curD + " 00:00:00.000";
                        //  console.log(yesterDay);
                        // console.log(toD);
                        ConsumptionScalar.find({
                            "accountNumber": account_numbersvalue,

                            "dates": {
                                $gte: new Date(yesterDay),
                                $lt: new Date(toD)
                            }/**/
                        },
                            function (err, res) {
                                // console.log(err);
                                // console.log(res);
                                if (res) {
                                    callback(null, res);
                                } else if (err) {
                                    callback(null, '');
                                } else {
                                    callback(null, '');
                                }
                            });
                    },
                    function (callback) {

                        //day yesterday data
                        var today = new Date();
                        var curM = today.getMonth() + 1;
                        var curD = today.getDate() - 2;

                        var toD = today.getFullYear() + '-' + curM + '-' + curD + ' 23:59:59.999';
                        var yesterDay = today.getFullYear() + '-' + curM + '-' + curD + " 00:00:00.000";
                        //  console.log(yesterDay);
                        // console.log(toD);
                        ConsumptionScalar.find({
                            "accountNumber": account_numbersvalue,

                            "dates": {
                                $gte: new Date(yesterDay),
                                $lt: new Date(toD)
                            }/**/
                        },
                            function (err, res) {
                                // console.log(err);
                                // console.log(res);
                                if (res) {
                                    callback(null, res);
                                } else if (err) {
                                    callback(null, '');
                                } else {
                                    callback(null, '');
                                }
                            });
                    },
                    function (callback) {

                        //years first value data
                        var currentTime = new Date();
                        const month = 12;
                        var year = currentTime.getFullYear();
                        var dates = 31;
                        // console.log(year);
                        year = year - 1;
                        //  var fromDates = currentTime.getFullYear() + " +"+ 12 + "+" +31+ '-' + ' 23:59:59.999';
                        var fromDates = year + '-' + month + '-' + dates + ' 23:59:59.999'
                        //console.log(fromDates);

                        ConsumptionScalar.aggregate(
                            [
                                {
                                    "$match": {
                                        "dates": {
                                            $lte: new Date(fromDates),

                                        }, "accountNumber": account_numbersvalue
                                    }
                                },
                                { $sort: { "dates": -1 } },
                                { $limit: 1 }

                            ],
                            function (errCalculation, resCalculation) {
                                if (resCalculation && resCalculation.length > 0) {
                                    callback(null, resCalculation);
                                } else if (errCalculation) {
                                    callback(null, '');
                                }
                                else {
                                    callback(null, '');
                                }
                            });
                    },

                    function (callback) {

                        var today = new Date();
                        var curM = today.getMonth() + 1;
                        var curD = today.getDate() - 1;
                        //    console.log(curD);
                        //    return;
                        var thisYear = today.getFullYear();

                        var myToday = Date(today.getFullYear(), today.getMonth(), today.getDate(), 00, 00, 00);
                        var toD = new Date(today.getFullYear() + '-' + curM + '-' + today.getDate());
                        var toDs = new Date(today.getFullYear() + '-' + curM + '-' + curD);

                        var yesterDay = new Date(thisYear - 1 + '-' + 12 + '-' + 31 + " 00:00:00.000");

                        Consumption.aggregate([

                            {
                                "$match": {
                                    "accountNumber": account_numbersvalue,
                                    "dates": {
                                        $lt: toD,
                                        // $lt:new Date(new Date().setDate(new Date().getDate() - 4)),
                                        $gt: yesterDay
                                        // $lt: new Date(new Date().setDate(new Date().getDate() - 1)),
                                        // $gte: toDs
                                    }
                                },

                            },
                            {
                                $group: {
                                    // _id: { month: { $month: "$bookingdatetime" },
                                    // _id: { $month: "$dates" },

                                    _id: {
                                        "$year": {
                                            "date": "$dates", "timezone": "Asia/Kolkata"
                                        }
                                    },
                                    // $month: ['$dates', 5, 2]}, 
                                    readKWH: { $sum: "$readKWH" }
                                }
                            }
                            /**/
                        ],
                            function (err, res) {
                                // console.log(err);
                                // console.log(res);
                                if (res) {
                                    callback(null, res);
                                } else if (err) {
                                    callback(null, '');
                                } else {
                                    callback(null, '');
                                }
                            });
                    }
                ],
                    // optional callback
                    function (err, resCalculationLast) {
                        //    console.log("========>");
                        //    console.log(resCalculationLast);
                        //    return;

                        if (err) {
                            response['authCode'] = error_code;
                            response['msg'] = errCalculation;
                            response['status'] = failure_status_value;
                            reject(response);
                            throw errCalculation;

                        } else {
                            var currentTime = new Date();
                            const toDate = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0);
                            var blankData = {
                                // "_id": "5bb611bc1e7336370471b5c3",
                                "dates": toDate,
                                "created": toDate,
                                "modified": toDate,
                                "accountNumber": account_numbersvalue,
                                "meterBadgeNumber": "000000",
                                "meterSeriolNumber": "000000",
                                "readKWH": "0.00",
                                "amount": "0.00",
                                "recordGeneratedTimestamp": "0.00",
                                "__v": 0,
                                "yeartodate": "0.00"
                            }
                            var YearToDate = resCalculationLast[2];

                            var yesterDayData = resCalculationLast[0] && resCalculationLast[0].length ? resCalculationLast[0][0].readKWH : 0.00;
                            var dayAfterYesterDayData = resCalculationLast[1] && resCalculationLast[1].length ? resCalculationLast[1][0].readKWH : 0.00;

                            if (yesterDayData == 0) {
                                blankData.readKWH = "0.00";
                            } else {
                                rdKwh = parseInt(yesterDayData) - parseInt(dayAfterYesterDayData);
                                blankData.readKWH = parseFloat(Math.round(rdKwh * 100) / 100).toFixed(2)

                            }
                            if (blankData.readKWH <= 0) { blankData.readKWH = "0.00"; }

                            ///year to date calculattion

                            var yearFirstDayData = resCalculationLast[2] && resCalculationLast[2].length ? resCalculationLast[2][0].readKWH : 0.00;
                            var yearLastDayData = resCalculationLast[3] && resCalculationLast[3][0].readKWH ? resCalculationLast[3][0].readKWH : 0.00;
                            // console.log(yearLastDayData);
                            YearToDate = yearLastDayData - yearFirstDayData;

                            ///end year to date calculattion

                            response['data_params'] = blankData;
                            // response['data_params']['yeartodate'] = YearToDate >= 0 ? parseFloat(Math.round(YearToDate * 100) / 100).toFixed(3) : 0.00;
                            response['data_params']['yeartodate'] = yearLastDayData >= 0 ? parseFloat(Math.round(yearLastDayData * 100) / 100).toFixed(3) : 0.00;
                            // response['data_params'].push([{'aman':"singh"}]);
                            // console.log(response);
                            //console.log(resCalculationLast);
                            response['authCode'] = success_code;
                            response['authCode'] = success_code;
                            response['msg'] = "Successfully listed data.";
                            response['status'] = success_status_value;
                            resolve(response);

                        }
                    });


            }
        });
    },

    //Update profile data
    updateUserProfile: function (req) {

        return new Promise(function (resolve, reject) {

            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {

                //  return;

                req.body = fields;

                var userId = req.body.userId ? req.body.userId : "";
                var account_number = req.body.account_number ? req.body.account_number : "";
                var account_name = req.body.account_name ? req.body.account_name : "";
                var address_line1 = req.body.address_line1 ? req.body.address_line1 : "";
                var address_line2 = req.body.address_line2 ? req.body.address_line2 : "";
                var address_line3 = req.body.address_line3 ? req.body.address_line3 : "";
                var address_line4 = req.body.address_line4 ? req.body.address_line4 : "";
                var postal_code = req.body.postal_code ? req.body.postal_code : "";
                var city = req.body.city ? req.body.city : "";
                var state = req.body.state ? req.body.state : "";
                var sanctioned_load = req.body.sanctioned_load ? req.body.sanctioned_load : "";
                var discom_name = req.body.discom_name ? req.body.discom_name : "";
                var meter_id = req.body.meter_id ? req.body.meter_id : "";
                var modifier = req.body.modifier ? req.body.modifier : "";
                var email = req.body.email ? req.body.email : "";
                var mobile_no = req.body.mobile_no ? req.body.mobile_no : "";




                var response = {};
                if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                    // console.log("aya h");
                    // return;
                    var query = "select * from users where (id=?)";
                    utils.db.executeQuery(query, [userId]).then(function (result, e) {

                        if (result.length < 1 || _.isEmpty(result)) {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = "Data not matched";
                            reject(response);
                        } else if (e) {

                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = "Data not matched";
                            reject(response);
                        }
                        else {
                            var updateJson = {
                                // email: email,
                                account_number: account_number,
                                account_name: account_name,
                                address_line1: address_line1,
                                address_line2: address_line2,
                                address_line3: address_line3,
                                address_line4: address_line4,
                                postal_code: postal_code,
                                city: city,
                                state: state,
                                sanctioned_load: sanctioned_load,
                                discom_name: discom_name,
                                meter_id: meter_id,
                                modifier: modifier,
                                modified: current_datetime,
                                email: email,
                                mobile_no: mobile_no
                            };


                            //  console.log(files);
                            var file_name = result[0].profile_pic;
                            if (utils.str.is_not_empty(files['filesdata'])) {
                                //  console.log("Hi1");
                                var random = Date.now();
                                var temp_path = files.filesdata.path;
                                file_name = random + "-" + files.filesdata.name;
                                var new_location = 'public/uploads/profile_image/';
                            }
                            if (utils.str.is_not_empty(files['filesdata'])) {

                                fs.move(temp_path, new_location + file_name, function (err) {

                                    gm(new_location + file_name)
                                        .resize(100, 100)
                                        .write(new_location + 'thumbs/200x200-' + file_name, function (err) {
                                            pathRem = 'public/uploads/profile_image/' + result[0].profile_pic;
                                            fs.unlink(pathRem);

                                            return file_name;
                                            //console.log(err);
                                            if (!err) {

                                                // return file_name;
                                            };
                                        });

                                });

                            }

                            updateJson.profile_pic = file_name;

                            // console.log(updateJson);

                            //  return;
                            utils.db.executeQuery("UPDATE users set ? WHERE id = ?", [updateJson, result[0].id]).then(function (result) {
                                //console.log("here");
                                if (result.affectedRows > 0) {
                                    response['authCode'] = success_code;
                                    response['status'] = success_status_value;
                                    response['data_params'] = [];
                                    response['msg'] = "Updated successfully.";
                                    resolve(response);
                                } else {
                                    response['authCode'] = error_code;
                                    response['msg'] = database_error;
                                    response['status'] = failure_status_value;
                                    reject(response);
                                }
                            }, function (error) {
                                response['authCode'] = error_code;
                                response['msg'] = database_error;
                                response['status'] = failure_status_value;
                                reject(response);
                                throw error;

                            });
                        }
                    }, function (error) {

                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;

                    });
                } else {

                    // console.log("aya h1111");
                    // return;

                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                    //  throw error;



                }
            });
        });
    },

    //Update profile image
    updateProfileImage: function (req) {

        return new Promise(function (resolve, reject) {
            // console.log(req);

            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                // console.log(fields);
                // console.log(files);
                // return;
                //  return;

                req.body = fields;
                var userId = req.body.profileToken ? req.body.profileToken : "";
                var response = {};
                if (utils.str.is_not_empty(userId) && utils.str.is_not_empty(files['profileImg'])) {

                    var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                    // console.log("aya h");
                    // return;
                    var query = "select * from users where (id=?)";
                    utils.db.executeQuery(query, [userId]).then(function (result, e) {

                        if (result.length < 1 || _.isEmpty(result)) {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        } else if (e) {

                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                        else {

                            var file_name = result[0].profile_image;
                            if (utils.str.is_not_empty(files['profileImg'])) {
                                //  console.log("Hi1");
                                var random = Date.now();
                                var temp_path = files.profileImg.path;
                                file_name = random + "-" + files.profileImg.name;
                                var new_location = 'public/uploads/profile_image/';
                            }
                            if (utils.str.is_not_empty(files['profileImg'])) {

                                fs.move(temp_path, new_location + file_name, function (err) {

                                    gm(new_location + file_name)
                                        .resize(100, 100)
                                        .write(new_location + 'thumbs/200x200-' + file_name, function (err) {
                                            pathRem = 'public/' + result[0].profile_image;
                                            if (result[0].profile_image != "/uploads/profile_image/default.jpg") {
                                                console.log(result[0].profile_image);
                                                fs.unlink(pathRem);
                                            }



                                            return file_name;
                                            //console.log(err);
                                            if (!err) {

                                                // return file_name;
                                            };
                                        });

                                });

                            }


                            var updateJson = { "profile_image": "/uploads/profile_image/" + file_name };

                            // console.log(updateJson);

                            //  return;
                            utils.db.executeQuery("UPDATE users set ? WHERE id = ?",
                                [updateJson, result[0].id]).then(function (result) {
                                    //console.log("here");
                                    if (result.affectedRows > 0) {
                                        response['authCode'] = success_code;
                                        response['status'] = success_status_value;
                                        response['data_params'] = [];
                                        response['msg'] = "Updated successfully.";
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['msg'] = database_error;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                    }
                                }, function (error) {
                                    response['authCode'] = error_code;
                                    response['msg'] = database_error;
                                    response['status'] = failure_status_value;
                                    reject(response);
                                    throw error;

                                });
                        }
                    }, function (error) {

                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;

                    });
                } else {

                    // console.log("aya h1111");
                    // return;

                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                    //  throw error;



                }
            });
        });
    },
    FTPClient: function (req) {
        return new Promise(function (resolve, reject) {

            var response = {};
            const { SocksClient } = require('socks');
            const jsftp = require("jsftp");
            var fs = require('fs');
            //var Client = require('ftp');
            var fs = require('fs');
            // const Ftp = new jsftp({
            //     host: '139.59.59.145',
            //     port: '',
            //     user: 'root',
            //     pass: 'wedigtech@1234'
            // });
            let Client = require('ssh2-sftp-client');
            let sftp = new Client();
            sftp.connect({
                host: '10.10.212.6',
                port: '',
                username: 'LTI01',
                password: 'Zfg6mE9z3CalT5a'
            }).then(() => {
                //console.log("there");
                return sftp.list('/scratch/sgg/flat_files/dataConnect/');
            }).then((data) => {

                async function foo() {

                    var array = data;
                    var mydate = new Date();
                    var month = mydate.getMonth(); // month (in integer 0-11)
                    var dates = mydate.getDate(); // month (in integer 0-11)
                    var years = mydate.getFullYear(); // year
                    CurrentMonth = month + 1
                    var ytd = parseInt(dates) - 1;
                    var str = years + "-" + CurrentMonth + "-" + ytd;

                    for (var i = 0; i < array.length; i++) {
                        await new Promise(next => {
                            // console.log(array[i]);
                            var nm = array[i].name;

                            if (nm.search(str) > 0) {

                                VpnDownload.find({ name: nm, status: 1 }, function (ee, rrr) {
                                    console.log("1");
                                    if (rrr && rrr.length > 0) {
                                        // console.log("2");
                                        next()
                                    }
                                    else if (ee) {
                                        //console.log("3");
                                        next()
                                    }
                                    else {
                                        var remotePath = '/scratch/sgg/flat_files/dataConnect/' + nm;
                                        var localPath = './public/csv/vpn/' + nm;

                                        sftp.fastGet(remotePath, localPath, function (e, r) {
                                            // console.log(e, "ee");
                                            // console.log(r, "EEEEEE");
                                            var vpnDownloads = new VpnDownload({
                                                name: nm

                                            });
                                            //    console.log(json);
                                            //    return;                    
                                            vpnDownloads.save();



                                            var path = localPath;

                                            fs.rename(path, './public/csv/vpn/intervaldata.csv', function (err) {
                                                if (err) console.log('ERROR: ' + err);

                                                VpnDownload.update({ name: nm }, { status: 2 }, { multi: true });
                                            });

                                            next()
                                        });
                                    }
                                })
                            } else {
                                // console.log("else me h");
                                // console.log(array[i]);
                                // console.log(nm)
                                next()
                            }

                        })
                    }
                }

                foo();

                // console.log(data, 'the data info');
                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data;
                //data_params":[{
                response['msg'] = "listed successfully.";
                console.log("here");
                resolve(response);

            }).catch((err) => {
                console.log(err, 'catch error');
                response['authCode'] = error_code;
                response['msg'] = err;
                response['status'] = failure_status_value;
                reject(response);
            });
        });
    },

    YTDSoa: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                var data_param = {
                    "createdOn": "2018-12-04 00:15:00.000", "modifiedOn": "2018-12-04 00:15:00.000"
                    , "accountNumber": "3333333333", "meterBadgeNumber": "GOEGP3623208",
                    "meterSerialNumber": "GP3623208", "YesterdayConsumption": "20.00",
                    "amount": "52", "recordGeneratedTimestamp": "266945628122",
                    "yeartodateconsumtion": "911.04"
                }

                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data_param;
                response['msg'] = data_listed;
                resolve(response);
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },


    SOAytddatafromurl: function (req) {
        return new Promise(function (resolve, reject) {

            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};
            // console.log(req.headers.token)

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                utils.db.executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            var reqs = require('request');
                            var hosts = '';
                            if (req.headers.host == "103.249.98.101:3002") {
                                hosts = "10.10.167.8:3002";
                            } else {
                                hosts = req.headers.host;
                            }
                            reqs.post({
                                url: req.protocol + '://' + hosts + '/users/YTDSoa',
                                form: { "userId": userId, "account_number": account_number },
                                headers: {
                                    //'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token,
                                    "Authorization": req.headers.authorization
                                },
                                method: 'POST',
                                timeout: 60 * 1000,
                                form: { "userId": userId, "account_number": account_number }
                            }, function (e, r, body) {
                                if (body) {

                                    var data = JSON.parse(body);
                                    data = data.data_params;
                                    /// console.log(data);
                                    var ytdCons = {
                                        accountNumber: data.accountNumber,
                                        meterBadgeNumber: data.meterBadgeNumber,
                                        meterSerialNumber: data.meterSerialNumber,
                                        YesterdayConsumption: data.YesterdayConsumption,
                                        amount: data.amount,
                                        yeartodateconsumtion: data.yeartodateconsumtion,
                                        createdOn: data.createdOn,
                                        modifiedOn: data.modifiedOn,
                                    };


                                    ConsumptionYTD.find({
                                        accountNumber: data.accountNumber,
                                        createdOn: data.createdOn
                                    },
                                        function (e10, dataval) {
                                            if (dataval && dataval.length) {

                                                response['data_params'] = ytdCons;
                                                response['authCode'] = success_code;
                                                response['msg'] = data_listed;
                                                response['status'] = success_status_value;
                                                resolve(response);
                                            } else {
                                                ConsumptionYTDs = new ConsumptionYTD(ytdCons);
                                                ConsumptionYTDs.save(
                                                    function (err, rrr) {
                                                        if (err) {
                                                            response['authCode'] = err;
                                                            response['msg'] = "Data fetching problems.";
                                                            response['status'] = failure_status_value;
                                                            reject(response);
                                                        }
                                                        else if (rrr) {
                                                            // console.log("aa gya h2");
                                                            //console.log(json);
                                                            response['authCode'] = success_code;
                                                            response['status'] = success_status_value;
                                                            response['data_params'] = ytdCons;
                                                            response['msg'] = data_listed;
                                                            resolve(response);
                                                        }

                                                    });
                                            }
                                        })
                                } else {
                                    response['authCode'] = error_code;
                                    response['status'] = failure_status_value;
                                    response['msg'] = "Some error in data fetching.";
                                    reject(response);
                                }
                            });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    })

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },



    YTDdatafromurlautomatic: function (req) {
        return new Promise(function (resolve, reject) {
            // console.log(req.body);
            // return;
            // var userId = req.body.userId ? req.body.userId : "";
            // var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};
            if (req.body) {
                var data = req.body
                var account_numberReq = data.accountNumber ? data.accountNumber : "";
                var YesterdayConsumptionReq = data.YesterdayConsumption ? data.YesterdayConsumption : "";
                var yeartodateconsumtionReq = data.yeartodateconsumtion ? data.yeartodateconsumtion : "";
                var meterBadgeNumberReq = data.meterBadgeNumber ? data.meterBadgeNumber : "";
                var meterSerialNumberReq = data.meterSerialNumber ? data.meterSerialNumber : "";
                var amountReq = data.amount ? data.amount : "0.00";
                var createdOnReq = data.createdOn ? data.createdOn : '';
                var modifiedOnReq = data.modifiedOn ? data.modifiedOn : '';

                if (utils.str.is_not_empty(account_numberReq) && utils.str.is_not_empty(YesterdayConsumptionReq)
                    && utils.str.is_not_empty(yeartodateconsumtionReq)
                ) {
                    var ytdCons = {
                        accountNumber: account_numberReq,
                        meterBadgeNumber: meterBadgeNumberReq,
                        meterSerialNumber: meterSerialNumberReq,
                        YesterdayConsumption: YesterdayConsumptionReq,
                        amount: amountReq,
                        yeartodateconsumtion: yeartodateconsumtionReq,
                        createdOn: createdOnReq,
                        modifiedOn: modifiedOnReq,
                    };


                    ConsumptionYTD.find({
                        accountNumber: data.accountNumber,
                        createdOn: data.createdOn
                    },
                        function (e10, dataval) {
                            if (dataval && dataval.length) {

                                response['data_params'] = [];
                                response['authCode'] = error_code;
                                response['msg'] = "Data already saved.";
                                response['status'] = failure_status_value;
                                reject(response);
                            } else {



                                ConsumptionYTDs = new ConsumptionYTD(ytdCons);

                                ConsumptionYTDs.save(
                                    function (err, rrr) {
                                        if (err) {
                                            response['authCode'] = error_code;
                                            response['msg'] = "Data fetching problems.";
                                            response['status'] = failure_status_value;
                                            reject(response);
                                        }
                                        else if (rrr) {
                                            // console.log("aa gya h2");
                                            //console.log(json);
                                            response['authCode'] = success_code;
                                            response['status'] = success_status_value;
                                            response['data_params'] = ytdCons;
                                            response['msg'] = data_listed;
                                            resolve(response);
                                        }

                                    });

                            }
                        })
                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }



            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Some error in data fetching.";
                reject(response);

            }
        });
    },
    YTDGetData: function (req) {
        return new Promise(function (resolve, reject) {
            // console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {

                var userId = req.body.userId ? req.body.userId : "";
                var account_number = req.body.account_number ? req.body.account_number : "";
                var response = {};

                // console.log(req.headers.token)
                if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                    utils.db.executeQuery('SELECT * FROM users JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? LIMIT 1', [userId])
                        .then(function (result) { // fetch user details
                            if (result.length > 0) {

                                var today = new Date();
                                var curM = today.getMonth() + 1;
                                var curD = today.getDate() - 1;
                                var yesterDay = today.getFullYear() + '-' + curM + '-' + (curD) + " 00:00:00.000";
                                // console.log(curD);
                                ConsumptionYTD.aggregate(
                                    [
                                        {
                                            $match: {
                                                "accountNumber": account_number,
                                                "createdOn": {
                                                    $gte: new Date(yesterDay),
                                                    //  $lte: new Date(toDay)
                                                }
                                            }
                                        },
                                        { $sort: { "_id": 1 } }
                                    ],

                                    function (e10, dataval) {
                                        if (dataval && dataval.length) {
                                            response['data_params'] = dataval[0];
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        } else {
                                            var data_param = {
                                                "createdOn": "",
                                                "modifiedOn": ""
                                                , "accountNumber": account_number,
                                                "meterBadgeNumber": "",
                                                "meterSerialNumber": "",
                                                "YesterdayConsumption": "0.00",
                                                "amount": "0.00",
                                                "recordGeneratedTimestamp": "",
                                                "yeartodateconsumtion": "0.00"
                                            }
                                            response['data_params'] = data_param;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                    })

                            } else {
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = user_is_not_exits;
                                reject(response);
                            }

                        })

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    //end ytd
    ODRdatafromurlautomatic: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            if (req.body) {

                var data = req.body;
                var account_numberReq = data.accountNumber ? data.accountNumber : "";
                var latestConsumptionReq = data.latestConsumption ? data.latestConsumption : "";
                var meterBadgeNumberReq = data.meterBadgeNumber ? data.meterBadgeNumber : "";
                var meterSerialNumberReq = data.meterSerialNumber ? data.meterSerialNumber : "";

                var createdOnReq = data.createdOn ? data.createdOn : '';
                var modifiedOnReq = data.modifiedOn ? data.modifiedOn : '';

                if (utils.str.is_not_empty(account_numberReq)
                    && utils.str.is_not_empty(latestConsumptionReq)
                    && utils.str.is_not_empty(meterBadgeNumberReq)
                ) {
                    var ytdCons = {
                        accountNumber: account_numberReq,
                        meterBadgeNumber: meterBadgeNumberReq,
                        meterSerialNumber: meterSerialNumberReq,
                        latestConsumption: latestConsumptionReq,
                        createdOn: createdOnReq,
                        modifiedOn: modifiedOnReq,
                    };

                    ConsumptionODR.find({
                        accountNumber: data.accountNumber,
                        createdOn: data.createdOn
                    },
                        function (e10, dataval) {
                            if (dataval && dataval.length) {

                                response['data_params'] = ytdCons;
                                response['authCode'] = success_code;
                                response['msg'] = data_listed;
                                response['status'] = success_status_value;
                                resolve(response);
                            } else {
                                ConsumptionODRs = new ConsumptionODR(ytdCons);
                                ConsumptionODRs.save(
                                    function (err, rrr) {
                                        if (err) {
                                            response['authCode'] = err;
                                            response['msg'] = "Data fetching problems.";
                                            response['status'] = failure_status_value;
                                            reject(response);
                                        }
                                        else if (rrr) {
                                            // console.log("aa gya h2");
                                            //console.log(json);
                                            response['authCode'] = success_code;
                                            response['status'] = success_status_value;
                                            response['data_params'] = ytdCons;
                                            response['msg'] = data_listed;
                                            resolve(response);
                                        }

                                    });

                            }
                        })
                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }



            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Some error in data fetching.";
                reject(response);

            }
        });
    },


    ///odr start
    ODRSoa: function (req) {
        return new Promise(function (resolve, reject) {
            //   console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                var data_param = {
                    "createdOn": "2018-10-12 00:15:00.000", "modifiedOn": "2018-10-14 00:15:05.000"
                    , "accountNumber": "6924333333", "meterBadgeNumber": "GOEGP3623208",
                    "meterSerialNumber": "GP3623208", "latestConsumption": "10.23"
                }

                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data_param;
                response['msg'] = data_listed;
                resolve(response);
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    ///odr start
    NetMeterSoa: function (req) {
        return new Promise(function (resolve, reject) {
            //   console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var year = req.body.year ? req.body.year : "";
            var months = req.body.months ? req.body.months : "";
            var days = req.body.days ? req.body.days : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId) && utils.str.is_not_empty(year)
                && utils.str.is_not_empty(months) && utils.str.is_not_empty(days)
            ) {
                var data_param = [
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 0, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 1, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 2, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 3, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 4, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 5, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 6, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 7, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 8, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 9, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 10, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 11, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 12, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 13, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 14, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 15, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 16, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 17, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 18, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 19, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 20, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 21, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 22, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) },
                    { "year": year, "month": months, "day": days, "accountNumber": account_number, "hour": 23, "consumption": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4), "generation": (Math.random() * (0.1 - 2.00) + 2.00).toFixed(4) }];
                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data_param;
                response['msg'] = data_listed;
                resolve(response);
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },


    SOAnetmeterfromurls: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var displayMode = req.body.displayMode ? req.body.displayMode : "";
            var reference_dateTime = req.body.reference_dateTime ? req.body.reference_dateTime : "";
            //reference_dateTime

            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)
                && utils.str.is_not_empty(displayMode)) {
                utils.db.executeQuery('SELECT * FROM users INNER JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            var today = new Date();
                            if (reference_dateTime == "") {
                                var dd = today.getDate();
                                var mm = today.getMonth() + 1; //January is 0!
                                var yyyy = today.getFullYear();
                            } else if (reference_dateTime != "") {
                                var dateSplit = reference_dateTime.split("-");
                                var dd = parseInt(dateSplit[2]);
                                var mm = parseInt(dateSplit[1]); //January is 0!
                                var yyyy = parseInt(dateSplit[0]);
                            } else {
                                var dd = today.getDate();
                                var mm = today.getMonth() + 1; //January is 0!
                                var yyyy = today.getFullYear();
                            }

                            //  return;

                            SoaNetMeter.aggregate(
                                [
                                    {
                                        $match: { year: yyyy, month: mm, day: dd, accountNumber: account_number }
                                    }, { $sort: { "hour": 1 } }
                                ], function (e, r) {
                                    // console.log( r);
                                    // return;
                                    if (r && r.length) {
                                        response['authCode'] = success_code;
                                        response['status'] = success_status_value;
                                        response['data_params'] = r;
                                        response['msg'] = data_listed;
                                        resolve(response);
                                    } else {


                                        var reqs = require('request');
                                        var hosts = '';
                                        if (req.headers.host == "103.249.98.101:3002") {
                                            hosts = "10.10.167.8:3002";
                                        } else {
                                            hosts = req.headers.host;
                                        }
                                        reqs.post({
                                            url: req.protocol + '://' + hosts + '/users/NetMeterSoa',
                                            form: {
                                                "userId": userId, "account_number": account_number,
                                                "year": yyyy, "months": mm, "days": dd
                                            },
                                            headers: {
                                                //'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'token': req.headers.token,
                                                "Authorization": req.headers.authorization
                                            },
                                            method: 'POST',
                                            timeout: 60 * 1000,
                                            //form: { "userId": userId, "account_number": account_number }
                                        }, function (e, r, body) {
                                            if (body) {

                                                var body = JSON.parse(body);
                                                // console.log(body);
                                                // return;

                                                if (body && body.authCode != 100) {
                                                    var data = body;
                                                    async function foo() {
                                                        var array = data['data_params'];
                                                        for (var i = 0; i < array.length; i++) {
                                                            await new Promise(next => {
                                                                var accountNumberJSON = array[i].accountNumber;
                                                                var monthJSON = array[i].month;
                                                                var yearJSON = array[i].year;
                                                                var consumptionJSON = array[i].consumption;
                                                                var dayJSON = array[i].day;
                                                                var hourJSON = array[i].hour;
                                                                var generationJSON = array[i].generation;


                                                                SoaNetMeter.find(
                                                                    {
                                                                        accountNumber: accountNumberJSON,
                                                                        month: monthJSON, year: yearJSON, day: dayJSON, hour: hourJSON
                                                                    },
                                                                    function (ee, rrr) {
                                                                        if (rrr && rrr.length > 0) {
                                                                            next()
                                                                        }
                                                                        else if (ee) {
                                                                            next()
                                                                        }
                                                                        else {
                                                                            var monthlyReq = {
                                                                                accountNumber: accountNumberJSON,
                                                                                month: monthJSON,
                                                                                year: yearJSON,
                                                                                consumption: consumptionJSON,
                                                                                day: dayJSON,
                                                                                hour: hourJSON,
                                                                                generation: generationJSON

                                                                            };
                                                                            var SoaNetMeters = new SoaNetMeter(monthlyReq);
                                                                            SoaNetMeters.save();
                                                                            next()
                                                                        }
                                                                    });
                                                            });
                                                        }
                                                    }
                                                    foo();
                                                    response['authCode'] = success_code;
                                                    response['status'] = success_status_value;
                                                    response['data_params'] = data.data_params;
                                                    response['msg'] = data_listed;
                                                    resolve(response);
                                                } else {
                                                    response['authCode'] = error_code;
                                                    response['status'] = failure_status_value;
                                                    response['msg'] = body['msg'];
                                                    response['msgSoa'] = "Please fill all required param for SOA.";
                                                    reject(response);
                                                }

                                            } else {
                                                response['authCode'] = error_code;
                                                response['status'] = failure_status_value;
                                                response['msg'] = "Some error in data fetching.";
                                                reject(response);
                                            }
                                        });

                                    }
                                })


                        } else {
                            //hh
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    })

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },


    ODRdatafromurl: function (req) {
        return new Promise(function (resolve, reject) {

            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";

            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {



                utils.db.executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            const https = require('https')

                            //console.log(req.protocol + '://' + req.headers.host+ '/users/YTDSoa');

                            var reqs = require('request');

                            reqs.post({
                                url: req.protocol + '://' + req.headers.host + '/users/ODRSoa',
                                form: { "userId": userId, "account_number": account_number },
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token
                                },
                                method: 'POST'
                            },

                                function (e, r, body) {
                                    //  console.log(body.authCode);
                                    if (body) {

                                        var data = JSON.parse(body);
                                        data = data.data_params;
                                        /// console.log(data);
                                        var ytdCons = {
                                            accountNumber: data.accountNumber,
                                            meterBadgeNumber: data.meterBadgeNumber,
                                            meterSerialNumber: data.meterSerialNumber,
                                            latestConsumption: data.latestConsumption,
                                            createdOn: data.createdOn,
                                            modifiedOn: data.modifiedOn,
                                        };

                                        ConsumptionODR.find({
                                            accountNumber: data.accountNumber,
                                            createdOn: data.createdOn
                                        },
                                            function (e10, dataval) {
                                                if (dataval && dataval.length) {

                                                    response['data_params'] = ytdCons;
                                                    response['authCode'] = success_code;
                                                    response['msg'] = data_listed;
                                                    response['status'] = success_status_value;
                                                    resolve(response);
                                                } else {
                                                    ConsumptionODRs = new ConsumptionODR(ytdCons);
                                                    ConsumptionODRs.save(
                                                        function (err, rrr) {
                                                            if (err) {
                                                                response['authCode'] = err;
                                                                response['msg'] = "Data fetching problems.";
                                                                response['status'] = failure_status_value;
                                                                reject(response);
                                                            }
                                                            else if (rrr) {
                                                                // console.log("aa gya h2");
                                                                //console.log(json);
                                                                response['authCode'] = success_code;
                                                                response['status'] = success_status_value;
                                                                response['data_params'] = ytdCons;
                                                                response['msg'] = data_listed;
                                                                resolve(response);
                                                            }
                                                        });
                                                }
                                            })
                                    } else {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = "Some error in data fetching.";
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    ODRGetData: function (req) {
        return new Promise(function (resolve, reject) {
            // console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {

                var userId = req.body.userId ? req.body.userId : "";
                var account_number = req.body.account_number ? req.body.account_number : "";
                var response = {};

                // console.log(req.headers.token)
                if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                    utils.db.executeQuery('SELECT * FROM users JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? LIMIT 1', [userId])
                        .then(function (result) { // fetch user details
                            if (result.length > 0) {

                                var today = new Date();
                                var curM = today.getMonth() + 1;
                                var curD = today.getDate() - 1;
                                var yesterDay = today.getFullYear() + '-' + curM + '-' + (curD) + " 00:00:00.000";
                                //   console.log(curD);
                                ConsumptionODR.aggregate(
                                    [
                                        {
                                            $match: {
                                                "accountNumber": account_number,
                                                /*  "createdOn": {
                                                      $gte: new Date(yesterDay),
                                                    //  $lte: new Date(toDay)
                                                  }*/
                                            }
                                        }, { $sort: { "_id": 1 } }
                                    ],

                                    function (e10, dataval) {
                                        if (dataval && dataval.length) {
                                            response['data_params'] = dataval[0];
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        } else {
                                            var data_param = {
                                                "createdOn": "",
                                                "modifiedOn": ""
                                                , "accountNumber": account_number,
                                                "meterBadgeNumber": "",
                                                "meterSerialNumber": "",
                                                "latestConsumption": "0.00",
                                            }
                                            response['data_params'] = data_param;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                    })

                            } else {
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = user_is_not_exits;
                                reject(response);
                            }

                        })

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    //odr ends



    ///odr start
    ODRyearly: function (req) {
        return new Promise(function (resolve, reject) {
            //   console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var year = req.body.year ? req.body.year : "";

            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)
                && utils.str.is_not_empty(year)
            ) {

                var data_param = {
                    "data_params": [{ "month": 1, "consumption": 0 },
                    { "month": 2, "consumption": 0 }, { "month": 3, "consumption": 0 },
                    { "month": 4, "consumption": 0 },
                    { "month": 5, "consumption": 0 },
                    { "month": 6, "consumption": 0 },
                    { "month": 7, "consumption": 0 },
                    { "month": 8, "consumption": 174.995 },
                    { "month": 9, "consumption": 189.978 },
                    { "month": 10, "consumption": 976.998 },
                    { "month": 11, "consumption": 0 },
                    { "month": 12, "consumption": 0 }]
                };

                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data_param;
                response['msg'] = data_listed;
                resolve(response);
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },


    ODRYearlyfromurl: function (req) {
        return new Promise(function (resolve, reject) {

            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var year = req.body.year ? req.body.year : "";
            /*   var month = req.body.month ? req.body.month : "";
               var consumption = req.body.consumption ? req.body.consumption : "";
               
               */

            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)
                && utils.str.is_not_empty(year)
            ) {


                utils.db.executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            const https = require('https');
                            //console.log(req.protocol + '://' + req.headers.host+ '/users/YTDSoa');
                            var reqs = require('request');
                            reqs.post({
                                url: req.protocol + '://' + req.headers.host + '/users/ODRyearly',
                                form: { "userId": userId, "account_number": account_number, 'year': year },
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token
                                },
                                method: 'POST'
                            },
                                function (e, r, body) {
                                    //  console.log(body.authCode);
                                    if (body) {
                                        var data = JSON.parse(body);
                                        console.log(data);
                                        return
                                        data = data.data_params;
                                        /// console.log(data);
                                        var yearlyCons = {
                                            accountNumber: account_number,
                                            month: data.month,
                                            year: year,
                                            consumption: data.consumption,
                                            userId: userId
                                        };
                                        ConsumptionYear.find({
                                            accountNumber: data.accountNumber,
                                            userId: userId,
                                            year: year,
                                        },
                                            function (e10, dataval) {
                                                if (dataval && dataval.length) {

                                                    response['data_params'] = yearlyCons;
                                                    response['authCode'] = success_code;
                                                    response['msg'] = data_listed;
                                                    response['status'] = success_status_value;
                                                    resolve(response);
                                                } else {
                                                    console.log(yearlyCons);
                                                    return;
                                                    ConsumptionYears = new ConsumptionYear(yearlyCons);
                                                    ConsumptionYears.save(
                                                        function (err, rrr) {
                                                            if (err) {
                                                                response['authCode'] = err;
                                                                response['msg'] = "Data fetching problems.";
                                                                response['status'] = failure_status_value;
                                                                reject(response);
                                                            }
                                                            else if (rrr) {
                                                                // console.log("aa gya h2");
                                                                //console.log(json);
                                                                response['authCode'] = success_code;
                                                                response['status'] = success_status_value;
                                                                response['data_params'] = yearlyCons;
                                                                response['msg'] = data_listed;
                                                                resolve(response);
                                                            }
                                                        });
                                                }
                                            })
                                    } else {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = "Some error in data fetching.";
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    //odr ends

    monthlyDataFromurlAutomatic: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            if (req.body) {

                var data = req.body;
                //  console.log(data.yearlydata);
                var account_numberReq = data.account_number ? data.account_number : "";
                var yearlydataReq = data.yearlydata ? data.yearlydata : [];
                if (utils.str.is_not_empty(account_numberReq) && utils.str.is_not_empty(yearlydataReq)
                ) {
                    async function foo() {



                        var array = yearlydataReq;

                        for (var i = 0; i < array.length; i++) {
                            await new Promise(next => {
                                //    console.log(array[i]);
                                //    return;

                                const mth = array[i].month;
                                const yr = array[i].year;

                                ConsumptionYear.find({ accountNumber: account_numberReq, month: mth, year: yr },
                                    function (ee, rrr) {
                                        //  console.log("1");
                                        if (rrr && rrr.length > 0) {
                                            // console.log("2");
                                            next()
                                        }
                                        else if (ee) {
                                            //console.log("3");
                                            next()
                                        }
                                        else {
                                            var ytdCons = {
                                                accountNumber: account_numberReq,
                                                month: mth,
                                                year: yr,
                                                consumption: array[i].consumption
                                            };
                                            var ConsumptionYears = new ConsumptionYear(ytdCons);
                                            //    console.log(json);
                                            //    return;                    
                                            ConsumptionYears.save(function (er, rr) {
                                                next();
                                            });

                                        }
                                    })


                            })
                        }
                    }

                    foo();

                    response['authCode'] = success_code;
                    response['status'] = success_status_value;
                    response['data_params'] = yearlydataReq;
                    //data_params":[{
                    response['msg'] = "listed successfully.";
                    //  console.log("here");
                    resolve(response);

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }



            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Some error in data fetching.";
                reject(response);

            }
        });
    },

    monthlyGetData: function (req) {
        return new Promise(function (resolve, reject) {
            // console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {

                var userId = req.body.userId ? req.body.userId : "";
                var account_number = req.body.account_number ? req.body.account_number : "";
                var yearReq = req.body.year ? req.body.year : "";
                var response = {};

                // console.log(req.headers.token)
                if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId) && utils.str.is_not_empty(yearReq)) {
                    utils.db.executeQuery('SELECT * FROM users INNER JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                        .then(function (result) { // fetch user details
                            if (result.length > 0) {
                                ConsumptionYear.aggregate(
                                    [
                                        {
                                            $match: {
                                                "accountNumber": account_number,
                                                year: yearReq
                                            }
                                        }, { $sort: { "_id": 1 } }
                                    ],

                                    function (e10, dataval) {
                                        if (dataval && dataval.length) {
                                            response['data_params'] = dataval;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        } else {
                                            var data_param = [
                                                { "year": "2018", "month": 1, "consumption": 0 },
                                                { "year": "2018", "month": 2, "consumption": 0 },
                                                { "year": "2018", "month": 3, "consumption": 0 },
                                                { "year": "2018", "month": 4, "consumption": 0 },
                                                { "year": "2018", "month": 5, "consumption": 0 },
                                                { "year": "2018", "month": 6, "consumption": 0 },
                                                { "year": "2018", "month": 7, "consumption": 0 },
                                                { "year": "2018", "month": 8, "consumption": 0 },
                                                { "year": "2018", "month": 9, "consumption": 0 },
                                                { "year": "2018", "month": 10, "consumption": 0 },
                                                { "year": "2018", "month": 11, "consumption": 0 },
                                                { "year": "2018", "month": 12, "consumption": 0 }
                                            ]
                                            response['data_params'] = data_param;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                    })

                            } else {
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = user_is_not_exits;
                                reject(response);
                            }

                        })

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },



    dailyDataFromurlAutomatic: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            if (req.body) {

                var data = req.body;
                //  console.log(data.yearlydata);
                var account_numberReq = data.account_number ? data.account_number : "";
                var dailydataReq = data.dailydata ? data.dailydata : [];
                if (utils.str.is_not_empty(account_numberReq) && utils.str.is_not_empty(dailydataReq)
                ) {
                    async function foo() {



                        var array = dailydataReq;

                        for (var i = 0; i < array.length; i++) {
                            await new Promise(next => {
                                //    console.log(array[i]);
                                //    return;

                                const mth = array[i].month;
                                const days = array[i].day;
                                const years = array[i].year;

                                DailyConsumption.find({
                                    accountNumber: account_numberReq,
                                    month: mth, day: days, year: years
                                },
                                    function (ee, rrr) {
                                        //  console.log("1");
                                        if (rrr && rrr.length > 0) {
                                            // console.log("2");
                                            next()
                                        }
                                        else if (ee) {
                                            //console.log("3");
                                            next()
                                        }
                                        else {
                                            var ytdCons = {
                                                accountNumber: account_numberReq,
                                                day: days,
                                                month: mth,
                                                year: years,
                                                consumption: array[i].consumption
                                            };
                                            var DailyConsumptions = new DailyConsumption(ytdCons);
                                            DailyConsumptions.save(function (er, rr) {
                                                next();
                                            });

                                        }
                                    })


                            })
                        }
                    }

                    foo();

                    response['authCode'] = success_code;
                    response['status'] = success_status_value;
                    response['data_params'] = dailydataReq;
                    //data_params":[{
                    response['msg'] = "listed successfully.";
                    //  console.log("here");
                    resolve(response);

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }



            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Some error in data fetching.";
                reject(response);

            }
        });
    },

    dailyGetData: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var months = req.body.month ? req.body.month : "";
            var yearReq = req.body.year ? req.body.year : "";
            var response = {};

            // console.log(req.headers.token)
            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)
                && utils.str.is_not_empty(months) && utils.str.is_not_empty(yearReq)
            ) {
                utils.db.executeQuery('SELECT * FROM users INNER JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            DailyConsumption.aggregate(
                                [
                                    {
                                        $match: {
                                            "accountNumber": account_number,
                                            "month": months,
                                            "year": yearReq

                                        }
                                    }, { $sort: { "_id": 1 } },
                                    {
                                        $project: {
                                            "accountNumber": 1, "day": 1,
                                            "month": 1, "year": 1,
                                            "consumption": 1
                                        }
                                    }
                                ],

                                function (e10, dataval) {
                                    //console.log
                                    if (dataval && dataval.length) {
                                        response['data_params'] = dataval;
                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    } else {
                                        var data_param = [
                                            { "year": yearReq, "month": months, "day": 1, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 2, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 3, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 4, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 5, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 6, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 7, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 8, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 9, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 10, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 11, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 12, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 13, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 14, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 15, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 16, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 17, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 18, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 19, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 20, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 21, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 22, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 23, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 24, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 25, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 26, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 27, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 28, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 29, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 30, "consumption": 0 },
                                            { "year": yearReq, "month": months, "day": 31, "consumption": 0 }]

                                        response['data_params'] = data_param;
                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    }
                                })

                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }

                    })

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }


        });
    },

    //hourly start 
    hourlyDataFromurlAutomatic: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            if (req.body) {

                var data = req.body;
                //  console.log(data.yearlydata);
                var account_numberReq = data.account_number ? data.account_number : "";
                var hourlydataReq = data.hourlydata ? data.hourlydata : [];


                if (utils.str.is_not_empty(account_numberReq) && utils.str.is_not_empty(hourlydataReq)
                ) {
                    async function foo() {
                        var array = hourlydataReq;

                        for (var i = 0; i < array.length; i++) {
                            await new Promise(next => {
                                //    console.log(array[i]);
                                //    return;

                                const mth = array[i].month;
                                const days = array[i].day;
                                const hrs = array[i].hour;
                                const yrs = array[i].year;

                                HourlyConsumption.find({
                                    accountNumber: account_numberReq,
                                    month: mth, day: days,
                                    year: yrs,
                                    hour: hrs,
                                    day: days
                                },
                                    function (ee, rrr) {
                                        //  console.log("1");
                                        if (rrr && rrr.length > 0) {
                                            // console.log("2");
                                            next()
                                        }
                                        else if (ee) {
                                            //console.log("3");
                                            next()
                                        }
                                        else {
                                            var ytdCons = {
                                                accountNumber: account_numberReq,
                                                day: days,
                                                month: mth,
                                                year: yrs,
                                                hour: hrs,
                                                consumption: array[i].consumption
                                            };
                                            var HourlyConsumptions = new HourlyConsumption(ytdCons);
                                            //    console.log(json);
                                            //    return;                    
                                            HourlyConsumptions.save(function (er, rr) {
                                                next();
                                            });

                                        }
                                    })


                            })
                        }
                    }

                    foo();

                    response['authCode'] = success_code;
                    response['status'] = success_status_value;
                    response['data_params'] = hourlydataReq;
                    //data_params":[{
                    response['msg'] = "listed successfully.";
                    //  console.log("here");
                    resolve(response);

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }



            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Some error in data fetching.";
                reject(response);

            }
        });
    },

    hourlyGetData: function (req) {
        return new Promise(function (resolve, reject) {
            // console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {

                var userId = req.body.userId ? req.body.userId : "";
                var account_number = req.body.account_number ? req.body.account_number : "";
                var months = req.body.month ? req.body.month : "";
                var days = req.body.day ? req.body.day : "";
                var years = req.body.year ? req.body.year : "";
                var response = {};

                // console.log(req.headers.token)
                if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)
                    && utils.str.is_not_empty(months)
                    && utils.str.is_not_empty(days)
                    && utils.str.is_not_empty(years)

                ) {
                    utils.db.executeQuery('SELECT * FROM users INNER JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                        .then(function (result) { // fetch user details
                            if (result.length > 0) {
                                HourlyConsumption.aggregate(
                                    [
                                        {
                                            $match: {
                                                "accountNumber": account_number,
                                                "month": months,
                                                "day": days,
                                                "year": years

                                            }
                                        }, { $sort: { "hour": 1 } },
                                        {
                                            $project: {
                                                "accountNumber": 1, "day": 1,
                                                "month": 1, "consumption": 1, "year": 1, "hour": 1
                                            }
                                        }
                                    ],

                                    function (e10, dataval) {
                                        if (dataval && dataval.length) {
                                            response['data_params'] = dataval;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        } else {
                                            var data_param = [
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 0,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 1,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 2,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 3,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 4,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 5,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 6,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 7,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 8,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 9,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 10,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": months,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 12,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 13,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 14,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 15,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 16,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 17,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 18,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 19,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": days,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 21,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 22,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "day": days,
                                                    "hour": 23,
                                                    "consumption": 0
                                                }
                                            ]
                                            response['data_params'] = data_param;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                    })

                            } else {
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = user_is_not_exits;
                                reject(response);
                            }

                        })

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    //hourly ends

    ///yearly start
    //hourly start 
    allYearlyDataFromurlAutomatic: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            if (req.body) {

                var data = req.body;
                //  console.log(data.yearlydata);
                var account_numberReq = data.account_number ? data.account_number : "";
                var allYearDataaReq = data.allYearData ? data.allYearData : [];


                if (utils.str.is_not_empty(account_numberReq) && utils.str.is_not_empty(allYearDataaReq)
                ) {
                    async function foo() {
                        var array = allYearDataaReq;

                        for (var i = 0; i < array.length; i++) {
                            await new Promise(next => {
                                //    console.log(array[i]);
                                //    return;


                                const yrs = array[i].year;
                                const consumptions = array[i].consumption;

                                AllYearsConsumption.find({
                                    accountNumber: account_numberReq,

                                    year: yrs,

                                },
                                    function (ee, rrr) {
                                        //  console.log("1");
                                        if (rrr && rrr.length > 0) {
                                            // console.log("2");
                                            next()
                                        }
                                        else if (ee) {
                                            //console.log("3");
                                            next()
                                        }
                                        else {
                                            var ytdCons = {
                                                accountNumber: account_numberReq,
                                                consumption: consumptions,
                                                year: yrs,

                                            };
                                            var AllYearsConsumptions = new AllYearsConsumption(ytdCons);
                                            //    console.log(json);
                                            //    return;                    
                                            AllYearsConsumptions.save(function (er, rr) {
                                                next();
                                            });

                                        }
                                    })


                            })
                        }
                    }

                    foo();

                    response['authCode'] = success_code;
                    response['status'] = success_status_value;
                    response['data_params'] = allYearDataaReq;
                    //data_params":[{
                    response['msg'] = "listed successfully.";
                    //  console.log("here");
                    resolve(response);

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }



            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Some error in data fetching.";
                reject(response);

            }
        });
    },

    allYearGetData: function (req) {
        return new Promise(function (resolve, reject) {
            // console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {

                var userId = req.body.userId ? req.body.userId : "";
                var account_number = req.body.account_number ? req.body.account_number : "";

                var response = {};

                // console.log(req.headers.token)
                if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)


                ) {
                    utils.db.executeQuery('SELECT * FROM users INNER JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                        .then(function (result) { // fetch user details
                            if (result.length > 0) {
                                AllYearsConsumption.aggregate(
                                    [
                                        {
                                            $match: {
                                                "accountNumber": account_number,


                                            }
                                        }, { $sort: { "_id": 1 } },
                                        {
                                            $project: {
                                                "accountNumber": 1,
                                                "consumption": 1, "year": 1
                                            }
                                        }
                                    ],

                                    function (e10, dataval) {
                                        if (dataval && dataval.length) {
                                            response['data_params'] = dataval;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        } else {
                                            var data_param = [
                                                {
                                                    "year": 2018,

                                                    "consumption": 0
                                                },
                                            ]
                                            response['data_params'] = data_param;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                    })

                            } else {
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = user_is_not_exits;
                                reject(response);
                            }

                        })

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    ///yearly ends
    //weekly start 
    weeklyDataFromurlAutomatic: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            if (req.body) {

                var data = req.body;
                //  console.log(data.yearlydata);
                var account_numberReq = data.account_number ? data.account_number : "";
                var yearReq = data.year ? data.year : "";
                var monthReq = data.month ? data.month : "";
                var weeklyReq = data.weekly_date ? data.weekly_date : [];


                if (utils.str.is_not_empty(account_numberReq) && utils.str.is_not_empty(weeklyReq)
                    && utils.str.is_not_empty(yearReq) && utils.str.is_not_empty(monthReq)
                ) {
                    async function foo() {
                        var array = weeklyReq;

                        for (var i = 0; i < array.length; i++) {
                            await new Promise(next => {
                                //    console.log(array[i]);
                                //    return;

                                const mth = array[i].month;

                                const weeks = array[i].week;
                                const yrs = array[i].year;

                                WeeklyConsumption.find({
                                    accountNumber: account_numberReq,
                                    month: mth,
                                    year: yrs,
                                    week: weeks,

                                },
                                    function (ee, rrr) {
                                        //  console.log("1");
                                        if (rrr && rrr.length > 0) {
                                            // console.log("2");
                                            next()
                                        }
                                        else if (ee) {
                                            //console.log("3");
                                            next()
                                        }
                                        else {
                                            var ytdCons = {
                                                accountNumber: account_numberReq,
                                                month: mth,
                                                year: yrs,
                                                week: weeks,
                                                consumption: array[i].consumption
                                            };
                                            var WeeklyConsumptions = new WeeklyConsumption(ytdCons);
                                            //    console.log(json);
                                            //    return;                    
                                            WeeklyConsumptions.save(function (er, rr) {
                                                next();
                                            });

                                        }
                                    })


                            })
                        }
                    }

                    foo();

                    response['authCode'] = success_code;
                    response['status'] = success_status_value;
                    response['data_params'] = weeklyReq;
                    //data_params":[{
                    response['msg'] = "listed successfully.";
                    //  console.log("here");
                    resolve(response);

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }



            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = "Some error in data fetching.";
                reject(response);

            }
        });
    },

    weeklyGetData: function (req) {
        return new Promise(function (resolve, reject) {
            // console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {

                var userId = req.body.userId ? req.body.userId : "";
                var account_number = req.body.account_number ? req.body.account_number : "";
                var months = req.body.month ? req.body.month : "";

                var years = req.body.year ? req.body.year : "";
                var response = {};

                // console.log(req.headers.token)
                if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)
                    && utils.str.is_not_empty(months)

                    && utils.str.is_not_empty(years)

                ) {
                    utils.db.executeQuery('SELECT * FROM users INNER JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                        .then(function (result) { // fetch user details
                            if (result.length > 0) {
                                WeeklyConsumption.aggregate(
                                    [
                                        {
                                            $match: {
                                                "accountNumber": account_number,
                                                "month": months,
                                                "year": years

                                            }
                                        }, { $sort: { "_id": 1 } },
                                        {
                                            $project: {
                                                "accountNumber": 1, "week": 1,
                                                "month": 1, "consumption": 1, "year": 1
                                            }
                                        }
                                    ],

                                    function (e10, dataval) {
                                        if (dataval && dataval.length) {
                                            response['data_params'] = dataval;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        } else {
                                            var data_param = [
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "week": 1,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "week": 2,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "week": 3,
                                                    "consumption": 0
                                                },
                                                {
                                                    "year": years,
                                                    "month": months,
                                                    "week": 4,
                                                    "consumption": 0
                                                }
                                            ]
                                            response['data_params'] = data_param;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                    })

                            } else {
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = user_is_not_exits;
                                reject(response);
                            }

                        })

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    //weekly ends


    ///start soa
    ///odr start
    SOAMonthly: function (req) {
        return new Promise(function (resolve, reject) {
            //   console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                var data_param = [
                    { "consumption": 0, "month": 1, "year": "2018", "accountNumber": account_number },
                    { "consumption": 0, "month": 2, "year": "2018", "accountNumber": account_number },
                    { "consumption": 0, "month": 3, "year": "2018", "accountNumber": account_number },
                    { "consumption": 0, "month": 4, "year": "2018", "accountNumber": account_number },
                    { "consumption": 0, "month": 5, "year": "2018", "accountNumber": account_number },
                    { "consumption": 0, "month": 6, "year": "2018", "accountNumber": account_number },
                    { "consumption": 0, "month": 7, "year": "2018", "accountNumber": account_number },
                    { "consumption": 174.995, "month": 8, "year": "2018", "accountNumber": account_number },
                    { "consumption": 189.978, "month": 9, "year": "2018", "accountNumber": account_number },
                    { "consumption": 976.998, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "consumption": 0, "month": 11, "year": "2018", "accountNumber": account_number },
                    { "consumption": 0, "month": 12, "year": "2018", "accountNumber": account_number }
                ];

                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data_param;
                response['msg'] = data_listed;
                resolve(response);
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    SOAMonthlygetdata: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                utils.db.executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            //  const https = require('https');
                            var reqs = require('request');
                            reqs.post({
                                url: req.protocol + '://' + req.headers.host + '/users/SOAMonthly',
                                form: { "userId": userId, "accountNumber": account_number },
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token
                                },
                                method: 'POST'
                            },
                                function (e, r, body) {
                                    var body = JSON.parse(body);

                                    if (body && body.authCode != 100) {
                                        var data = body;
                                        async function foo() {
                                            var array = data['data_params'];
                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    var accountNumberJSON = array[i].accountNumber;
                                                    var monthJSON = array[i].month;
                                                    var yearJSON = array[i].year;
                                                    var consumptionJSON = array[i].consumption;
                                                    SoaMonthlyConsumption.find(
                                                        {
                                                            accountNumber: accountNumberJSON,
                                                            month: monthJSON, year: yearJSON
                                                        },
                                                        function (ee, rrr) {
                                                            if (rrr && rrr.length > 0) {
                                                                next()
                                                            }
                                                            else if (ee) {
                                                                next()
                                                            }
                                                            else {
                                                                var monthlyReq = {
                                                                    accountNumber: accountNumberJSON,
                                                                    month: monthJSON,
                                                                    year: yearJSON,
                                                                    consumption: consumptionJSON
                                                                };
                                                                var SoaMonthlyConsumptions = new SoaMonthlyConsumption(monthlyReq);
                                                                SoaMonthlyConsumptions.save();
                                                                next()
                                                            }
                                                        });
                                                });
                                            }
                                        }
                                        foo();
                                        response['authCode'] = success_code;
                                        response['status'] = success_status_value;
                                        response['data_params'] = data.data_params;
                                        response['msg'] = data_listed;
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = "Some error in data fetching.";
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },


    ODRdatafromurl: function (req) {
        return new Promise(function (resolve, reject) {

            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";

            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {



                utils.db.executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            const https = require('https')

                            //console.log(req.protocol + '://' + req.headers.host+ '/users/YTDSoa');

                            var reqs = require('request');

                            reqs.post({
                                url: req.protocol + '://' + req.headers.host + '/users/ODRSoa',
                                form: { "userId": userId, "account_number": account_number },
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token
                                },
                                method: 'POST'
                            },

                                function (e, r, body) {
                                    //  console.log(body.authCode);
                                    if (body) {

                                        var data = JSON.parse(body);
                                        data = data.data_params;
                                        /// console.log(data);
                                        var ytdCons = {
                                            accountNumber: data.accountNumber,
                                            meterBadgeNumber: data.meterBadgeNumber,
                                            meterSerialNumber: data.meterSerialNumber,
                                            latestConsumption: data.latestConsumption,
                                            createdOn: data.createdOn,
                                            modifiedOn: data.modifiedOn,
                                        };

                                        ConsumptionODR.find({
                                            accountNumber: data.accountNumber,
                                            createdOn: data.createdOn
                                        },
                                            function (e10, dataval) {
                                                if (dataval && dataval.length) {

                                                    response['data_params'] = ytdCons;
                                                    response['authCode'] = success_code;
                                                    response['msg'] = data_listed;
                                                    response['status'] = success_status_value;
                                                    resolve(response);
                                                } else {
                                                    ConsumptionODRs = new ConsumptionODR(ytdCons);
                                                    ConsumptionODRs.save(
                                                        function (err, rrr) {
                                                            if (err) {
                                                                response['authCode'] = err;
                                                                response['msg'] = "Data fetching problems.";
                                                                response['status'] = failure_status_value;
                                                                reject(response);
                                                            }
                                                            else if (rrr) {
                                                                // console.log("aa gya h2");
                                                                //console.log(json);
                                                                response['authCode'] = success_code;
                                                                response['status'] = success_status_value;
                                                                response['data_params'] = ytdCons;
                                                                response['msg'] = data_listed;
                                                                resolve(response);
                                                            }
                                                        });
                                                }
                                            })
                                    } else {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = "Some error in data fetching.";
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    ///end soa

    //start daily soa
    SOAdaily: function (req) {
        return new Promise(function (resolve, reject) {
            //   console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                var data_param = [
                    { "day": 1, "consumption": 80.608, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 2, "consumption": 86.282, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 3, "consumption": 83.618, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 4, "consumption": 100.014, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 5, "consumption": 5.848, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 6, "consumption": 83.77, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 7, "consumption": 125.536, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 8, "consumption": 92.094, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 9, "consumption": 133.964, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 10, "consumption": 45.142, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 11, "consumption": 8.75, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 12, "consumption": 42.663, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 13, "consumption": 45.42, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 14, "consumption": 41.809, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 15, "consumption": 13.91, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 16, "consumption": 2.268, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 17, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 18, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 19, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 20, "consumption": 2.924, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 21, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 22, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 23, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 24, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 25, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 26, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 27, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 28, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 29, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 30, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number },
                    { "day": 31, "consumption": 0, "month": 10, "year": "2018", "accountNumber": account_number }
                ];
                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data_param;
                response['msg'] = data_listed;
                resolve(response);
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    SOAdailygetdata: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                utils.db.executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            //  const https = require('https');
                            var reqs = require('request');
                            reqs.post({
                                url: req.protocol + '://' + req.headers.host + '/users/SOAdaily',
                                form: { "userId": userId, "accountNumber": account_number },
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token
                                },
                                method: 'POST'
                            },
                                function (e, r, body) {
                                    var body = JSON.parse(body);

                                    if (body && body.authCode != 100) {
                                        var data = body;
                                        async function foo() {
                                            var array = data['data_params'];
                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    var accountNumberJSON = array[i].accountNumber;
                                                    var monthJSON = array[i].month;
                                                    var yearJSON = array[i].year;
                                                    var consumptionJSON = array[i].consumption;
                                                    var dayJSON = array[i].day;
                                                    SoaDailyConsumption.find(
                                                        {
                                                            accountNumber: accountNumberJSON,
                                                            month: monthJSON,
                                                            year: yearJSON,
                                                            day: dayJSON
                                                        },
                                                        function (ee, rrr) {
                                                            if (rrr && rrr.length > 0) {
                                                                next()
                                                            }
                                                            else if (ee) {
                                                                next()
                                                            }
                                                            else {
                                                                var monthlyReq = {
                                                                    accountNumber: accountNumberJSON,
                                                                    month: monthJSON,
                                                                    year: yearJSON,
                                                                    day: dayJSON,
                                                                    consumption: consumptionJSON
                                                                };
                                                                var SoaDailyConsumptions = new SoaDailyConsumption(monthlyReq);
                                                                SoaDailyConsumptions.save();
                                                                next()
                                                            }
                                                        });
                                                });
                                            }
                                        }
                                        foo();
                                        response['authCode'] = success_code;
                                        response['status'] = success_status_value;
                                        response['data_params'] = data.data_params;
                                        response['msg'] = data_listed;
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = "Some error in data fetching.";
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    //end daily soa

    //soa hourly start 

    SOAhourly: function (req) {
        return new Promise(function (resolve, reject) {
            //   console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                var data_param = [
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 0,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 1,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 2,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 3,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 4,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 5,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 6,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 7,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 8,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 9,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 10,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 10,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 12,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 13,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 14,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 15,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 16,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 17,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 18,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 19,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 20,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 21,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 22,
                        "consumption": 0, "accountNumber": account_number
                    },
                    {
                        "year": "2018",
                        "month": 10,
                        "day": 20,
                        "hour": 23,
                        "consumption": 0, "accountNumber": account_number
                    }
                ];
                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data_param;
                response['msg'] = data_listed;
                resolve(response);
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    SOAhourlygetdata: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                utils.db.executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            //  const https = require('https');
                            var reqs = require('request');
                            reqs.post({
                                url: req.protocol + '://' + req.headers.host + '/users/SOAhourly',
                                form: { "userId": userId, "accountNumber": account_number },
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token
                                },
                                method: 'POST'
                            },
                                function (e, r, body) {
                                    var body = JSON.parse(body);

                                    if (body && body.authCode != 100) {
                                        var data = body;
                                        async function foo() {
                                            var array = data['data_params'];
                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    var accountNumberJSON = array[i].accountNumber;
                                                    var monthJSON = array[i].month;
                                                    var yearJSON = array[i].year;
                                                    var consumptionJSON = array[i].consumption;
                                                    var dayJSON = array[i].day;
                                                    var hourJSON = array[i].hour;
                                                    SoaHourlyConsumption.find(
                                                        {
                                                            accountNumber: accountNumberJSON,
                                                            month: monthJSON,
                                                            year: yearJSON,
                                                            day: dayJSON,
                                                            hour: hourJSON,
                                                        },
                                                        function (ee, rrr) {
                                                            if (rrr && rrr.length > 0) {
                                                                next()
                                                            }
                                                            else if (ee) {
                                                                next()
                                                            }
                                                            else {
                                                                var monthlyReq = {
                                                                    accountNumber: accountNumberJSON,
                                                                    month: monthJSON,
                                                                    year: yearJSON,
                                                                    day: dayJSON,
                                                                    hour: hourJSON,
                                                                    consumption: consumptionJSON
                                                                };
                                                                var SoaHourlyConsumptions = new SoaHourlyConsumption(monthlyReq);
                                                                SoaHourlyConsumptions.save();
                                                                next()
                                                            }
                                                        });
                                                });
                                            }
                                        }
                                        foo();
                                        response['authCode'] = success_code;
                                        response['status'] = success_status_value;
                                        response['data_params'] = data.data_params;
                                        response['msg'] = data_listed;
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = "Some error in data fetching.";
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    //soa hourly ends

    //soa yearly
    SOAyearly: function (req) {
        return new Promise(function (resolve, reject) {
            //   console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                var data_param = [{ "year": "2014", "consumption": 132.69, "accountNumber": account_number },
                { "year": "2015", "consumption": 365.36, "accountNumber": account_number },
                { "year": "2016", "consumption": 69.63, "accountNumber": account_number },
                { "year": "2017", "consumption": 88.63, "accountNumber": account_number },
                { "year": "2018", "consumption": 205, "accountNumber": account_number }
                ];
                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data_param;
                response['msg'] = data_listed;
                resolve(response);
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    SOAyearlygetdata: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                utils.db.executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            //  const https = require('https');
                            var reqs = require('request');
                            reqs.post({
                                url: req.protocol + '://' + req.headers.host + '/users/SOAyearly',
                                form: { "userId": userId, "accountNumber": account_number },
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token
                                },
                                method: 'POST'
                            },
                                function (e, r, body) {
                                    var body = JSON.parse(body);

                                    if (body && body.authCode != 100) {
                                        var data = body;
                                        async function foo() {
                                            var array = data['data_params'];
                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    var accountNumberJSON = array[i].accountNumber;
                                                    var yearJSON = array[i].year;
                                                    var consumptionJSON = array[i].consumption;

                                                    SoaYearlyConsumption.find(
                                                        {
                                                            accountNumber: accountNumberJSON,
                                                            year: yearJSON,
                                                        },
                                                        function (ee, rrr) {
                                                            if (rrr && rrr.length > 0) {
                                                                next()
                                                            }
                                                            else if (ee) {
                                                                next()
                                                            }
                                                            else {
                                                                var monthlyReq = {
                                                                    accountNumber: accountNumberJSON,
                                                                    year: yearJSON,
                                                                    consumption: consumptionJSON
                                                                };
                                                                var SoaYearlyConsumptions = new SoaYearlyConsumption(monthlyReq);
                                                                SoaYearlyConsumptions.save();
                                                                next()
                                                            }
                                                        });
                                                });
                                            }
                                        }
                                        foo();
                                        response['authCode'] = success_code;
                                        response['status'] = success_status_value;
                                        response['data_params'] = data.data_params;
                                        response['msg'] = data_listed;
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = "Some error in data fetching.";
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    //soa ends yearly

    //soa weekly
    SOAweekly: function (req) {
        return new Promise(function (resolve, reject) {
            //   console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                var data_param = [
                    {
                        "week": 1,
                        "consumption": "13.65",
                        "year": 2018,
                        "month": 11, "accountNumber": account_number
                    },
                    {
                        "week": 2,
                        "consumption": "56.36",
                        "year": 2018,
                        "month": 11, "accountNumber": account_number
                    },
                    {
                        "week": 3,
                        "consumption": "98.63",
                        "year": 2018,
                        "month": 11, "accountNumber": account_number
                    },
                    {
                        "week": 4,
                        "consumption": "10.26",
                        "year": 2018,
                        "month": 11, "accountNumber": account_number
                    }
                ];
                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data_param;
                response['msg'] = data_listed;
                resolve(response);
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    SOAweeklygetdata: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                utils.db.executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            //  const https = require('https');
                            var reqs = require('request');
                            reqs.post({
                                url: req.protocol + '://' + req.headers.host + '/users/SOAweekly',
                                form: { "userId": userId, "accountNumber": account_number },
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token
                                },
                                method: 'POST'
                            },
                                function (e, r, body) {
                                    var body = JSON.parse(body);

                                    if (body && body.authCode != 100) {
                                        var data = body;
                                        async function foo() {
                                            var array = data['data_params'];
                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    var accountNumberJSON = array[i].accountNumber;
                                                    var yearJSON = array[i].year;
                                                    var monthJSON = array[i].month;
                                                    var weekJSON = array[i].week;
                                                    var consumptionJSON = array[i].consumption;

                                                    SOAWeeklyConsumption.find(
                                                        {
                                                            accountNumber: accountNumberJSON,
                                                            year: yearJSON,
                                                            month: monthJSON,
                                                            week: weekJSON
                                                        },
                                                        function (ee, rrr) {
                                                            if (rrr && rrr.length > 0) {
                                                                next()
                                                            }
                                                            else if (ee) {
                                                                next()
                                                            }
                                                            else {
                                                                var monthlyReq = {
                                                                    accountNumber: accountNumberJSON,
                                                                    year: yearJSON,
                                                                    month: monthJSON,
                                                                    week: weekJSON,
                                                                    consumption: consumptionJSON
                                                                };
                                                                var SOAWeeklyConsumptions = new SOAWeeklyConsumption(monthlyReq);
                                                                SOAWeeklyConsumptions.save();
                                                                next()
                                                            }
                                                        });
                                                });
                                            }
                                        }
                                        foo();
                                        response['authCode'] = success_code;
                                        response['status'] = success_status_value;
                                        response['data_params'] = data.data_params;
                                        response['msg'] = data_listed;
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = "Some error in data fetching.";
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    //soa ends weekly

    SOAbilling: function (req) {
        return new Promise(function (resolve, reject) {
            //  console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                //SOABilling
                Billing.find({ accountNumber: account_number },
                    function (err, res) {
                        if (res.length > 0) {
                            response['data_params'] = res;
                            response['authCode'] = success_code;
                            response['msg'] = data_listed;
                            response['status'] = success_status_value;
                            resolve(response);
                        } else if (err) {
                            response['authCode'] = error_code;
                            response['msg'] = er;
                            response['status'] = failure_status_value;
                            reject(response);
                            throw error;
                        }
                        else {
                            response['data_params'] = res;
                            response['authCode'] = error_code;
                            response['msg'] = "No data found.";
                            response['status'] = failure_status_value;
                            resolve(response);
                        }

                    })

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    SOAbillingforsave: function (req) {
        return new Promise(function (resolve, reject) {
            //  console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                //SOABilling
                var data_param = [
                    {
                        "bill_number": 23,
                        "billing_date": "02-06-2018",
                        "meter_reading_date": "02-07-2018",
                        "meter_reading": 320,
                        "consumption_units": 1700,
                        "numberOfDays": 60,
                        "bill_amount": 12507,
                        "due_date": "05-08-2018",
                        "receipt_no": 3698,
                        "payment_date": "04-08-2018",
                        "bill_paid": 12507
                    }
                ]

                response['authCode'] = success_code;
                response['status'] = success_status_value;
                response['data_params'] = data_param;
                response['msg'] = data_listed;
                resolve(response);
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },


    SOAbillingadddata: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                utils.db.executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            //  const https = require('https');
                            var reqs = require('request');

                            var hosts = '';
                            if (req.headers.host == "103.249.98.101:3002") {
                                hosts = "10.10.167.8:3002";
                            } else {
                                hosts = req.headers.host;
                            }
                            reqs.post({
                                url: req.protocol + '://' + hosts + '/users/SOAbillingforsave',
                                form: { "userId": userId, "accountNumber": account_number },
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token
                                },
                                method: 'POST'
                            },
                                function (e, r, body) {
                                    var body = JSON.parse(body);

                                    if (body && body.authCode != 100) {
                                        var data = body;
                                        async function foo() {
                                            var array = data['data_params'];
                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    var accountNumberJSON = account_number;
                                                    var billJSON = array[i].bill_number;
                                                    var billingDateJSON = array[i].billing_date;

                                                    var meterReadingDateJSON = array[i].meter_reading_date;
                                                    var meterReadingJSON = array[i].meter_reading;
                                                    var consumptionUnitJSON = array[i].consumption_units;
                                                    var numberOfDaysJSON = array[i].numberOfDays;
                                                    var billAmountJSON = array[i].bill_amount;
                                                    var dueDateJSON = array[i].due_date;
                                                    var receiptNoJSON = array[i].receipt_no;
                                                    var paymentDateJSON = array[i].payment_date;
                                                    var billPaidJSON = array[i].bill_paid;




                                                    Billing.find(
                                                        {
                                                            accountNumber: accountNumberJSON,
                                                            bill_number: billJSON,

                                                        },
                                                        function (ee, rrr) {
                                                            if (rrr && rrr.length > 0) {
                                                                next()
                                                            }
                                                            else if (ee) {
                                                                next()
                                                            }
                                                            else {
                                                                var monthlyReq = {
                                                                    accountNumber: accountNumberJSON,
                                                                    bill_number: billJSON,
                                                                    billing_date: billingDateJSON,
                                                                    meter_reading_date: meterReadingDateJSON,
                                                                    meter_reading: meterReadingJSON,
                                                                    consumption_units: consumptionUnitJSON,
                                                                    numberOfDays: numberOfDaysJSON,
                                                                    bill_amount: billAmountJSON,
                                                                    due_date: dueDateJSON,
                                                                    receipt_no: receiptNoJSON,
                                                                    payment_date: paymentDateJSON,
                                                                    bill_paid: billPaidJSON
                                                                };
                                                                var Billings = new Billing(monthlyReq);
                                                                Billings.save();
                                                                next()
                                                            }
                                                        });
                                                });
                                            }
                                        }
                                        foo();
                                        response['authCode'] = success_code;
                                        response['status'] = success_status_value;
                                        response['data_params'] = data.data_params;
                                        response['msg'] = data_listed;
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = "Some error in data fetching.";
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    });
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    //Energy tips
    contentData: function (req) {

        return new Promise(function (resolve, reject) {

            var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.accountToken ? req.body.accountToken : "";

            //  var device_token = req.body.device_token;
            var response = {};
            if (utils.str.is_not_empty(userId)) {

                var st = 1;
                utils.db.executeQuery(
                    'SELECT * FROM contents where status = ?', [st]).
                    then(function (resultl) {
                        if (resultl && resultl.length) {
                            response['data_params'] = resultl;
                            //   response['data_params']['consumptionDetails'] = rVal;
                            response['authCode'] = success_code;
                            response['msg'] = data_listed;
                            response['status'] = success_status_value;
                            resolve(response);
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = "Data not found.";
                            reject(response);
                        }

                    })

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    addAccount: function (req) {
        return new Promise(function (resolve, reject) {

            var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.account_number ? req.body.account_number : "";

            var response = {};
            // console.log(req.headers.token)

            if (utils.str.is_not_empty(accountId) && utils.str.is_not_empty(userId)) {
                var current_datetime = require('moment')().format('YYYY-MM-DD HH:mm:ss');
                var userIds = Buffer.from(userId.toString(), 'base64').toString('ascii');
                // var accountIds = Buffer.from(accountId.toString(), 'base64').toString('ascii');
                var userIds = Buffer.from(userId.toString(), 'base64').toString('ascii');
                // console.log(userIds);
                // return;
                // console.log("SELECT users.id as profileId,users.mobile,users.first_name,users.last_name,users.username,users.email,users.area,user_accounts.id,user_accounts.user_id,user_accounts.account_number,user_accounts.account_name,user_accounts.billing_address,user_accounts.billing_amount,user_accounts.billing_due_date,user_accounts.ebill,user_accounts.mobilebill,account_type,user_accounts.status,user_accounts.premise_address,user_accounts.sanctioned_load,user_accounts.supply_type,user_accounts.division,user_accounts.subdivision,user_accounts.bill_route FROM user_accounts JOIN users ON user_accounts.user_id = users.id WHERE user_accounts.account_number = ?");
                utils.db.executeQuery(
                    'SELECT users.id as profileId,users.mobile,users.first_name,users.last_name,users.username,users.email,users.area,user_accounts.id,user_accounts.user_id,user_accounts.account_number,user_accounts.account_name,user_accounts.billing_address,user_accounts.billing_amount,user_accounts.billing_due_date,user_accounts.ebill,user_accounts.mobilebill,account_type,user_accounts.status,user_accounts.premise_address,user_accounts.sanctioned_load,user_accounts.supply_type,user_accounts.division,user_accounts.subdivision,user_accounts.bill_route FROM user_accounts JOIN users ON user_accounts.user_id = users.id WHERE user_accounts.account_number = ?', [accountId]).
                    then(function (result) { // checking if acccount number is alrealdy occupied by someone else

                        //console.log(this.sql);
                        // fetch user details
                        if (result.length > 0) {
                            // show error This account number has used by someone else, please try using another account.
                            if (result[0].profileId == userIds) { // if occupied by user 
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = account_is_already_exits;

                            } else { // if occupied by someone else
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = account_already_used_by_someone_else;

                            }
                            reject(response);
                        } else {

                            let data = accountId;
                            let buff = new Buffer(data);
                            let base64data = buff.toString('base64');

                            //   console.log('"' + data + '" converted to Base64 is "' + base64data + '"');


                            // var encode_account_number = buff.toString('base64');
                            // console.log(encode_account_number);
                            // return;

                            var hosts = '';
                            if (req.headers.host == "103.249.98.101:3002") {
                                hosts = "10.10.167.8:3002";
                            } else {
                                hosts = req.headers.host;
                            }

                            console.log(hosts);
                            // return;
                            // console.log(req.protocol);
                            // console.log("=========>");
                            // console.log(req.headers.host);

                            // return;
                            //10.10.167.8:3002/users/SOAaddAccount


                            var reqs = require('request');
                            reqs.post({
                                url: req.protocol + '://' + hosts + '/users/SOAaddAccountforinternal',
                                form: { "profileToken": userId, "account_number": accountId },
                                headers: {
                                    //'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'token': req.headers.token,
                                    "Authorization": req.headers.authorization
                                },
                                method: 'POST',
                                timeout: 60 * 1000,

                            }, function (e, r, body) {
                                // console.log(e);
                                // console.log("=======>");
                                // console.log(body);
                                // return;

                                var data = JSON.parse(body);
                                data = data.data_params;
                                if (data) {


                                    // console.log(data);
                                    // return;
                                    var nameReq = data.account_name ? data.account_name : '';
                                    var billingAddressReq = data.billing_address ? data.billing_address : '';
                                    var billingAmountReq = data.billing_amount ? data.billing_amount : '';
                                    var premiseAddressReq = data.premise_address ? data.premise_address : '';
                                    var sanctionedLoadReq = data.sanctioned_load ? data.sanctioned_load : '';
                                    var divisionReq = data.division ? data.division : '';
                                    var subdivisionnReq = data.subdivision ? data.subdivision : '';
                                    var billRouteReq = data.bill_route ? data.bill_route : '';
                                    var prepaideReq = data.isPrepaid ? data.isPrepaid : '';
                                    var supplyTypeReq = data.supply_type ? data.supply_type : '';
                                    var isNetMeteringReq = 0;
                                    var discomReq = data.discom ? data.discom : '';

                                    //



                                    userAccountArray = [[parseInt(userIds), parseInt(accountId), nameReq, billingAddressReq,
                                        billingAmountReq, new Date(), premiseAddressReq, sanctionedLoadReq,
                                        divisionReq,
                                        subdivisionnReq, billRouteReq, prepaideReq, supplyTypeReq, isNetMeteringReq, discomReq, current_datetime, current_datetime]];
                                    var sqlAccounts = "INSERT INTO user_accounts (user_id, account_number,account_name,billing_address,billing_amount,billing_due_date,premise_address,sanctioned_load,division,subdivision,bill_route,isPrepaid,supply_type,is_net_metering,discom,created,modified) VALUES ?";
                                    utils.db.executeQuery(sqlAccounts, [userAccountArray]).
                                        then(function (rs) {
                                            response['data_params'] = data;
                                            response['authCode'] = success_code;
                                            response['msg'] = account_added;
                                            response['status'] = success_status_value;
                                            resolve(response);

                                        });
                                } else {
                                    var r = JSON.parse(r.body);
                                    //    data = data.data_params;
                                    console.log("==================>");
                                    console.log(r);
                                    console.log("<<<<<==================>");
                                    console.log(r.authCode);
                                    if (r.authCode == "100") {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = r.msg;
                                        reject(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['status'] = failure_status_value;
                                        response['msg'] = "Some error in data fetching.";
                                        reject(response);
                                    }

                                }
                            });

                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    ///
    SOAaddAccount: function (req) {
        return new Promise(function (resolve, reject) {
            //  console.log("aya");
            //   var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(accountId)) {

                utils.db.executeQuery('SELECT user_account_soa.id,user_account_soa.email,user_account_soa.mobile,user_account_soa.isPrepaid,user_account_soa.account_number,user_account_soa.account_name,user_account_soa.billing_address,user_account_soa.billing_amount,user_account_soa.billing_due_date,user_account_soa.ebill,user_account_soa.mobilebill,account_type,user_account_soa.status,user_account_soa.premise_address,user_account_soa.sanctioned_load,user_account_soa.supply_type,user_account_soa.division,user_account_soa.subdivision,user_account_soa.bill_route,user_account_soa.is_net_metering FROM user_account_soa WHERE  user_account_soa.account_number = ?', [accountId]).
                    then(function (result) {
                        // console.log(a.sql);
                        // fetch user details
                        if (result.length > 0) {
                            //   console.log('SELECT * FROM user_accounts WHERE  account_number = '+accountId);
                            //start check user_account
                            utils.db.executeQuery('SELECT * FROM user_accounts WHERE  account_number = ?',
                                [accountId]).then(function (resultDataVal) {

                                    if (resultDataVal.length > 0) {
                                        response['authCode'] = error_code;
                                        response['msg'] = account_is_already_exits_soa_check;
                                        response['status'] = failure_status_value;
                                        reject(response)
                                    } else {
                                        if (result[0].email == null) {
                                            response['data_params'] = result[0];
                                            response['authCode'] = success_code;
                                            response['msg'] = account_verified;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        } else {
                                            var email = result[0].email;
                                            // if user found
                                            var filename = 'forgotpassword.ejs'; // forgot password email template
                                            var otp = Math.floor(1000 + Math.random() * 999999);
                                            var data = { otp: otp }
                                            var mailOptions = {};
                                            mailOptions['to'] = email;
                                            mailOptions['subject'] = 'Registration OTP';
                                            mailOptions['from'] = '"UPPCL " <user1.guts@gmail.com>';
                                            utils.notify.sendNotification("email", filename, mailOptions, data).
                                                then(function (resp) { // notify user
                                                    var d1 = new Date(),
                                                        d2 = new Date(d1);
                                                    d2.setMinutes(d1.getMinutes() + 10);
                                                    var current_datetime = require('moment')().format('YYYY-MM-DD HH:mm:ss');
                                                    utils.db.executeQuery("INSERT INTO `account_otp_verification` SET ?", [{
                                                        account_number: result[0]['account_number'],
                                                        otp_time: d2,
                                                        otp: otp,
                                                        created: current_datetime,
                                                        modified: current_datetime
                                                    }
                                                    ]).then(function (updResponse) { // update opt user table

                                                        response['data_params'] = result[0];
                                                        response['authCode'] = success_code;
                                                        response['msg'] = account_verified;
                                                        response['status'] = success_status_value;
                                                        resolve(response);
                                                    }, function (error) { // if database errors
                                                        response['authCode'] = error_code;
                                                        response['msg'] = database_error;
                                                        response['status'] = failure_status_value;
                                                        reject(response);
                                                        throw error;
                                                    });
                                                }, function (err) {// if send notification error.
                                                    response['authCode'] = error_code;
                                                    response['msg'] = otp_sent_error_msg;
                                                    response['status'] = failure_status_value;
                                                    reject(response);
                                                    throw err;
                                                });

                                        }

                                    }
                                }, function (error) {
                                    response['authCode'] = error_code;
                                    response['msg'] = database_error;
                                    response['status'] = failure_status_value;
                                    reject(response);
                                    throw error;
                                });
                            //end check user _account


                            // response['data_params'] = result[0];
                            // response['authCode'] = success_code;
                            // response['msg'] = account_verified;
                            // response['status'] = success_status_value;
                            // resolve(response);
                        } else {

                            response['authCode'] = error_code;
                            response['msg'] = account_number_not_exits_in_soa;
                            response['status'] = failure_status_value;
                            reject(response)

                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = account_number_not_exits_in_soa;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    SOAaddAccountforinternal: function (req) {
        return new Promise(function (resolve, reject) {
            //  console.log("aya");
            //   var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(accountId)) {
                //user_account_soa
                //  var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                //var accountId = Buffer.from(accountId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery('SELECT * from  user_account_soa WHERE  user_account_soa.account_number = ?', [accountId]).
                    then(function (result) {
                        // console.log(a.sql);
                        // fetch user details
                        if (result.length > 0) {

                            response['data_params'] = result[0];
                            response['authCode'] = success_code;
                            response['msg'] = account_verified;
                            response['status'] = success_status_value;
                            resolve(response);
                        } else {

                            response['authCode'] = error_code;
                            response['msg'] = account_not_exists;
                            response['status'] = failure_status_value;
                            reject(response)

                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    // ``````````````````````````excel ```````````````````````````download
    excelYearlyData: function (req) {
        return new Promise(function (resolve, reject) {

            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var yearReq = req.body.year ? req.body.year : "";
            var response = {};

            // console.log(req.headers.token)
            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId) && utils.str.is_not_empty(yearReq)) {
                utils.db.executeQuery(
                    'SELECT users.id as profileId,users.mobile,users.first_name,users.last_name,users.profile_image,users.username,users.email,users.area,user_accounts.id,user_accounts.user_id,user_accounts.account_number,user_accounts.account_name,user_accounts.billing_address,user_accounts.billing_amount,user_accounts.billing_due_date,user_accounts.ebill,user_accounts.mobilebill,account_type,user_accounts.status,user_accounts.premise_address,user_accounts.sanctioned_load,user_accounts.supply_type,user_accounts.division,user_accounts.subdivision,user_accounts.bill_route FROM user_accounts JOIN users ON user_accounts.user_id = users.id WHERE user_accounts.user_id = ? and user_accounts.account_number = ?', [userId, account_number])
                    .then(function (result) {
                        if (result.length > 0) {

                            var fss = require("fs");
                            var json2xls = require('json2xls');
                            var allDataJson = [];
                            /// start getting data
                            ConsumptionYear.aggregate(
                                [
                                    {
                                        $match: {
                                            "accountNumber": account_number,
                                            year: yearReq
                                        }
                                    }, { $sort: { "_id": 1 } }
                                ],
                                function (e10, dataval) {
                                    if (dataval && dataval.length) {
                                        var results = [];
                                        var array = dataval;
                                        const monthNames = ["January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"
                                        ];
                                        async function foo() {
                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    // console.log("ayaa");
                                                    // console.log(array[i]);
                                                    // return;
                                                    //var accountNumberJSON = array[i].accountNumber;
                                                    var dt = new Date(array[i].month + "/1/" + yearReq)
                                                    const d = array[i].month;
                                                    //  document.write("The current month is " + monthNames[d.getMonth()]);
                                                    var json2 = {
                                                        Month: monthNames[dt.getMonth()],
                                                        Consumption: array[i].consumption
                                                    }
                                                    results[i] = json2;
                                                    //results[i]['Consumption'] = 10;
                                                    next()
                                                });
                                            }
                                            /*// console.log(results);
                                            var accountData = { Month: "", Consumption: "" };
                                            results.push(accountData);
                                            var accNumber = { Month: "Account Number", Consumption: result[0].account_number };
                                            results.push(accNumber);
                                            var accName = { Month: "Name", Consumption: result[0].account_name };
                                            results.push(accName);
                                            var premiseAdd = { Month: "Premise Address", Consumption: result[0].premise_address };
                                            results.push(premiseAdd);
                                            var billAddress = { Month: "Billing Address", Consumption: result[0].billing_address };
                                            results.push(billAddress);
                                            var mob = { Month: "Mobile", Consumption: result[0].mobile };
                                            results.push(mob);
                                            var email = { Month: "Email", Consumption: result[0].email };
                                            results.push(email);
                                            var suppType = { Month: "Supply Type", Consumption: result[0].supply_type };
                                            results.push(suppType);
                                            var div = { Month: "Division", Consumption: result[0].division };
                                            results.push(div);
                                            var subDiv = { Month: "Sub Division", Consumption: result[0].subdivision };
                                            results.push(subDiv);
                                            var billRoute = { Month: "Bill Route", Consumption: result[0].bill_route };
                                            results.push(billRoute);
                                            var accStatus = { Month: "Account Status", Consumption: "Active" };
                                            results.push(accStatus);
                                            var santion_load = { Month: "Sanctioned Load", Consumption: result[0].sanctioned_load + " KW" ? result[0].sanctioned_load : "0 KW" };
                                            results.push(santion_load);
                                            // console.log(results);
                                            // return;*/
                                            var xls = json2xls(results);
                                            var datenow = Date.now();
                                            var path = 'public/downloads/consumption/' + datenow + account_number;
                                            var forFrontendUrl = 'downloads/consumption/' + datenow + account_number;

                                            fss.writeFileSync(path + 'monthly.xlsx', xls, 'binary');

                                            var hosts = req.headers.host;

                                            var url = req.protocol + '://' + hosts + "/";
                                            //  console.log(url + forFrontendUrl + 'monthly.xlsx');
                                            // return;

                                            response['data_params'] = url + forFrontendUrl + 'monthly.xlsx';
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);


                                        }
                                        foo();

                                    } else {
                                        // console.log(result);
                                        // return;
                                        var data_param = [

                                            { Month: "January", Consumption: 0 },
                                            { Month: "February", Consumption: 0 },
                                            { Month: "March", Consumption: 0 },
                                            { Month: "April", Consumption: 0 },
                                            { Month: "May", Consumption: 0 },
                                            { Month: "June", Consumption: 0 },
                                            { Month: "July", Consumption: 0 },
                                            { Month: "August", Consumption: 0 },
                                            { Month: "September", Consumption: 0 },
                                            { Month: "October", Consumption: 0 },
                                            { Month: "November", Consumption: 0 },
                                            { Month: "December", Consumption: 0 },
                                           /* { Month: "", Consumption: "" },
                                            { Month: "Account Number", Consumption: result[0].account_number },
                                            { Month: "Name", Consumption: result[0].account_name },
                                            { Month: "Premise Address", Consumption: result[0].premise_address },
                                            { Month: "Billing Address", Consumption: result[0].billing_address },
                                            { Month: "Mobile", Consumption: result[0].mobile },
                                            { Month: "Email", Consumption: result[0].email },
                                            { Month: "Supply Type", Consumption: result[0].supply_type },
                                            { Month: "Division", Consumption: result[0].division },
                                            { Month: "Sub Division", Consumption: result[0].subdivision },
                                            { Month: "Bill Route", Consumption: result[0].bill_route },
                                            { Month: "Account Status", Consumption: "Active" },
                                            { Month: "Sanctioned Load", Consumption: result[0].sanctioned_load + " KW" ? result[0].sanctioned_load : "0 KW" },

                                        */  ]

                                        var xls = json2xls(data_param);
                                        var datenow = Date.now();
                                        var path = 'public/downloads/consumption/' + datenow + account_number;
                                        var forFrontendUrl = 'downloads/consumption/' + datenow + account_number;

                                        fss.writeFileSync(path + 'monthly.xlsx', xls, 'binary');
                                        /* var hosts = '';
                                         if (req.headers.host == "103.249.98.101:3002") {
                                             hosts = "10.10.167.8:3002";
                                         } else {
                                             hosts = req.headers.host;
                                         }*/

                                        var hosts = req.headers.host;
                                        var url = req.protocol + '://' + hosts + "/";

                                        response['data_params'] = url + forFrontendUrl + 'monthly.xlsx';

                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    }
                                })
                        } else {

                            response['authCode'] = error_code;
                            response['msg'] = account_not_exists;
                            response['status'] = failure_status_value;
                            reject(response)

                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    excelAllYearConsumption: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};
            // console.log(req.headers.token)
            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {
                utils.db.executeQuery(
                    'SELECT users.id as profileId,users.mobile,users.first_name,users.last_name,users.profile_image,users.username,users.email,users.area,user_accounts.id,user_accounts.user_id,user_accounts.account_number,user_accounts.account_name,user_accounts.billing_address,user_accounts.billing_amount,user_accounts.billing_due_date,user_accounts.ebill,user_accounts.mobilebill,account_type,user_accounts.status,user_accounts.premise_address,user_accounts.sanctioned_load,user_accounts.supply_type,user_accounts.division,user_accounts.subdivision,user_accounts.bill_route FROM user_accounts JOIN users ON user_accounts.user_id = users.id WHERE user_accounts.user_id = ? and user_accounts.account_number = ?', [userId, account_number])
                    .then(function (result) {
                        if (result.length > 0) {
                            var fss = require("fs");
                            var json2xls = require('json2xls');
                            var allDataJson = [];
                            /// start getting data
                            AllYearsConsumption.aggregate(
                                [
                                    {
                                        $match: {
                                            "accountNumber": account_number
                                        }
                                    }, { $sort: { "_id": 1 } },
                                    {
                                        $project: {
                                            "accountNumber": 1,
                                            "consumption": 1, "year": 1
                                        }
                                    }
                                ],
                                function (e10, dataval) {

                                    if (dataval && dataval.length) {
                                        var results = [];
                                        var array = dataval;

                                        async function foo() {
                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    var json2 = {
                                                        Year: array[i].year,
                                                        Consumption: array[i].consumption
                                                    }
                                                    results[i] = json2;

                                                    next()
                                                });
                                            }
                                            var xls = json2xls(results);
                                            var datenow = Date.now();
                                            var path = 'public/downloads/consumption/' + datenow + account_number;
                                            var forFrontendUrl = 'downloads/consumption/' + datenow + account_number;

                                            fss.writeFileSync(path + 'allYearly.xlsx', xls, 'binary');

                                            var hosts = req.headers.host;
                                            var url = req.protocol + '://' + hosts + "/";
                                            response['data_params'] = url + forFrontendUrl + 'allYearly.xlsx';
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                        foo();

                                    } else {

                                        var data_param = [

                                            { Year: 2014, Consumption: 0 },
                                            { Year: 2015, Consumption: 0 },
                                            { Year: 2016, Consumption: 0 },
                                            { Year: 2017, Consumption: 0 },
                                            { Year: 2018, Consumption: 0 },

                                        ]

                                        var xls = json2xls(data_param);
                                        var datenow = Date.now();
                                        var path = 'public/downloads/consumption/' + datenow + account_number;
                                        var forFrontendUrl = 'downloads/consumption/' + datenow + account_number;

                                        fss.writeFileSync(path + 'allYearly.xlsx', xls, 'binary');


                                        var hosts = req.headers.host;
                                        var url = req.protocol + '://' + hosts + "/";

                                        response['data_params'] = url + forFrontendUrl + 'allYearly.xlsx';

                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    }
                                })
                        } else {

                            response['authCode'] = error_code;
                            response['msg'] = account_not_exists;
                            response['status'] = failure_status_value;
                            reject(response)

                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    //excel weekly
    excelWeeklyData: function (req) {
        return new Promise(function (resolve, reject) {

            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var years = req.body.year ? req.body.year : "";
            var months = req.body.month ? req.body.month : "";
            var response = {};

            // console.log(req.headers.token)
            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId) &&
                utils.str.is_not_empty(years) &&
                utils.str.is_not_empty(months)) {
                utils.db.executeQuery(
                    'SELECT users.id as profileId,users.mobile,users.first_name,users.last_name,users.profile_image,users.username,users.email,users.mobile,users.area,user_accounts.id,user_accounts.user_id,user_accounts.account_number,user_accounts.account_name,user_accounts.billing_address,user_accounts.billing_amount,user_accounts.billing_due_date,user_accounts.ebill,user_accounts.mobilebill,account_type,user_accounts.status,user_accounts.premise_address,user_accounts.sanctioned_load,user_accounts.supply_type,user_accounts.division,user_accounts.subdivision,user_accounts.bill_route,user_accounts.discom FROM user_accounts JOIN users ON user_accounts.user_id = users.id WHERE user_accounts.user_id = ? and user_accounts.account_number = ?', [userId, account_number])
                    .then(function (result) {
                        if (result.length > 0) {

                            var fss = require("fs");
                            var json2xls = require('json2xls');
                            var allDataJson = [];
                            /// start getting data
                            WeeklyConsumption.aggregate(
                                [
                                    {
                                        $match: {
                                            "accountNumber": account_number,
                                            "month": months,
                                            "year": years

                                        }
                                    }, { $sort: { "_id": 1 } },
                                    {
                                        $project: {
                                            "accountNumber": 1, "week": 1,
                                            "month": 1, "consumption": 1, "year": 1
                                        }
                                    }
                                ],
                                function (e10, dataval) {


                                    if (dataval && dataval.length) {
                                        var results = [];
                                        var array = dataval;
                                     
                                        var accNumber = { "Account Number":result[0].account_number ,
                                        "Account Name":result[0].account_name,"Address":result[0].billing_address,
                                        "Mobile":result[0].mobile,"Emai ID":result[0].email,
                                        "Sanctioned load":result[0].sanctioned_load,
                                        "Supply Type":result[0].supply_type,
                                        "Division":result[0].division,"Discom":result[0].discom};
                                        results.push(accNumber);
                                       var accName = { "Account Number":"" ,
                                       "Account Name":"","Address":"",
                                       "Mobile":"","Emai ID":"",
                                       "Sanctioned load":"",
                                       "Supply Type":"",
                                       "Division":"","Discom":""};
                                        results.push(accName);
                                      /*  var premiseAdd = { Month: "Premise Address", Consumption: result[0].premise_address };
                                        results.push(premiseAdd); */
                                      /*  var billAddress = { Month: "Billing Address", Consumption: result[0].billing_address };
                                        results.push(billAddress);
                                        var mob = { Month: "Mobile", Consumption: result[0].mobile };
                                        results.push(mob);
                                        var email = { Month: "Email", Consumption: result[0].email };
                                        results.push(email);
                                        var suppType = { Month: "Supply Type", Consumption: result[0].supply_type };
                                        results.push(suppType);
                                        var div = { Month: "Division", Consumption: result[0].division };
                                        results.push(div);
                                        var subDiv = { Month: "Sub Division", Consumption: result[0].subdivision };
                                        results.push(subDiv);
                                        var billRoute = { Month: "Bill Route", Consumption: result[0].bill_route };
                                        results.push(billRoute);
                                        var accStatus = { Month: "Account Status", Consumption: "Active" };
                                        results.push(accStatus);
                                        var santion_load = { Month: "Sanctioned Load", Consumption: result[0].sanctioned_load + " KW" ? result[0].sanctioned_load : "0 KW" };
                                        results.push(santion_load);*/

                                        async function foo() {
                                          
                                      /*  */

                                            var xls = json2xls(results);
                                            var datenow = Date.now();
                                            var path = 'public/downloads/consumption/' + datenow + account_number + "-month-" + months;
                                            var forFrontendUrl = 'downloads/consumption/' + datenow + account_number + "-month-" + months;
                                            fss.writeFileSync(path + 'Weekly.xlsx', xls, 'binary');
                                            var hosts = req.headers.host;
                                            var url = req.protocol + '://' + hosts + "/";
                                            response['data_params'] = url + forFrontendUrl + 'Weekly.xlsx';
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                        foo();

                                    } else {

                                        var data_param = [

                                            {
                                                Year: years,
                                                Month: months,
                                                Week: 1,
                                                Consumption: 0
                                            },
                                            {
                                                Year: years,
                                                Month: months,
                                                Week: 2,
                                                Consumption: 0
                                            },
                                            {
                                                Year: years,
                                                Month: months,
                                                Week: 3,
                                                Consumption: 0
                                            },
                                            {
                                                Year: years,
                                                Month: months,
                                                Week: 4,
                                                Consumption: 0
                                            },

                                        ]

                                        var xls = json2xls(data_param);
                                        var datenow = Date.now();
                                        var path = 'public/downloads/consumption/' + datenow + account_number + "-month-" + months;
                                        var forFrontendUrl = 'downloads/consumption/' + datenow + account_number + "-month-" + months;

                                        fss.writeFileSync(path + 'Weekly.xlsx', xls, 'binary');


                                        var hosts = req.headers.host;
                                        var url = req.protocol + '://' + hosts + "/";

                                        response['data_params'] = url + forFrontendUrl + 'Weekly.xlsx';

                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    }

                                })
                        } else {

                            response['authCode'] = error_code;
                            response['msg'] = account_not_exists;
                            response['status'] = failure_status_value;
                            reject(response)

                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    //excel daily
    excelDailyData: function (req) {
        return new Promise(function (resolve, reject) {

            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var years = req.body.year ? req.body.year : "";
            var months = req.body.month ? req.body.month : "";
            var response = {};

            // console.log(req.headers.token)
            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId) &&
                utils.str.is_not_empty(years) &&
                utils.str.is_not_empty(months)) {
                utils.db.executeQuery(
                    'SELECT users.id as profileId,users.mobile,users.first_name,users.last_name,users.profile_image,users.username,users.email,users.area,user_accounts.id,user_accounts.user_id,user_accounts.account_number,user_accounts.account_name,user_accounts.billing_address,user_accounts.billing_amount,user_accounts.billing_due_date,user_accounts.ebill,user_accounts.mobilebill,account_type,user_accounts.status,user_accounts.premise_address,user_accounts.sanctioned_load,user_accounts.supply_type,user_accounts.division,user_accounts.subdivision,user_accounts.bill_route FROM user_accounts JOIN users ON user_accounts.user_id = users.id WHERE user_accounts.user_id = ? and user_accounts.account_number = ?', [userId, account_number])
                    .then(function (result) {
                        if (result.length > 0) {

                            var fss = require("fs");
                            var json2xls = require('json2xls');
                            var allDataJson = [];
                            /// start getting data
                            DailyConsumption.aggregate(
                                [
                                    {
                                        $match: {
                                            "accountNumber": account_number,
                                            "month": months,
                                            "year": years

                                        }
                                    }, { $sort: { "day": 1 } },
                                    {
                                        $project: {
                                            "accountNumber": 1, "day": 1,
                                            "month": 1, "year": 1,
                                            "consumption": 1
                                        }
                                    }
                                ],
                                function (e10, dataval) {
                                    // console.log(dataval);
                                    // return;


                                    if (dataval && dataval.length) {
                                        var results = [];
                                        var array = dataval;

                                        async function foo() {
                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    var json2 = {
                                                        Year: array[i].year,
                                                        Month: array[i].month,
                                                        Day: array[i].day,
                                                        Consumption: array[i].consumption
                                                    }
                                                    results[i] = json2;
                                                    next()
                                                });
                                            }
                                            var xls = json2xls(results);
                                            var datenow = Date.now();
                                            var path = 'public/downloads/consumption/' + datenow + account_number + "-month-" + months;
                                            var forFrontendUrl = 'downloads/consumption/' + datenow + account_number + "-month-" + months;
                                            fss.writeFileSync(path + 'daily.xlsx', xls, 'binary');
                                            var hosts = req.headers.host;
                                            var url = req.protocol + '://' + hosts + "/";
                                            response['data_params'] = url + forFrontendUrl + 'daily.xlsx';
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                        foo();

                                    } else {

                                        var data_param = [
                                            { "Year": years, "Month": months, "Day": 1, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 2, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 3, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 4, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 5, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 6, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 7, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 8, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 9, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 10, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 11, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 12, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 13, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 14, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 15, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 16, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 17, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 18, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 19, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 20, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 21, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 22, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 23, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 24, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 25, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 26, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 27, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 28, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 29, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 30, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": 31, "Consumption": 0 }]
                                        var xls = json2xls(data_param);
                                        var datenow = Date.now();
                                        var path = 'public/downloads/consumption/' + datenow + account_number + "-month-" + months;
                                        var forFrontendUrl = 'downloads/consumption/' + datenow + account_number + "-month-" + months;

                                        fss.writeFileSync(path + 'daily.xlsx', xls, 'binary');


                                        var hosts = req.headers.host;
                                        var url = req.protocol + '://' + hosts + "/";

                                        response['data_params'] = url + forFrontendUrl + 'daily.xlsx';

                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    }

                                })
                        } else {

                            response['authCode'] = error_code;
                            response['msg'] = account_not_exists;
                            response['status'] = failure_status_value;
                            reject(response)

                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    //excel hourly
    excelHourlyData: function (req) {
        return new Promise(function (resolve, reject) {

            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var years = req.body.year ? req.body.year : "";
            var months = req.body.month ? req.body.month : "";
            var days = req.body.day ? req.body.day : "";
            var response = {};

            // console.log(req.headers.token)
            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId) &&
                utils.str.is_not_empty(years) &&
                utils.str.is_not_empty(months) &&
                utils.str.is_not_empty(days)) {
                utils.db.executeQuery(
                    'SELECT users.id as profileId,users.mobile,users.first_name,users.last_name,users.profile_image,users.username,users.email,users.area,user_accounts.id,user_accounts.user_id,user_accounts.account_number,user_accounts.account_name,user_accounts.billing_address,user_accounts.billing_amount,user_accounts.billing_due_date,user_accounts.ebill,user_accounts.mobilebill,account_type,user_accounts.status,user_accounts.premise_address,user_accounts.sanctioned_load,user_accounts.supply_type,user_accounts.division,user_accounts.subdivision,user_accounts.bill_route FROM user_accounts JOIN users ON user_accounts.user_id = users.id WHERE user_accounts.user_id = ? and user_accounts.account_number = ?', [userId, account_number])
                    .then(function (result) {
                        if (result.length > 0) {

                            var fss = require("fs");
                            var json2xls = require('json2xls');
                            var allDataJson = [];
                            /// start getting data
                            HourlyConsumption.aggregate(
                                [
                                    {
                                        $match: {
                                            "accountNumber": account_number,
                                            "month": months,
                                            "day": days,
                                            "year": years
                                        }
                                    }, { $sort: { "hour": 1 } },
                                    {
                                        $project: {
                                            "accountNumber": 1, "day": 1,
                                            "month": 1, "consumption": 1, "year": 1, "hour": 1
                                        }
                                    }
                                ],
                                function (e10, dataval) {
                                    // console.log(dataval);
                                    // return;


                                    if (dataval && dataval.length) {
                                        var results = [];
                                        var array = dataval;

                                        async function foo() {
                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    var json2 = {
                                                        Year: array[i].year,
                                                        Month: array[i].month,
                                                        Day: array[i].day,
                                                        Hour: array[i].hour,
                                                        Consumption: array[i].consumption
                                                    }
                                                    results[i] = json2;
                                                    next()
                                                });
                                            }
                                            var xls = json2xls(results);
                                            var datenow = Date.now();
                                            var path = 'public/downloads/consumption/' + datenow + account_number + "-month-" + months + "-day-" + days;
                                            var forFrontendUrl = 'downloads/consumption/' + datenow + account_number + "-month-" + months + "-day-" + days;
                                            fss.writeFileSync(path + 'hourly.xlsx', xls, 'binary');
                                            var hosts = req.headers.host;
                                            var url = req.protocol + '://' + hosts + "/";
                                            response['data_params'] = url + forFrontendUrl + 'hourly.xlsx';
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                        foo();

                                    } else {

                                        var data_param = [
                                            { "Year": years, "Month": months, "Day": days, Hour: 0, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 1, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 2, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 3, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 4, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 5, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 6, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 7, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 8, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 9, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 10, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 11, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 12, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 13, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 14, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 15, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 16, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 17, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 18, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 19, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 20, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 21, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 22, "Consumption": 0 },
                                            { "Year": years, "Month": months, "Day": days, Hour: 23, "Consumption": 0 }]

                                        var xls = json2xls(data_param);
                                        var datenow = Date.now();
                                        var path = 'public/downloads/consumption/' + datenow + account_number + "-month-" + months + "-day-" + days;
                                        var forFrontendUrl = 'downloads/consumption/' + datenow + account_number + "-month-" + months + "-day-" + days;

                                        fss.writeFileSync(path + 'hourly.xlsx', xls, 'binary');


                                        var hosts = req.headers.host;
                                        var url = req.protocol + '://' + hosts + "/";

                                        response['data_params'] = url + forFrontendUrl + 'hourly.xlsx';

                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    }

                                })
                        } else {

                            response['authCode'] = error_code;
                            response['msg'] = account_not_exists;
                            response['status'] = failure_status_value;
                            reject(response)

                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    excelBillingYearlyData: function (req) {
        return new Promise(function (resolve, reject) {

            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var yearReq = req.body.year ? req.body.year : "";
            var response = {};

            // console.log(req.headers.token)
            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId) && utils.str.is_not_empty(yearReq)) {
                utils.db.executeQuery(
                    'SELECT users.id as profileId,users.mobile,users.first_name,users.last_name,users.profile_image,users.username,users.email,users.area,user_accounts.id,user_accounts.user_id,user_accounts.account_number,user_accounts.account_name,user_accounts.billing_address,user_accounts.billing_amount,user_accounts.billing_due_date,user_accounts.ebill,user_accounts.mobilebill,account_type,user_accounts.status,user_accounts.premise_address,user_accounts.sanctioned_load,user_accounts.supply_type,user_accounts.division,user_accounts.subdivision,user_accounts.bill_route FROM user_accounts JOIN users ON user_accounts.user_id = users.id WHERE user_accounts.user_id = ? and user_accounts.account_number = ?', [userId, account_number])
                    .then(function (result) {
                        if (result.length > 0) {

                            var fss = require("fs");
                            var json2xls = require('json2xls');
                            var allDataJson = [];
                            /// start getting data

                            BillingYear.aggregate(
                                [
                                    {
                                        $match: {
                                            "accountNumber": account_number,
                                            year: yearReq
                                        }
                                    }, { $sort: { "_id": 1 } }
                                ],

                                function (e10, dataval) {
                                    // console.log(dataval);
                                    // return;
                                    if (dataval && dataval.length) {

                                        var results = [];
                                        var array = dataval;


                                        const monthNames = ["January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"
                                        ];


                                        async function foo() {

                                            for (var i = 0; i < array.length; i++) {
                                                await new Promise(next => {
                                                    // console.log("ayaa");
                                                    // console.log(array[i]);
                                                    // return;
                                                    //var accountNumberJSON = array[i].accountNumber;
                                                    var dt = new Date(array[i].month + "/1/" + yearReq)
                                                    const d = array[i].month;
                                                    //  document.write("The current month is " + monthNames[d.getMonth()]);
                                                    var json2 = {
                                                        Month: monthNames[dt.getMonth()],
                                                        billingAmount: array[i].billingAmount
                                                    }


                                                    results[i] = json2;
                                                    //results[i]['Consumption'] = 10;

                                                    next()

                                                });
                                            }

                                            // console.log(results);
                                            var accountData = { Month: "", billingAmount: "" };
                                            results.push(accountData);
                                            var accNumber = { Month: "Account Number", billingAmount: result[0].account_number };
                                            results.push(accNumber);
                                            var accName = { Month: "Name", billingAmount: result[0].account_name };
                                            results.push(accName);
                                            var premiseAdd = { Month: "Premise Address", billingAmount: result[0].premise_address };
                                            results.push(premiseAdd);
                                            var billAddress = { Month: "Billing Address", billingAmount: result[0].billing_address };
                                            results.push(billAddress);
                                            var mob = { Month: "Mobile", billingAmount: result[0].mobile };
                                            results.push(mob);
                                            var email = { Month: "Email", billingAmount: result[0].email };
                                            results.push(email);
                                            var suppType = { Month: "Supply Type", billingAmount: result[0].supply_type };
                                            results.push(suppType);
                                            var div = { Month: "Division", billingAmount: result[0].division };
                                            results.push(div);
                                            var subDiv = { Month: "Sub Division", billingAmount: result[0].subdivision };
                                            results.push(subDiv);
                                            var billRoute = { Month: "Bill Route", billingAmount: result[0].bill_route };
                                            results.push(billRoute);
                                            var accStatus = { Month: "Account Status", billingAmount: "Active" };
                                            results.push(accStatus);
                                            var santion_load = { Month: "Sanctioned Load", billingAmount: result[0].sanctioned_load + " KW" ? result[0].sanctioned_load : "0 KW" };
                                            results.push(santion_load);

                                            var xls = json2xls(results);
                                            var datenow = Date.now();
                                            var path = 'public/downloads/billing/' + datenow + account_number;
                                            var forFrontendUrl = 'downloads/billing/' + datenow + account_number;
                                            fss.writeFileSync(path + 'monthlybilling.xlsx', xls, 'binary');

                                            /* var hosts = '';
                                             if (req.headers.host == "103.249.98.101:3002") {
                                                 hosts = "10.10.167.8:3002";
                                             } else {
                                                 hosts = req.headers.host;
                                             }*/

                                            var hosts = req.headers.host;
                                            var url = req.protocol + '://' + hosts + "/";

                                            response['data_params'] = url + forFrontendUrl + 'monthlybilling.xlsx';
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);


                                        }
                                        foo();

                                    } else {

                                        var data_param = [
                                            { Month: "January", billingAmount: 0 },
                                            { Month: "February", billingAmount: 0 },
                                            { Month: "March", billingAmount: 0 },
                                            { Month: "April", billingAmount: 0 },
                                            { Month: "May", billingAmount: 0 },
                                            { Month: "June", billingAmount: 0 },
                                            { Month: "July", billingAmount: 0 },
                                            { Month: "August", billingAmount: 0 },
                                            { Month: "September", billingAmount: 0 },
                                            { Month: "October", billingAmount: 0 },
                                            { Month: "November", billingAmount: 0 },
                                            { Month: "December", billingAmount: 0 },
                                            { Month: "", billingAmount: "" },
                                            { Month: "Account Number", billingAmount: result[0].account_number },
                                            { Month: "Name", billingAmount: result[0].account_name },
                                            { Month: "Premise Address", billingAmount: result[0].premise_address },
                                            { Month: "Billing Address", billingAmount: result[0].billing_address },
                                            { Month: "Mobile", billingAmount: result[0].mobile },
                                            { Month: "Email", billingAmount: result[0].email },
                                            { Month: "Supply Type", billingAmount: result[0].supply_type },
                                            { Month: "Division", billingAmount: result[0].division },
                                            { Month: "Sub Division", billingAmount: result[0].subdivision },
                                            { Month: "Bill Route", billingAmount: result[0].bill_route },
                                            { Month: "Account Status", billingAmount: "Active" },
                                            { Month: "Sanctioned Load", billingAmount: result[0].sanctioned_load + " KW" ? result[0].sanctioned_load : "0 KW" },

                                        ]
                                        //                                        console.log(data_param);

                                        var xls = json2xls(data_param);
                                        var datenow = Date.now();
                                        var path = 'public/downloads/billing/' + datenow + account_number;
                                        var forFrontendUrl = 'downloads/billing/' + datenow + account_number;

                                        fss.writeFileSync(path + 'monthlybilling.xlsx', xls, 'binary');
                                        /* var hosts = '';
                                         if (req.headers.host == "103.249.98.101:3002") {
                                             hosts = "10.10.167.8:3002";
                                         } else {
                                             hosts = req.headers.host;
                                         }
 */
                                        var hosts = req.headers.host;
                                        var url = req.protocol + '://' + hosts + "/";

                                        response['data_params'] = url + forFrontendUrl + 'monthlybilling.xlsx';

                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    }
                                })
                        } else {

                            response['authCode'] = error_code;
                            response['msg'] = account_not_exists;
                            response['status'] = failure_status_value;
                            reject(response)

                        }
                    }, function (error) {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;
                    });
                /* resolve('ok'); */

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    billingGraphMonthly: function (req) {
        return new Promise(function (resolve, reject) {
            // console.log("aya");
            var userId = req.body.userId ? req.body.userId : "";
            var account_number = req.body.account_number ? req.body.account_number : "";
            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)) {

                var userId = req.body.userId ? req.body.userId : "";
                var account_number = req.body.account_number ? req.body.account_number : "";
                var yearReq = req.body.year ? req.body.year : "";
                var response = {};

                // console.log(req.headers.token)
                if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId) && utils.str.is_not_empty(yearReq)) {
                    utils.db.executeQuery('SELECT * FROM users INNER JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                        .then(function (result) { // fetch user details
                            if (result.length > 0) {
                                BillingYear.aggregate(
                                    [
                                        {
                                            $match: {
                                                "accountNumber": account_number,
                                                year: yearReq
                                                /*  "createdOn": {
                                                      $gte: new Date(yesterDay),
                                                    //  $lte: new Date(toDay)
                                                  }*/
                                            }
                                        }, { $sort: { "_id": 1 } }
                                    ],

                                    function (e10, dataval) {
                                        if (dataval && dataval.length) {
                                            response['data_params'] = dataval;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        } else {
                                            var data_param = [
                                                { "year": "2018", "month": 1, "billingAmount": 0 },
                                                { "year": "2018", "month": 2, "billingAmount": 0 },
                                                { "year": "2018", "month": 3, "billingAmount": 0 },
                                                { "year": "2018", "month": 4, "billingAmount": 0 },
                                                { "year": "2018", "month": 5, "billingAmount": 0 },
                                                { "year": "2018", "month": 6, "billingAmount": 0 },
                                                { "year": "2018", "month": 7, "billingAmount": 0 },
                                                { "year": "2018", "month": 8, "billingAmount": 0 },
                                                { "year": "2018", "month": 9, "billingAmount": 0 },
                                                { "year": "2018", "month": 10, "billingAmount": 0 },
                                                { "year": "2018", "month": 11, "billingAmount": 0 },
                                                { "year": "2018", "month": 12, "billingAmount": 0 }
                                            ]
                                            response['data_params'] = data_param;
                                            response['authCode'] = success_code;
                                            response['msg'] = data_listed;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        }
                                    })

                            } else {
                                response['authCode'] = error_code;
                                response['status'] = failure_status_value;
                                response['msg'] = user_is_not_exits;
                                reject(response);
                            }

                        })

                } else {
                    response['authCode'] = error_code;
                    response['status'] = failure_status_value;
                    response['msg'] = empty_params;
                    reject(response);
                }

            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    csvImportHourlyData: function (req) {
        return new Promise((resolve, reject) => {
            var response = {};
            // console.log(req.body);
            // return;

            var account_number = req.body.account_number ? req.body.account_number : "";
            var mth = req.body.month ? req.body.month : "";
            var days = req.body.day ? req.body.day : "";

            var yrs = req.body.year ? req.body.year : "";
            const request = require('request')
            const csv = require('csvtojson');
            var i = 0;
            //http://192.168.1.3/lti_admin/hourly.csv
            //http://192.168.1.156:3002/csv/hourly.csv
            csv().fromStream(request.get('http://192.168.1.3/lti_admin/hourly.csv'))

                .subscribe((json) => {



                    if (typeof json === 'object') {

                        // console.log(json);
                        //   return

                        var hrs = json.hour;


                        HourlyConsumption.find({
                            accountNumber: account_number,
                            month: mth, day: days,
                            year: yrs,
                            hour: hrs,
                            day: days
                        },
                            function (ee, rrr) {
                                //  console.log("1");
                                if (rrr && rrr.length > 0) {
                                    i++;
                                    // console.log("2");
                                    //next()
                                }
                                else if (ee) {
                                    i++;
                                    //console.log("3");
                                    //next()
                                }
                                else {
                                    var ytdCons = {
                                        accountNumber: account_number,
                                        day: days,
                                        month: mth,
                                        year: yrs,
                                        hour: hrs,
                                        consumption: json.consumption
                                    };

                                    var HourlyConsumptions = new HourlyConsumption(ytdCons);
                                    //    console.log(json);
                                    //    return;                    
                                    HourlyConsumptions.save(function (er, rr) {
                                        i++;
                                        //next();
                                    });

                                }
                            })





                        /*   async function foo() {
                               //console.
                               var array = json;
       
                               for (var i = 0; i < array.length; i++) {
                                   await new Promise(next => {  })
                               }
                           }
       
                           foo();*//*
response['data_params'] = [];
response['authCode'] = success_code;
response['msg'] = "Successfully uploaded";
response['status'] = success_status_value;
resolve(response);*/
                    } else {
                        // console.log("aa gya h4");
                        response['authCode'] = error_code;
                        response['msg'] = "Data fetching problems.";
                        response['status'] = failure_status_value;
                        reject(response);
                        throw error;

                    }

                    //reject(1);
                    // long operation for each json e.g. transform / write into database.
                }, (errorOn) => {
                    //   console.log("aa gya h5");
                    response['authCode'] = error_code;
                    response['msg'] = "Problem from uploading csv.";
                    response['status'] = failure_status_value;
                    reject(response);
                    // throw error;

                }, (onCompleted, r) => {
                    //  console.log(onCompleted);
                    //   console.log(r);
                    //  console.log("aa gya h6");
                    response['data_params'] = [];
                    response['authCode'] = success_code;
                    response['msg'] = "Successfully uploaded";
                    response['status'] = success_status_value;
                    resolve(response);

                })
        }, function (er, r) {
            if (er) {
                //console.log("aa gya h7");
                response['authCode'] = error_code;
                response['msg'] = er;
                response['status'] = failure_status_value;
                reject(response);
                throw error;

            } else {
                //  console.log("aa gya ");
                response['data_params'] = [];
                response['authCode'] = success_code;
                response['msg'] = "Successfully uploaded";
                response['status'] = success_status_value;
                resolve(response);

            }

        });
    },
    getComplaintCaseType: function (req) {
        return new Promise(function (resolve, reject) {
            // console.log("aya");
            //   var userId = req.body.profileToken ? req.body.profileToken : "";

            var response = {};

            utils.db.executeQuery('SELECT id,case_type FROM consumption_case_types  WHERE status = ?', [1])
                .then(function (dataval) {

                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {

                        response['data_params'] = [];
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    }
                })


        });
    },
    getComplaintBillRelatedReason: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};

            utils.db.executeQuery('SELECT id,reason FROM consumption_bill_related_reasons  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {

                        response['data_params'] = [];
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    }
                })


        });
    },
    getComplaintSupplyServiceRequest: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,service_request FROM complaint_supply_related_service_request  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {

                        response['data_params'] = [];
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    }
                })


        });
    },
    getComplaintSupplyProblem: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,problems FROM complaint_supply_related_problems  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['data_params'] = [];
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    }
                })


        });
    },


    addComplaint: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.profileToken ? req.body.profileToken : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var caseType = req.body.caseType ? req.body.caseType : "";
            var comments = req.body.comments ? req.body.comments : "";
            var billId = req.body.billId ? req.body.billId : "";
            var reason = req.body.reason ? req.body.reason : "";
            var serviceRequest = req.body.serviceRequest ? req.body.serviceRequest : "";
            var problem = req.body.problem ? req.body.problem : "";

            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)
                && utils.str.is_not_empty(caseType)) {
                var current_datetime = require('moment')().format('YYYY-MM-DD HH:mm:ss');
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery('SELECT * FROM users  JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            var trackNumber = Math.floor(100000000 + Math.random() * 9900000000);
                            userAccountArray = [[parseInt(userId), parseInt(account_number), caseType, comments, billId, reason, serviceRequest, problem, trackNumber, current_datetime, current_datetime]];
                            var sqlAccounts = "INSERT INTO complaints (user_id, account_number,complaint_type,comments,billId,reason,service_request,problem,tracking_number,created,modified) VALUES ?";
                            utils.db.executeQuery(sqlAccounts, [userAccountArray]).
                                then(function (rs, e) {
                                    if (rs) {

                                        var email = result[0].email;
                                        // if user found
                                        var filename = 'complaint.ejs'; // forgot password email template
                                        var data = { trackingNumber: trackNumber }
                                        var mailOptions = {};
                                        mailOptions['to'] = email;
                                        mailOptions['subject'] = 'Complaint registered.';
                                        mailOptions['from'] = '"UPPCL " <user1.guts@gmail.com>';
                                        utils.notify.sendNotification("email", filename, mailOptions, data).then(function (resp) {

                                            response['data_params'] = trackNumber;
                                            response['authCode'] = success_code;
                                            response['msg'] = complaint_added;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        });

                                    } else {
                                        response['authCode'] = error_code;
                                        response['msg'] = database_error;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    })
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    //service request start

    getServiceRequestType: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,request_type FROM service_request_types  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    },
    getServiceRequestEnclosedIdentificationDocument: function (req) {

        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,enclosed_identification_documents FROM service_request_enclosed_identification_documents  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    },
    getServiceRequestChangeReason: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,reason FROM service_request_category_change_request_reason  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    },

    addServiceRequest: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.profileToken ? req.body.profileToken : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";

            var serviceRequestType = req.body.serviceRequestType ? req.body.serviceRequestType : "";

            var enclosedIdentificationDocument = req.body.enclosedIdentificationDocument ? req.body.enclosedIdentificationDocument : "";
            var comments = req.body.comments ? req.body.comments : "";
            var loadUnit = req.body.loadUnit ? req.body.loadUnit : "";
            var newLoad = req.body.newLoad ? req.body.newLoad : "";
            var proposedCategory = req.body.proposedCategory ? req.body.proposedCategory : "";
            var proposedSupplyCode = req.body.proposedSupplyCode ? req.body.proposedSupplyCode : "";
            var reason = req.body.reason ? req.body.reason : "";
            var applicantName = req.body.applicantName ? req.body.applicantName : "";
            var houseNumber = req.body.houseNumber ? req.body.houseNumber : "";
            //	        
            // house_number	

            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)
                && utils.str.is_not_empty(serviceRequestType)) {

                var current_datetime = require('moment')().format('YYYY-MM-DD HH:mm:ss');
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery('SELECT * FROM users  JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            var trackNumber = Math.floor(100000000 + Math.random() * 900000000);
                            userAccountArray = [[trackNumber, parseInt(userId), parseInt(account_number), serviceRequestType, enclosedIdentificationDocument, comments, loadUnit, newLoad, proposedCategory, proposedSupplyCode, reason, applicantName, houseNumber, current_datetime, current_datetime]];
                            var sqlAccounts = "INSERT INTO service_requests (tracking_number,user_id, account_number,service_request_type,enclosed_identificaton_document,comment,load_unit,new_load,proposed_category,proposed_supply_code,reason,applicant_name,house_number,created,modified) VALUES ?";
                            utils.db.executeQuery(sqlAccounts, [userAccountArray]).
                                then(function (rs, e) {
                                    if (rs) {

                                        var email = result[0].email;
                                        // if user found
                                        var filename = 'servicerequest.ejs'; // service request email template

                                        var data = { trackingNumber: trackNumber }
                                        var mailOptions = {};
                                        mailOptions['to'] = email;
                                        mailOptions['subject'] = 'Service request registered.';
                                        mailOptions['from'] = '"UPPCL " <user1.guts@gmail.com>';
                                        utils.notify.sendNotification("email", filename, mailOptions, data).then(function (resp) {

                                            response['data_params'] = trackNumber;
                                            response['authCode'] = success_code;
                                            response['msg'] = request_added;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        });
                                    } else {
                                        response['authCode'] = error_code;
                                        response['msg'] = database_error;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    })
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    addServiceRequestRural: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.profileToken ? req.body.profileToken : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var requestType = req.body.requestType ? req.body.requestType : "";
            var request = req.body.request ? req.body.request : "";
            var subStation = req.body.subStation ? req.body.subStation : "";
            var requestDetail = req.body.requestDetail ? req.body.requestDetail : "";
            var serviceType = req.body.serviceType ? req.body.serviceType : "";
            var consumerNumber = req.body.consumerNumber ? req.body.consumerNumber : "";
            var divisionOffice = req.body.divisionOffice ? req.body.divisionOffice : "";
            var subDivisionOffice = req.body.subDivisionOffice ? req.body.subDivisionOffice : "";
            var applicantName = req.body.applicantName ? req.body.applicantName : "";
            var fatherName = req.body.fatherName ? req.body.fatherName : "";
            var house = req.body.house ? req.body.house : "";
            var streetName = req.body.streetName ? req.body.streetName : "";
            var colony = req.body.colony ? req.body.colony : "";
            var district = req.body.district ? req.body.district : "";
            var residencePhone = req.body.residencePhone ? req.body.residencePhone : "";
            var mobile = req.body.mobile ? req.body.mobile : "";
            var emailId = req.body.emailId ? req.body.emailId : "";
            var dateOfBirth = req.body.dateOfBirth ? req.body.dateOfBirth : "";
            var isApplicantTenantOrOccupier = req.body.isApplicantTenantOrOccupier ? req.body.isApplicantTenantOrOccupier : "";
            var houseOwnerName = req.body.houseOwnerName ? req.body.houseOwnerName : "";
            var houseOwnerPlot = req.body.houseOwnerPlot ? req.body.houseOwnerPlot : "";
            var houseOwnerStreetName = req.body.houseOwnerStreetName ? req.body.houseOwnerStreetName : "";
            var houseOwnerColony = req.body.houseOwnerColony ? req.body.houseOwnerColony : "";

            var houseOwnerDistrict = req.body.houseOwnerDistrict ? req.body.houseOwnerDistrict : "";
            var isCategory = req.body.isCategory ? req.body.isCategory : "";
            var existingMainCategory = req.body.existingMainCategory ? req.body.existingMainCategory : "";
            var existingSupplyCategory = req.body.existingSupplyCategory ? req.body.existingSupplyCategory : "";
            var applicantMainCategory = req.body.applicantMainCategory ? req.body.applicantMainCategory : "";
            var applicableSupplyCategory = req.body.applicableSupplyCategory ? req.body.applicableSupplyCategory : "";
            var applyLoad = req.body.applyLoad ? req.body.applyLoad : "";
            var existingLoad = req.body.existingLoad ? req.body.existingLoad : "";
            var additionalLoad = req.body.additionalLoad ? req.body.additionalLoad : "";
            var phase = req.body.phase ? req.body.phase : "";
            var applicationFee = req.body.applicationFee ? req.body.applicationFee : "";
            var proposedDateOfTempororyDisconnection = req.body.proposedDateOfTempororyDisconnection ? req.body.proposedDateOfTempororyDisconnection : "";
            var presentCategory = req.body.presentCategory ? req.body.presentCategory : "";
            var categoryToBeChangedTo = req.body.categoryToBeChangedTo ? req.body.categoryToBeChangedTo : "";
            var ownerTelephoneNumber = req.body.ownerTelephoneNumber ? req.body.ownerTelephoneNumber : "";
            //	        
            // house_number	

            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)
                && utils.str.is_not_empty(requestType)) {

                var current_datetime = require('moment')().format('YYYY-MM-DD HH:mm:ss');
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery('SELECT * FROM users  JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            var trackNumber = Math.floor(100000000 + Math.random() * 900000000);
                            userAccountArray = [[trackNumber, parseInt(userId), parseInt(account_number), requestType, request, subStation, requestDetail, serviceType, consumerNumber, divisionOffice, subDivisionOffice, applicantName, fatherName, house, streetName, colony, district, residencePhone, mobile, emailId, dateOfBirth, isApplicantTenantOrOccupier, houseOwnerName, houseOwnerPlot, houseOwnerStreetName, houseOwnerColony, houseOwnerDistrict, isCategory, existingMainCategory, existingSupplyCategory, applicantMainCategory, applicableSupplyCategory, applyLoad, existingLoad, additionalLoad, phase, applicationFee, proposedDateOfTempororyDisconnection, presentCategory, categoryToBeChangedTo, "", "", "", "", ownerTelephoneNumber, "", current_datetime, current_datetime]];
                            var sqlAccounts = "INSERT INTO service_request_rurals (tracking_number,user_id,account_number,request_type,request,sub_station,request_detail,service_type,consumer_number,division_office,sub_division_office,applicant_name,father_name,house,street_name,colony,district,residence_phone,mobile,email_id,date_of_birth,is_applicant_tenant_or_occupier,house_owner_name,house_owner_plot,house_owner_street_name,house_owner_colony,house_owner_district,is_category,existing_main_category,existing_supply_category,applicant_main_category,applicable_supply_category,apply_load,existing_load,additional_load,phase,application_fee,proposed_date_of_temporory_disconnection,present_category,category_to_be_changed_to,copy_of_sale_deed,copy_of_lease_deed,copy_of_latest_bill,noc_from_owner_of_the_premise,owner_telephone_number,copy_of_mutation_letter,created,modified) VALUES ?";
                            utils.db.executeQuery(sqlAccounts, [userAccountArray]).
                                then(function (rs, e) {
                                    if (rs) {

                                        var email = result[0].email;
                                        // if user found
                                        var filename = 'servicerequest.ejs'; // service request email template

                                        var data = { trackingNumber: trackNumber }
                                        var mailOptions = {};
                                        mailOptions['to'] = email;
                                        mailOptions['subject'] = 'Service request registered.';
                                        mailOptions['from'] = '"UPPCL " <user1.guts@gmail.com>';
                                        utils.notify.sendNotification("email", filename, mailOptions, data).then(function (resp) {

                                            response['data_params'] = trackNumber;
                                            response['authCode'] = success_code;
                                            response['msg'] = request_added;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        });
                                    } else {
                                        response['authCode'] = error_code;
                                        response['msg'] = database_error;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    })
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },

    complaintList: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.accountToken ? req.body.accountToken : "";

            var response = {};

            if (utils.str.is_not_empty(userId) && utils.str.is_not_empty(accountId)) {

                var accountId = Buffer.from(accountId.toString(), 'base64').toString('ascii');
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery('SELECT * FROM users JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            utils.db.executeQuery('SELECT * FROM complaints  WHERE user_id = ? &&  account_number = ? ',
                                [userId, accountId]).
                                then(function (resultVal) {
                                    if (resultVal) {
                                        response['data_params'] = resultVal;
                                        response['authCode'] = success_code;
                                        response['msg'] = complaint_added;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['msg'] = data_not_found;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    })
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    serviceRequestList: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.accountToken ? req.body.accountToken : "";

            var response = {};

            if (utils.str.is_not_empty(userId) && utils.str.is_not_empty(accountId)) {

                var accountId = Buffer.from(accountId.toString(), 'base64').toString('ascii');
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery('SELECT * FROM users JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? LIMIT 1', [userId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            utils.db.executeQuery('SELECT * FROM service_requests  WHERE user_id = ? &&  account_number = ? ',
                                [userId, accountId]).
                                then(function (resultVal) {
                                    if (resultVal && resultVal.length) {
                                        response['data_params'] = resultVal;
                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['msg'] = data_not_found_service;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    })
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    serviceRequestDetails: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.accountToken ? req.body.accountToken : "";
            var serviceId = req.body.serviceToken ? req.body.serviceToken : "";

            var response = {};

            if (utils.str.is_not_empty(userId) && utils.str.is_not_empty(accountId)
                && utils.str.is_not_empty(serviceId)) {

                var accountId = Buffer.from(accountId.toString(), 'base64').toString('ascii');
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                var serviceId = Buffer.from(serviceId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery('SELECT * FROM users  JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, accountId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            utils.db.executeQuery('SELECT * FROM service_requests  WHERE user_id = ? &&  account_number = ? && id = ? ',
                                [userId, accountId, serviceId]).
                                then(function (resultVal) {
                                    if (resultVal && resultVal.length) {
                                        response['data_params'] = resultVal[0];
                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['msg'] = data_not_found_service;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    })
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    complaintDetails: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.profileToken ? req.body.profileToken : "";
            var accountId = req.body.accountToken ? req.body.accountToken : "";
            var complaintId = req.body.complaintToken ? req.body.complaintToken : "";

            var response = {};

            if (utils.str.is_not_empty(userId) && utils.str.is_not_empty(accountId)
                && utils.str.is_not_empty(complaintId)) {

                var accountId = Buffer.from(accountId.toString(), 'base64').toString('ascii');
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                var complaintId = Buffer.from(complaintId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery('SELECT * FROM users  JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, accountId])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            utils.db.executeQuery('SELECT * FROM complaints  WHERE user_id = ? &&  account_number = ? && id = ? ',
                                [userId, accountId, complaintId]).
                                then(function (resultVal) {
                                    if (resultVal && resultVal.length) {
                                        response['data_params'] = resultVal[0];
                                        response['authCode'] = success_code;
                                        response['msg'] = data_listed;
                                        response['status'] = success_status_value;
                                        resolve(response);
                                    } else {
                                        response['authCode'] = error_code;
                                        response['msg'] = data_not_found;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    })
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    },
    getRuralComplaintTypes: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,complaint_type FROM rural_complaint_types  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    },
    getRuralLoadReductionPhase: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,phase FROM rural_load_reduction_phase  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    },
    getRuralLoadEnhanceMentServiceType: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,service_type FROM rural_service_load_enhancement_service_type  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    },
    getRuralServiceRequestBillingRelatedRequest: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,request FROM rural_service_request_billing_related_request  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    },
    getRuralServiceRequestRequest: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,request FROM rural_service_request_requests  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    },
    getRuralServiceRequestType: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,request_type FROM rural_service_request_type  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    },
    getRuralSupplyRelatedComplaints: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,complaints FROM rural_supply_related_complaints  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    }
    ,
    getRuralVoltageFluctuationComplaint: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,complaint FROM rural_voltage_fluctuation_complaint  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    }
    ,
    getKeskoBillingRelatedRequest: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,request FROM kesco_billing_related_requests  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    }
    ,
    getKeskoServiceRequestRequest: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,request FROM kesco_service_request_requests  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    }
    ,
    getKeskoServiceRequestType: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,request_type FROM kesco_service_request_type  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    }
    ,
    getKeskoSupplyRelatedComplaint: function (req) {
        return new Promise(function (resolve, reject) {
            var response = {};
            utils.db.executeQuery('SELECT id,complaint FROM kesco_supply_related_complaint  WHERE status = ?', [1])
                .then(function (dataval) {
                    if (dataval && dataval.length) {
                        response['data_params'] = dataval;
                        response['authCode'] = success_code;
                        response['msg'] = data_listed;
                        response['status'] = success_status_value;
                        resolve(response);
                    } else {
                        response['authCode'] = error_code;
                        response['msg'] = database_error;
                        response['status'] = failure_status_value;
                        reject(response);
                    }
                })
        });
    },


    addComplaintRural: function (req) {
        return new Promise(function (resolve, reject) {
            var userId = req.body.profileToken ? req.body.profileToken : "";
            var account_number = req.body.accountNumber ? req.body.accountNumber : "";
            var complaintType = req.body.complaintType ? req.body.complaintType : "";
            var complaint = req.body.complaint ? req.body.complaint : "";
            var subStation = req.body.subStation ? req.body.subStation : "";
            var complaintDetails = req.body.complaintDetails ? req.body.complaintDetails : ""; "";

            var response = {};

            if (utils.str.is_not_empty(account_number) && utils.str.is_not_empty(userId)
                && utils.str.is_not_empty(complaintType)) {
                var current_datetime = require('moment')().format('YYYY-MM-DD HH:mm:ss');
                var userId = Buffer.from(userId.toString(), 'base64').toString('ascii');
                utils.db.executeQuery('SELECT * FROM users  JOIN user_accounts ON (user_accounts.user_id = users.id) WHERE users.id = ? && user_accounts.account_number = ? LIMIT 1', [userId, account_number])
                    .then(function (result) { // fetch user details
                        if (result.length > 0) {
                            var trackNumber = Math.floor(100000000 + Math.random() * 9000000000);
                            userAccountArray = [[parseInt(userId), parseInt(account_number), complaintType, complaint, subStation, complaintDetails, trackNumber, current_datetime, current_datetime]];
                            var sqlAccounts = "INSERT INTO complaint_rurals (user_id, account_number,complaint_type,complaint,sub_station,complaint_details,tracking_number,created,modified) VALUES ?";
                            utils.db.executeQuery(sqlAccounts, [userAccountArray]).
                                then(function (rs, e) {
                                    if (rs) {

                                        var email = result[0].email;
                                        // if user found
                                        var filename = 'complaint.ejs'; // complaint email template
                                        var data = { trackingNumber: trackNumber }
                                        var mailOptions = {};
                                        mailOptions['to'] = email;
                                        mailOptions['subject'] = 'Complaint registered.';
                                        mailOptions['from'] = '"UPPCL " <user1.guts@gmail.com>';
                                        utils.notify.sendNotification("email", filename, mailOptions, data).then(function (resp) {

                                            response['data_params'] = trackNumber;
                                            response['authCode'] = success_code;
                                            response['msg'] = complaint_added;
                                            response['status'] = success_status_value;
                                            resolve(response);
                                        });

                                    } else {
                                        response['authCode'] = error_code;
                                        response['msg'] = database_error;
                                        response['status'] = failure_status_value;
                                        reject(response);
                                    }
                                });
                        } else {
                            response['authCode'] = error_code;
                            response['status'] = failure_status_value;
                            response['msg'] = user_is_not_exits;
                            reject(response);
                        }
                    })
            } else {
                response['authCode'] = error_code;
                response['status'] = failure_status_value;
                response['msg'] = empty_params;
                reject(response);
            }
        });
    }

};
