const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var DailyConsumptionsSchema = new mongoose.Schema({
    accountNumber:{ type: String}, 
    day:{ type: Number},   
    month:{ type: Number},    
    year:{ type: Number},    
    consumption:{type: Number},
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('DailyConsumption', DailyConsumptionsSchema);

module.exports = mongoose.model('DailyConsumption');