const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var ConsumptionHoursSchema = new mongoose.Schema({
    accountNumber: { type: String,  required: true },
    dates:{ type: Date,default:Date.now()},
    readKWH:{ type: Number},
    recordTiming:{ type: String},
    amount:{ type: Number,default:10.00},
  
    created:{ type: Date,default:Date.now()},
    modified:{ type: Date,default:Date.now()},
});


module.exports = mongoose.model('ConsumptionHour', ConsumptionHoursSchema);