const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var ConsumptionYTDsSchema = new mongoose.Schema({
    accountNumber: { type: String,  required: true }, 
    meterBadgeNumber:{ type: String},
    meterSerialNumber:{ type: String},
    YesterdayConsumption:{ type: Number},
    amount:{type:Number,default:0.00},  
    recordGeneratedTimestamp: { type: Date,default:Date.now()},
    yeartodateconsumtion:{ type: Number},    
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('ConsumptionYTD', ConsumptionYTDsSchema);

module.exports = mongoose.model('ConsumptionYTD');