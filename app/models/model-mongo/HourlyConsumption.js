const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var HourlyConsumptionsSchema = new mongoose.Schema({
    accountNumber:{ type: String}, 
    day:{ type: Number},   
    year:{ type: Number},  
    month:{ type: Number},      
    consumption:{type: Number},
    hour:{type: Number},
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('HourlyConsumption', HourlyConsumptionsSchema);

module.exports = mongoose.model('HourlyConsumption');