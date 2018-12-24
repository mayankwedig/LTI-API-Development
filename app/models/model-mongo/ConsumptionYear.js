const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var ConsumptionYearsSchema = new mongoose.Schema({  
    accountNumber:{ type: String},  
    month:{ type: Number},    
    year:{ type: Number}, 
    consumption:{type: Number},
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('ConsumptionYear', ConsumptionYearsSchema);

module.exports = mongoose.model('ConsumptionYear');