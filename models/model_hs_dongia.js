var mongoose = require('mongoose');
var async = require('async');
mongoose.set("bufferCommands",false);
const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/test';
//mongoose.connect(uri);
var Schema = mongoose.Schema;

var hs_dongia_Schema = new Schema({
      type:String,
      name:String,
      value:Number,
    },{collection:'hs_dongia'});


hs_dongia_Schema.methods.get_dongia = function(cb){
  var _model = this.model('hs_Dongia');
  console.log("mongoose talk:");

  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        try {
          console.log("_____________KETNOI_________GET_DONGIA_____");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.find({});
          console.log(data);
          db.close();
          console.log("Connect:"+mongoose.connection.readyState);

          if (data!==null){
            console.log(data);
            cb(data);
          }
          else {
            cb(null);
          }

        }
        catch(err){
          db.close();
          console.log(err);
          cb(null);
        }
      };
      processdata(cb);
    }
  });
};




var hs_Dongia=mongoose.model('hs_Dongia',hs_dongia_Schema);

module.exports=hs_Dongia;
