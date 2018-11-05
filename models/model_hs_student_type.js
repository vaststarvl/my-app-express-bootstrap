var mongoose = require('mongoose');
var async = require('async');
mongoose.set("bufferCommands",false);
const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/test';
//mongoose.connect(uri);
var Schema = mongoose.Schema;

var hs_student_type_Schema = new Schema({
      type:String,
      name:String,
      dongia_id:String,
    },{collection:'hs_student_type'});


hs_student_type_Schema.methods.get_student_type = function(cb){
  var _model = this.model('hs_Student_type');
  console.log("mongoose talk:");

  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        try {
          console.log("_____________KETNOI_________GET_Student_type_____");
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




var hs_Student_type=mongoose.model('hs_Student_type',hs_student_type_Schema);

module.exports=hs_Student_type;
