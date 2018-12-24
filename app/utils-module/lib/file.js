var stringsFunctions= require('./stringsFunctions');
var util={
    str:stringsFunctions
}

const path = require("path");
const fs = require("fs");

module.exports.uploadProfileImage=function(file){
    return new Promise(function(resolve,reject){
        const tempPath = file.path;
        const fileExtension =path.extname(file.originalname).toLowerCase();
        const newFileName=util.str.makeid().fileExtension;
        const targetPath = path.join(__dirname, "./public/uploads/profile_image"+newFileName);
        if ( fileExtension === ".png") {
            fs.rename(tempPath, targetPath, err => {
                if (err){
                    reject(err);
                    throw err;
                }else{
                    resolve('ok');
                }
            });
        } else {
          fs.unlink(tempPath, err => {
             if (err){
                reject(err);
                throw err;
            }else{
                reject('Png file is not allowed');
            } 

          });
        }
    });
        
}
module.exports.deleteFile=function(file_path){
    return new Promise(function(resolve,reject){
        delFilePath=path.join(__dirname,file_path);
        if(fs.existsSync(delFilePath)) {
            fs.unlinkSync(delFilePath);
            resolve("file deleted");
        }else{
            reject("file does not exists");
        }
    });
}