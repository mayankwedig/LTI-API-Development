const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var SoaMonthlyConsumptionsSchema = new mongoose.Schema({  
    accountNumber:{ type: String},  
    month:{ type: Number},    
    year:{ type: Number}, 
    consumption:{type: Number},
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('SoaMonthlyConsumption', SoaMonthlyConsumptionsSchema);

module.exports = mongoose.model('SoaMonthlyConsumption');