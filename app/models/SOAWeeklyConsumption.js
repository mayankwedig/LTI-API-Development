const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var SOAWeeklyConsumptionsSchema = new mongoose.Schema({
    accountNumber:{ type: String}, 
    year:{ type: Number},      
    month:{ type: Number}, 
    week:{ type: Number}, 
    consumption:{type: Number},
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()}
});
mongoose.model('SOAWeeklyConsumption', SOAWeeklyConsumptionsSchema);

module.exports = mongoose.model('SOAWeeklyConsumption');