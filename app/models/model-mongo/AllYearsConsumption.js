const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var AllYearsConsumptionsSchema = new mongoose.Schema({
    accountNumber:{ type: String}, 
    year:{ type: Number},      
    consumption:{type: Number},
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('AllYearsConsumption', AllYearsConsumptionsSchema);

module.exports = mongoose.model('AllYearsConsumption');