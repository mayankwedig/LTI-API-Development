var utils = require('../../utils-module');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
process.env.SECRET_KEY = "lti-uppcl";
var formidable = require('formidable');
//create and save new user
var ConsumptionMiddle = require('./../../models/ConsumptionMiddle');
//ConsumptionScalars
var formidable = require('formidable');
var fs = require("fs-extra");
var async = require('async');
var moment = require('moment');
var gm = require("gm").subClass({ imageMagick: true });;

var _ = require('underscore');

var request = require('request');
var querystring = require('querystring');




module.exports = {

    getDataFromAPI: function (req) {

        
        //var formData = querystring.stringify(form);
        request({
            method: 'POST',
            uri: 'http://192.168.1.156:3000/readingdatas/getDataFromAPI',
            headers: {
                'Content-Type': 'application/json',
                'token ': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJpYXQiOjE1Mzg1NzYwOTl9.33zoIuC-2OG0QkOmYiL2O2wNU4aUxo1LktmKq9y511A'
            },
            json :'json',
            'token ': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJpYXQiOjE1Mzg1NzYwOTl9.33zoIuC-2OG0QkOmYiL2O2wNU4aUxo1LktmKq9y511A'
        }, function (error, response, bodyv) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response); // Print the response status code if a response was received
            console.log('body:', bodyv); // Print the HTML for the Google homepage.
            return;
        });
        return;

        return new Promise((resolve, reject) => {




            request({
                method: 'GET',
                uri: 'https://api.tradegecko.com/products',
                headers: { 'Authorization': 'Bearer ' + 'TOKEN HERE' }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    // res.json(body);
                }
            });

            // console.log("yeah");
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

            fs.createReadStream(inputFile)
                .pipe(csv(['AccountNumber', 'Dates', 'MeterBadgeNumber', 'MeterSerialNumber', 'ReadInKWH',
                    'RecordGeneratedTimestamp', 'timeStamps']))
                .on('data', function (e, errr) {

                    console.log(e);
                    return;
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

    }

};
