const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var ConsumptionsSchema = new mongoose.Schema({
    accountNumber: { type: String,  required: true },
    dates:{ type: Date,default:Date.now()},
    meterBadgeNumber:{ type: String},
    meterSeriolNumber:{ type: String},
    readKWH:{ type: Number},
    amount:{type:Number,default:0.00},
   
   
    recordGeneratedTimestamp: { type: Date,default:Date.now()},
    timeStamps:{ type: String},
   
    created:{ type: Date,default:Date.now()},
    modified:{ type: Date,default:Date.now()},
});
mongoose.model('Consumption', ConsumptionsSchema);

module.exports = mongoose.model('Consumption');