const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var ConsumptionODRsSchema = new mongoose.Schema({
    accountNumber: { type: String,  required: true }, 
    meterBadgeNumber:{ type: String},
    meterSerialNumber:{ type: String},
    latestConsumption:{ type: Number}, 
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('ConsumptionODR', ConsumptionODRsSchema);

module.exports = mongoose.model('ConsumptionODR');