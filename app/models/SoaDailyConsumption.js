const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var SoaDailyConsumptionsSchema = new mongoose.Schema({  
    accountNumber:{ type: String},  
    month:{ type: Number},    
    year:{ type: Number}, 
    day:{ type: Number},
    consumption:{type: Number},
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('SoaDailyConsumption', SoaDailyConsumptionsSchema);

module.exports = mongoose.model('SoaDailyConsumption');