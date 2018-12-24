const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var BillingsSchema = new mongoose.Schema({  
    accountNumber:{ type: String}, 
    bill_number :{ type: String},
    billing_date:{ type: Date,default:Date.now()},
    meter_reading_date:{ type: Date,default:Date.now()},
    meter_reading:{ type: Number},
    consumption_units:{ type: Number},
    numberOfDays:{ type: Number},
    bill_amount:{ type: Number},
    due_date:{ type: Date,default:Date.now()},
    receipt_no:{type: Number},
    payment_date:{ type: Date,default:Date.now()},
    bill_paid:{type: Number,default:1},
    billUrl :{ type: String,default:"http://103.249.98.101:82/bills/bill1.pdf"},
    //1=>Yes,2=>No
    createdOn:{ type: Date,default:Date.now()},
    modifiedOn:{ type: Date,default:Date.now()},
});
mongoose.model('Billing', BillingsSchema);

module.exports = mongoose.model('Billing');