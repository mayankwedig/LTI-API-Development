module.exports = function (app) {
    var users = require('../controllers/users.controller.js');
    // Create a new User
    app.post('/users/register', users.register);
    app.post('/users/FTPClient', users.FTPClient);
    app.post('/users/login', users.login);
    app.post('/users/getProfile', users.getProfile);
    app.post('/users/updateProfile', users.updateProfile);
    app.post('/users/updateProfileImage', users.updateProfileImage);


    app.post('/users/updateBillingType', users.updateBillingType);
    app.post('/users/removeAccount', users.removeAccount);


    


    

    app.post('/users/getUserData', users.getUserData);
    app.post('/users/csvImportdataClient', users.csvImportdataClient);
    app.post('/users/csvImportdataClientScalar', users.csvImportdataClientScalar);
    app.post('/users/commanDasboardDataScalar', users.commanDasboardDataScalar);
    app.post('/users/csvImportClientScalarDemo', users.csvImportClientScalarDemo);



    app.post('/users/getConsumptionDataAmountYearly', users.getConsumptionDataAmountYearly);
    app.post('/users/getConsumptionDataAmountYearlyScalar', users.getConsumptionDataAmountYearlyScalar);



    app.post('/users/getConsumptionDataAmountMonthly', users.getConsumptionDataAmountMonthly);
    app.post('/users/getConsumptionDataReading', users.getConsumptionDataReading);
    app.post('/users/getConsumptionDataAmountWeekly', users.getConsumptionDataAmountWeekly);


    app.post('/users/csvImportDataPerHour', users.csvImportDataPerHour);
    app.post('/users/dailyData', users.dailyData);
    app.post('/users/datParser', users.datParser);

    app.post('/users/commanDasboardData', users.commanDasboardData);
    app.post('/users/updateUserProfile', users.updateUserProfile);






    //getConsumptionData
    app.post('/users/forgotpassword', users.forgotPassword);
    app.post('/users/otpVerify', users.otpVerify);
    app.post('/users/questionList', users.questionList);
    app.post('/users/manageAccountList', users.manageAccountList);
    app.post('/users/accountDetails', users.accountDetails);

    
    //change password
    app.post('/users/resetPassword', users.resetPassword);


    app.post('/users/YTDSoa', users.YTDSoa);
    app.post('/users/SOAytddatafromurl', users.SOAytddatafromurl);
    app.post('/users/SOAytddatafromurl', users.SOAytddatafromurl);
    
    app.post('/users/YTDdatafromurlautomatic', users.YTDdatafromurlautomatic);


    //start odr
    app.post('/users/ODRSoa', users.ODRSoa);
    app.post('/users/ODRdatafromurl', users.ODRdatafromurl);
    app.post('/users/ODRdatafromurlautomatic', users.ODRdatafromurlautomatic);
    app.post('/users/YTDGetData', users.YTDGetData);
    app.post('/users/ODRGetData', users.ODRGetData);

    app.post('/users/monthlyDataFromurlAutomatic', users.monthlyDataFromurlAutomatic);
    app.post('/users/monthlyGetData', users.monthlyGetData);



    //ends odr
    //yearly soa
    app.post('/users/ODRyearly', users.ODRyearly);
    app.post('/users/ODRYearlyfromurl', users.ODRYearlyfromurl);


    //ends yearly soa
    //daily start
    app.post('/users/dailyDataFromurlAutomatic', users.dailyDataFromurlAutomatic);
    app.post('/users/dailyGetData', users.dailyGetData);
    //daily ends
    //hourly start
    app.post('/users/hourlyDataFromurlAutomatic', users.hourlyDataFromurlAutomatic);
    app.post('/users/hourlyGetData', users.hourlyGetData);
    //hourly ends
    //all year start
    app.post('/users/allYearlyDataFromurlAutomatic', users.allYearlyDataFromurlAutomatic);
    app.post('/users/allYearGetData', users.allYearGetData);
    //all year ends
    //weekly start
    app.post('/users/weeklyDataFromurlAutomatic', users.weeklyDataFromurlAutomatic);
    app.post('/users/weeklyGetData', users.weeklyGetData);
    //weekly ends

    //SOAMonthly

    app.post('/users/SOAMonthly', users.SOAMonthly);
    app.post('/users/SOAMonthlygetdata', users.SOAMonthlygetdata);

    //soa daily
    app.post('/users/SOAdaily', users.SOAdaily);
    app.post('/users/SOAdailygetdata', users.SOAdailygetdata);

    //soa hourly
    app.post('/users/SOAhourly', users.SOAhourly);
    app.post('/users/SOAhourlygetdata', users.SOAhourlygetdata);

    //soa yearly
    
    app.post('/users/SOAyearly', users.SOAyearly);
    app.post('/users/SOAyearlygetdata', users.SOAyearlygetdata);
    //soa weekly
    
    app.post('/users/SOAweekly', users.SOAweekly);
    app.post('/users/SOAweeklygetdata', users.SOAweeklygetdata);

    app.post('/users/SOAbilling', users.SOAbilling);

    //contentData
    app.post('/users/contentData', users.contentData);
    //start add account
    app.post('/users/addAccount', users.addAccount);
    app.post('/users/SOAaddAccount', users.SOAaddAccount);
    app.post('/users/SOAbillingforsave', users.SOAbillingforsave);
    app.post('/users/SOAbillingadddata', users.SOAbillingadddata);

    app.post('/users/SOAaddAccountforinternal', users.SOAaddAccountforinternal);
    app.post('/users/excelYearlyData', users.excelYearlyData);
    app.post('/users/billingGraphMonthly', users.billingGraphMonthly);
    //billingGraphMonthly

    app.post('/users/excelBillingYearlyData', users.excelBillingYearlyData);

    app.post('/users/csvImportHourlyData', users.csvImportHourlyData);    

    

    
    //ends add account
    //complaints
    app.post('/users/getComplaintCaseType', users.getComplaintCaseType); 
    app.post('/users/getComplaintBillRelatedReason', users.getComplaintBillRelatedReason); 
    app.post('/users/getComplaintSupplyServiceRequest', users.getComplaintSupplyServiceRequest); 
    app.post('/users/getComplaintSupplyProblem', users.getComplaintSupplyProblem);     
    app.post('/users/addComplaint', users.addComplaint); 

    //start service requests
    app.post('/users/getServiceRequestType', users.getServiceRequestType); 
    app.post('/users/getServiceRequestEnclosedIdentificationDocument', users.getServiceRequestEnclosedIdentificationDocument); 
    app.post('/users/getServiceRequestChangeReason', users.getServiceRequestChangeReason);  
    app.post('/users/addServiceRequest', users.addServiceRequest); 
    app.post('/users/complaintList', users.complaintList); 
    app.post('/users/serviceRequestList', users.serviceRequestList); 
    //net meter
    app.post('/users/NetMeterSoa', users.NetMeterSoa); 
    app.post('/users/SOAnetmeterfromurls', users.SOAnetmeterfromurls); 
    //getRuralComplaintTypes
    app.post('/users/getRuralComplaintTypes', users.getRuralComplaintTypes); 
    app.post('/users/getRuralLoadReductionPhase', users.getRuralLoadReductionPhase); 
    //
    app.post('/users/getRuralLoadEnhanceMentServiceType', users.getRuralLoadEnhanceMentServiceType); 
    app.post('/users/getRuralServiceRequestBillingRelatedRequest', users.getRuralServiceRequestBillingRelatedRequest); 
    app.post('/users/getRuralServiceRequestRequest', users.getRuralServiceRequestRequest); 
    app.post('/users/getRuralServiceRequestType', users.getRuralServiceRequestType); 
    app.post('/users/getRuralSupplyRelatedComplaints', users.getRuralSupplyRelatedComplaints); 
    app.post('/users/getRuralVoltageFluctuationComplaint', users.getRuralVoltageFluctuationComplaint); 
    app.post('/users/getKeskoBillingRelatedRequest', users.getKeskoBillingRelatedRequest);
    app.post('/users/getKeskoServiceRequestRequest', users.getKeskoServiceRequestRequest);  
    app.post('/users/getKeskoServiceRequestType', users.getKeskoServiceRequestType);  
    app.post('/users/getKeskoSupplyRelatedComplaint', users.getKeskoSupplyRelatedComplaint);  
    app.post('/users/addComplaintRural', users.addComplaintRural);  
    app.post('/users/otpVerifyRegistration', users.otpVerifyRegistration);  
    //
    app.post('/users/addServiceRequestRural', users.addServiceRequestRural);
    app.post('/users/serviceRequestDetails', users.serviceRequestDetails);
    app.post('/users/complaintDetails', users.complaintDetails);
    app.post('/users/excelAllYearConsumption', users.excelAllYearConsumption);
    //
    app.post('/users/excelWeeklyData', users.excelWeeklyData);
    app.post('/users/excelDailyData', users.excelDailyData);
    app.post('/users/excelHourlyData', users.excelHourlyData);
    //

    
    
    
    
    
    
    
    
    
    
    

    

    
       
}