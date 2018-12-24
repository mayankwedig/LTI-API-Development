const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var WeeklyConsumptionsSchema = new mongoose.Schema({
    accountNumber:{ type: String}, 
    year:{ type: Number},      
    month:{ type: Number}, 
    week:{ type: Number}, 
    consumption:{type: Number},
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('WeeklyConsumption', WeeklyConsumptionsSchema);

module.exports = mongoose.model('WeeklyConsumption');