const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var BillingYearsSchema = new mongoose.Schema({
    accountNumber: { type: String,  required: true },    
    month:{type:Number,default:""}, 
    year:{type:Number,default:""}, 
    billingAmount:{type:Number,default:0.00},       
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('BillingYear', BillingYearsSchema);

module.exports = mongoose.model('BillingYear');