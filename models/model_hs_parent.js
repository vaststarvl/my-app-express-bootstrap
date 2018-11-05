var mongoose = require('mongoose');
var async = require('async');
mongoose.set("bufferCommands",false);
const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/test';
//mongoose.connect(uri);
var Schema = mongoose.Schema;

var hs_parent_Schema = new Schema({
      firstname:String,
      lastname:String,
      address:String,
      birthday:Date,
      male:Boolean,
      cmnd:String,
      phonenumber:Array,
      str_id:String,
    },{collection:'hs_parent'});



hs_parent_Schema.methods.findall = function(cb){
  var model  = this.model('hs_Parent');
    mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDALL"+err);
           cb(null);
         }
         else{
           async function processdata(cb){
             try {
               console.log("_____________KETNOI_________FIND_ALL");
               console.log("Connect:"+mongoose.connection.readyState);
               var data = await model.find({});
               console.log(data);
               db.close();
               console.log("Connect:"+mongoose.connection.readyState);
               if (data!==null) cb(data);
               else cb(null);
             }
             catch(err){
               console.log(err);
               db.close();
               cb(null);
             }
           };
           processdata(cb);
      }
    });
};

hs_parent_Schema.methods.findparent = function(cb){
  var model  = this.model('hs_Parent');
  const str_id = this.str_id;
    mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDALL"+err);
           cb(null);
         }
         else{
           async function processdata(cb){
             try {
               console.log("_____________KETNOI_________FIND_ALL");
               console.log("Connect:"+mongoose.connection.readyState);
               //var data = await model.find({});
               var data = await model.aggregate([
                 {
                   $match:{
                     str_id:str_id,
                   }
                 },
                 {
                   $lookup:{
                     from:"hs_map_parent_student",
                     localField:"str_id",
                     foreignField:"parent_id",
                     as:"result"
                   }
                 },
                 {
                   $project:{
                     firstname:1,
                     lastname:1,
                     address:1,
                     birthday:1,
                     male:1,
                     cmnd:1,
                     phonenumber:1,
                     str_id:1,
                     family:{$arrayElemAt:["$result.parent_id",0]},
                     student:"$result.student_id",
                   }
                 },
                 {
                   $project:{
                     firstname:1,
                     lastname:1,
                     address:1,
                     birthday:1,
                     male:1,
                     cmnd:1,
                     phonenumber:1,
                     str_id:1,
                     family:{
                       $filter: {
                         input: "$family",
                         as: "item",
                         cond: {
                           $ne: ["$$item", "$str_id"]
                         }
                       }
                     },
                     student:1,
                   }
                 },
                 {
                   $lookup:{
                     from:"hs_employee",
                     localField:"str_id",
                     foreignField:"parent_id",
                     as:"result"
                   }
                 },
                 {
                   $project:{
                     firstname:1,
                     lastname:1,
                     address:1,
                     birthday:1,
                     male:1,
                     cmnd:1,
                     phonenumber:1,
                     str_id:1,
                     family:1,
                     student:1,
                     employee:"$result.str_id"
                   }
                 },
                 {
                   $lookup:{
                     from:"hs_student",
                     localField:"student",
                     foreignField:"str_id",
                     as:"student"
                   }
                 },
                 {
                   $project:{
                     firstname:1,
                     lastname:1,
                     address:1,
                     birthday:1,
                     male:1,
                     cmnd:1,
                     phonenumber:1,
                     str_id:1,
                     family:1,
                     "student.str_id":1,
                     "student.firstname":1,
                     "student.lastname":1,
                     employee:1,
                   }
                 },
                 {
                   $lookup:{
                     from:"hs_parent",
                     localField:"family",
                     foreignField:"str_id",
                     as:"family"
                   }
                 },
                 {
                   $project:{
                     firstname:1,
                     lastname:1,
                     address:1,
                     birthday:1,
                     male:1,
                     cmnd:1,
                     phonenumber:1,
                     str_id:1,
                     "student.str_id":1,
                     "student.firstname":1,
                     "student.lastname":1,
                     "family.str_id":1,
                     "family.firstname":1,
                     "family.lastname":1,
                     employee:1,
                   }
                 }
               ]);

               console.log(data);
               db.close();
               console.log("Connect:"+mongoose.connection.readyState);
               if ((data!==null)&&(data.length>0)) cb(data);
               else cb(null);
             }
             catch(err){
               console.log(err);
               db.close();
               cb(null);
             }
           };
           processdata(cb);
      }
    });
};

hs_parent_Schema.methods.findbyphonenumber = function(phone,cb){
  var model  = this.model('hs_Parent');
    mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDALL"+err);
           cb(null);
         }
         else{
           async function processdata(cb){
             try {
               console.log("_____________KETNOI_________FIND_ALL");
               console.log("Connect:"+mongoose.connection.readyState);
               var data = await model.aggregate([
                 {
                   $match:{
                     phonenumber:phone,
                   }
                 },
                 {
                   $project:{
                     _id:0,
                     str_id:1
                   }
                 }
               ]);
               console.log(data);
               db.close();
               console.log("Connect:"+mongoose.connection.readyState);
               if ((data!==null)&&(data.length>0)) cb(data);
               else cb(null);
             }
             catch(err){
               console.log(err);
               db.close();
               cb(null);
             }
           };
           processdata(cb);
      }
    });
};

hs_parent_Schema.methods.insertparent = function(cb){
  var _model = this.model('hs_Parent');
  console.log("mongoose talk:");
  console.log(this.firstname);
  let _firstname = this.firstname;
  let _lastname = this.lastname;
  let _male = this.male;
  let _birthday = this.birthday;
  let _address = this.address;
  let _cmnd = this.cmnd;
  let _phonenumber = this.phonenumber;

  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        try {
          console.log("_____________KETNOI_________CREATE_PARENT______");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.create({firstname:_firstname,lastname:_lastname,male:_male,birthday:_birthday,address:_address,cmnd:_cmnd,phonenumber:_phonenumber});
          console.log(data);
          if (data!==null){
            var update = await _model.updateOne({_id:data.id},{str_id:data.id.toString()});
            console.log(update);
            if ((update!==null)&&(update.n!==0)) {
              db.close();
              console.log("Connect:"+mongoose.connection.readyState);
              cb(data);
            } else{
                var del = await _model.deleteOne({_id:data.id});
                db.close();
                console.log("Connect:"+mongoose.connection.readyState);
                cb(null);
              }
          } else {
            db.close();
            console.log("Connect:"+mongoose.connection.readyState);
            cb(null);
          }

        }
        catch(err){
          console.log(err);
          db.close();
          cb(null);
        }
      };
      processdata(cb);
    }
  });
}



/*
accountSchema.methods.findAccount = function(cb){
  var model  = this.model('Account');
  var user = this.user;
  var pass = this.pass;
  console.log(this.user);

    mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDONE:"+err);
           cb("err=002");
         }
         else{
          async function processdata(cb){
          try {
            console.log("_____________KETNOI_________FIND_ONE");
            console.log("Connect:"+mongoose.connection.readyState);
            var data = await model.findOne({user:user,pass:pass});
            console.log(data);
            db.close();
            console.log("Connect:"+mongoose.connection.readyState);
            if (data!==null) cb(data);
            else cb("err=001");
          }
          catch(err){
            console.log(err);
            db.close();
            cb("err=002");
          }
        };

        processdata(cb);

      }
    });
};


accountSchema.methods.findUser = function(cb){
  var model  = this.model('Account');
  var user = this.user;
  console.log(this.user);

    mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDALL"+err);
           cb(null);
         }
         else{
           async function processdata(cb){
             try {
               console.log("_____________KETNOI_________FIND_USER");
               console.log("Connect:"+mongoose.connection.readyState);
               var data = await model.findOne({user:user});
               console.log(data);
               db.close();
               console.log("Connect:"+mongoose.connection.readyState);
               if (data!==null) cb(data);
               else cb(null);
             }
             catch(err){
               console.log(err);
               db.close();
               cb(null);
             }
           };
           processdata(cb);
      }
    });
};




accountSchema.methods.addAccount2 = function(cb){
  this.entertoServer(function(err,db){
    if (err) return false;
    this.findAccount(function(account,err){
      if (err) return false;
      if (account) return false;

      this.model('Account').create({user:this.user,pass:this.pass,age:this.age});
      db.close();
      return true;
    });
  });
};

accountSchema.methods.addAccount = function(cb){
  var model  = this.model('Account');
  var user = this.user;
  var pass = this.pass;
  var age = this.age;
  console.log(this.user);

    mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDALL"+err);
           cb(null);
         }
         else{
           async function processdata(cb){
             try {
               console.log("_____________KETNOI_________FIND_ADD_ACCOUNT");
               console.log("Connect:"+mongoose.connection.readyState);
               var user_exist = await model.findOne({user:user});
               if (!user_exist){
                 var data = await model.create({user:user,pass:pass,age:age});
                 console.log(data);
                 db.close();
                 console.log("Connect:"+mongoose.connection.readyState);
                 if (data!==null) cb(data);
                 else cb(null);
               }
              else {
                db.close();
                console.log("Tai Khoan _[ "+user+" ]_  da Ton Tai!");
                console.log("Connect:"+mongoose.connection.readyState);
                cb(null);
              }
            }
             catch(err){
               console.log(err);
               db.close();
               cb(null);
             }
           };
           processdata(cb);
      }
    });
};


accountSchema.methods.deleteAccount = function(cb){
    var model  = this.model('Account');
    var user = this.user;
    console.log(this.user);

      mongoose.connect(uri,function(err,db){
           if (err){
             console.log("ERROR FINDALL"+err);
             cb(null);
           }
           else{
             async function processdata(cb){
               try {
                 console.log("_____________KETNOI_________DELETE_USER");
                 console.log("Connect:"+mongoose.connection.readyState);
                 var data = await model.deleteOne({user:user});
                 console.log(data);
                 db.close();
                 console.log("Connect:"+mongoose.connection.readyState);
                 if (data!==null) {
                   if (data.n!==0) cb(data);
                   else cb(null);
                 }
                 else cb(null);
               }
               catch(err){
                 console.log(err);
                 db.close();
                 cb(null);
               }
             };
             processdata(cb);
        }
      });
};

accountSchema.methods.updateAccount = function(cb){
  var model  = this.model('Account');
  var user = this.user;
  var pass = this.pass;
  var age = this.age;
  console.log(this.user);

    mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDALL"+err);
           cb(null);
         }
         else{
           async function processdata(cb){
             try {
               console.log("_____________KETNOI_________UPDATE_USER");
               console.log("Connect:"+mongoose.connection.readyState);
               var data = await model.updateOne({user:user},{pass:pass,age:age});
               console.log(data);
               db.close();
               console.log("Connect:"+mongoose.connection.readyState);
               if (data!==null) {
                 if (data.n!==0) cb(data);
                 else cb(null);
               }
               else cb(null);
             }
             catch(err){
               console.log(err);
               db.close();
               cb(null);
             }
           };
           processdata(cb);
      }
    });
};*/

var hs_Parent=mongoose.model('hs_Parent',hs_parent_Schema);

module.exports=hs_Parent;
