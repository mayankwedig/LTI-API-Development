const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var SoaYearlyConsumptionsSchema = new mongoose.Schema({
    accountNumber:{ type: String}, 
    year:{ type: Number},      
    consumption:{type: Number},
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('SoaYearlyConsumption', SoaYearlyConsumptionsSchema);

module.exports = mongoose.model('SoaYearlyConsumption');