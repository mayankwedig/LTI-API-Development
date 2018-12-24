const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var SoaHourlyConsumptionsSchema = new mongoose.Schema({  
    accountNumber:{ type: String},  
    month:{ type: Number},    
    year:{ type: Number}, 
    day:{ type: Number},

    hour:{ type: Number},
    consumption:{type: Number},
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('SoaHourlyConsumption', SoaHourlyConsumptionsSchema);

module.exports = mongoose.model('SoaHourlyConsumption');