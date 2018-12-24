const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var ConsumptionMiddlesSchema = new mongoose.Schema({

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
mongoose.model('ConsumptionMiddle', ConsumptionMiddlesSchema);

module.exports = mongoose.model('ConsumptionMiddle');