var users = require('../helpers').users;

//Create and save new user
exports.register = function (req, res) {
    //    console.log("aaya");
    users.registration(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
};
//Create and save new user
exports.FTPClient = function (req, res) {
    //    console.log("aaya");
    users.FTPClient(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
};


//login user
exports.login = function (req, res) {
    users.authentication(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
};
//get profile data
exports.getUserData = function (req, res) {
    users.getUserData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//get profile data
exports.csvImportdata = function (req, res) {
    users.csvImportdata(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.csvImportClientScalarDemo = function (req, res) {
    users.csvImportClientScalarDemo(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}


exports.csvImportdataClientScalar = function (req, res) {
    users.csvImportdataClientScalar(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//csv import client
exports.csvImportdataClient = function (req, res) {
    users.csvImportdataClient(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//end csv import
//csv data import per hour
exports.csvImportDataPerHour = function (req, res) {
    users.csvImportDataPerHour(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//csv data import per hour
exports.dailyData = function (req, res) {
    users.dailyData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//.dat parse
exports.datParser = function (req, res) {
    users.datParser(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//end parsing
//
//get consumption data amount yearly
exports.getConsumptionDataAmountYearly = function (req, res) {
    users.getConsumptionDataAmountYearly(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getConsumptionDataAmountYearlyScalar = function (req, res) {
    users.getConsumptionDataAmountYearlyScalar(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}


//get consumption data amount monthly
exports.getConsumptionDataAmountMonthly = function (req, res) {
    users.getConsumptionDataAmountMonthly(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//get consumption data amount weekly
exports.getConsumptionDataAmountWeekly = function (req, res) {
    users.getConsumptionDataAmountWeekly(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//get consumption data reading
exports.getConsumptionDataReading = function (req, res) {
    users.getConsumptionDataReading(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//get commandata
exports.commanDasboardData = function (req, res) {
    users.commanDasboardData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}



//commanDasboardDataScalar

exports.commanDasboardDataScalar = function (req, res) {
    users.commanDasboardDataScalar(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//forgot password
exports.forgotPassword = function (req, res) {
    users.forgotPassword(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
};

//OTP verify
exports.otpVerify = function (req, res) {
    users.otpVerify(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
};



//question list
exports.questionList = function (req, res) {
    users.questionList(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
};
exports.manageAccountList = function (req, res) {
    users.manageAccountList(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
};
exports.accountDetails = function (req, res) {
    users.accountDetails(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
};



exports.resetPassword = function (req, res) {
    users.resetPassword(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
};

exports.updateUserProfile = function (req, res) {
    users.updateUserProfile(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.YTDSoa = function (req, res) {
    users.YTDSoa(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.SOAytddatafromurl = function (req, res) {
    users.SOAytddatafromurl(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.YTDdatafromurlautomatic = function (req, res) {
    users.YTDdatafromurlautomatic(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.YTDGetData = function (req, res) {
    users.YTDGetData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.ODRGetData = function (req, res) {
    users.ODRGetData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.monthlyDataFromurlAutomatic = function (req, res) {
    users.monthlyDataFromurlAutomatic(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}


exports.getProfile = function (req, res) {
    users.getProfile(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.updateProfile = function (req, res) {
    users.updateProfile(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}





exports.monthlyGetData = function (req, res) {
    users.monthlyGetData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//daily start
exports.dailyDataFromurlAutomatic = function (req, res) {
    users.dailyDataFromurlAutomatic(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.dailyGetData = function (req, res) {
    users.dailyGetData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//daily ends

//hourly starts
exports.hourlyDataFromurlAutomatic = function (req, res) {
    users.hourlyDataFromurlAutomatic(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.hourlyGetData = function (req, res) {
    users.hourlyGetData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//hourly ends


//all year starts
exports.allYearlyDataFromurlAutomatic = function (req, res) {
    users.allYearlyDataFromurlAutomatic(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.allYearGetData = function (req, res) {
    users.allYearGetData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}


//all year ends

//update profile image

exports.updateProfileImage = function (req, res) {
    users.updateProfileImage(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//update profile image ends

//update Billing Type

exports.updateBillingType = function (req, res) {
    users.updateBillingType(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//update Billing Type

//Remove user Account

exports.removeAccount = function (req, res) {
    users.removeAccount(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//Remove user Account Ends

//weekly starts
exports.weeklyDataFromurlAutomatic = function (req, res) {
    users.weeklyDataFromurlAutomatic(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.weeklyGetData = function (req, res) {
    users.weeklyGetData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//weekly ends







//odr
exports.ODRSoa = function (req, res) {
    users.ODRSoa(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.ODRdatafromurl = function (req, res) {
    users.ODRdatafromurl(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.ODRdatafromurlautomatic = function (req, res) {
    users.ODRdatafromurlautomatic(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//end odr
//yearly soa
exports.ODRyearly = function (req, res) {
    users.ODRyearly(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.ODRYearlyfromurl = function (req, res) {
    users.ODRYearlyfromurl(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}


//end yearly soa

exports.SOAMonthly = function (req, res) {
    users.SOAMonthly(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.SOAMonthlygetdata = function (req, res) {
    users.SOAMonthlygetdata(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//soa daily
exports.SOAdaily = function (req, res) {
    users.SOAdaily(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.SOAdailygetdata = function (req, res) {
    users.SOAdailygetdata(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//end soa daily
//soa hourly
exports.SOAhourly = function (req, res) {
    users.SOAhourly(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.SOAhourlygetdata = function (req, res) {
    users.SOAhourlygetdata(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//end hourly
//soa yearly
exports.SOAyearly = function (req, res) {
    users.SOAyearly(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.SOAyearlygetdata = function (req, res) {
    users.SOAyearlygetdata(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//end yearly

//soa yearly
exports.SOAweekly = function (req, res) {
    users.SOAweekly(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.SOAweeklygetdata = function (req, res) {
    users.SOAweeklygetdata(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//end yearly

exports.SOAbilling = function (req, res) {
    users.SOAbilling(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}


exports.contentData = function (req, res) {
    users.contentData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

/// add account
exports.addAccount = function (req, res) {
    users.addAccount(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.SOAaddAccount = function (req, res) {
    users.SOAaddAccount(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.SOAbillingforsave = function (req, res) {
    users.SOAbillingforsave(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.SOAbillingadddata = function (req, res) {
    users.SOAbillingadddata(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.SOAaddAccountforinternal = function (req, res) {
    users.SOAaddAccountforinternal(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//ends add account
exports.excelYearlyData = function (req, res) {
    users.excelYearlyData(req).then(function (result) {
        // res.sendFile(result['data_params'], function (err) {
        //     console.log('---------- error downloading file: ' + err);
        // });

        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.excelBillingYearlyData = function (req, res) {
    users.excelBillingYearlyData(req).then(function (result) {
        // res.sendFile(result['data_params'], function (err) {
        //     console.log('---------- error downloading file: ' + err);
        // });

        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

exports.billingGraphMonthly = function (req, res) {
    users.billingGraphMonthly(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.csvImportHourlyData = function (req, res) {
    users.csvImportHourlyData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getComplaintCaseType = function (req, res) {
    users.getComplaintCaseType(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getComplaintBillRelatedReason = function (req, res) {
    users.getComplaintBillRelatedReason(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getComplaintSupplyServiceRequest = function (req, res) {
    users.getComplaintSupplyServiceRequest(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getComplaintSupplyProblem = function (req, res) {
    users.getComplaintSupplyProblem(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}


//add complaint
exports.addComplaint = function (req, res) {
    users.addComplaint(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//add complaint

//service request start
exports.getServiceRequestType = function (req, res) {
    users.getServiceRequestType(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getServiceRequestEnclosedIdentificationDocument = function (req, res) {
    users.getServiceRequestEnclosedIdentificationDocument(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getServiceRequestChangeReason = function (req, res) {
    users.getServiceRequestChangeReason(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.addServiceRequest = function (req, res) {
    users.addServiceRequest(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.complaintList = function (req, res) {
    users.complaintList(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.serviceRequestList = function (req, res) {
    users.serviceRequestList(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//net meter 

exports.NetMeterSoa = function (req, res) {
    users.NetMeterSoa(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}

//SOAnetmeterfromurls

exports.SOAnetmeterfromurls = function (req, res) {
    users.SOAnetmeterfromurls(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//getRuralComplaintTypes
exports.getRuralComplaintTypes = function (req, res) {
    users.getRuralComplaintTypes(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//
exports.getRuralLoadReductionPhase = function (req, res) {
    users.getRuralLoadReductionPhase(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//
exports.getRuralLoadEnhanceMentServiceType = function (req, res) {
    users.getRuralLoadEnhanceMentServiceType(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getRuralServiceRequestBillingRelatedRequest = function (req, res) {
    users.getRuralServiceRequestBillingRelatedRequest(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getRuralServiceRequestRequest = function (req, res) {
    users.getRuralServiceRequestRequest(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getRuralServiceRequestType = function (req, res) {
    users.getRuralServiceRequestType(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getRuralSupplyRelatedComplaints = function (req, res) {
    users.getRuralSupplyRelatedComplaints(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getRuralVoltageFluctuationComplaint = function (req, res) {
    users.getRuralVoltageFluctuationComplaint(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getKeskoBillingRelatedRequest = function (req, res) {
    users.getKeskoBillingRelatedRequest(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getKeskoServiceRequestRequest = function (req, res) {
    users.getKeskoServiceRequestRequest(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getKeskoServiceRequestType = function (req, res) {
    users.getKeskoServiceRequestType(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.getKeskoSupplyRelatedComplaint = function (req, res) {
    users.getKeskoSupplyRelatedComplaint(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.addComplaintRural = function (req, res) {
    users.addComplaintRural(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.otpVerifyRegistration = function (req, res) {
    users.otpVerifyRegistration(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//
exports.addServiceRequestRural = function (req, res) {
    users.addServiceRequestRural(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.serviceRequestDetails = function (req, res) {
    users.serviceRequestDetails(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.complaintDetails = function (req, res) {
    users.complaintDetails(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.excelAllYearConsumption = function (req, res) {
    users.excelAllYearConsumption(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.excelWeeklyData = function (req, res) {
    users.excelWeeklyData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.excelDailyData = function (req, res) {
    users.excelDailyData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
exports.excelHourlyData = function (req, res) {
    users.excelHourlyData(req).then(function (result) {
        res.json(result);
    }, function (error) {
        res.json(error);
        throw error;
    });
}
//




















//













