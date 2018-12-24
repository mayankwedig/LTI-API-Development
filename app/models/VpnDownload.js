const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var VpnDownloadsSchema = new mongoose.Schema({      
    name: { type: String,  required: true },   
    status:{ type: Number,default:1},
    //1==>added in db,2=>>> remains in db
    created:{ type: Date,default:Date.now()},
    modified:{ type: Date,default:Date.now()},
});
mongoose.model('VpnDownload', VpnDownloadsSchema);

module.exports = mongoose.model('VpnDownload');