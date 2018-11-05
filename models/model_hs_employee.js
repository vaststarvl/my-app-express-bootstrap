var mongoose = require('mongoose');
var async = require('async');
mongoose.set("bufferCommands",false);
const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/test';
//mongoose.connect(uri);
var Schema = mongoose.Schema;

var hs_employee_Schema = new Schema({
      firstname:String,
      lastname:String,
      address:String,
      birthday:Date,
      dayjoining:Date,
      male:Boolean,
      cmnd:String,
      phonenumber:Array,
      class_id:String,
      he_so_luong:String,
      phu_cap:String,
      chuc_vu:String,
      parent_id:String,
      str_id:String,
    },{collection:'hs_employee'});



hs_employee_Schema.methods.findall = function(cb){
  var model  = this.model('hs_Employee');
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
                   $project:{
                     _id:1,
                     firstname:1,
                     lastname:1,
                     birthday:1,
                     dayjoining:1,
                     male:1,
                     class_id:1,
                     he_so_luong:1,
                     phu_cap:1,
                     chuc_vu:1,
                     str_id:1,
                   }
                 },
                 {
                   $lookup:{
                     from:"hs_class",
                     localField:"class_id",
                     foreignField:"str_id",
                     as:"result",
                   }
                 },
                 {
                   $project:{
                     _id:1,
                     firstname:1,
                     lastname:1,
                     birthday:1,
                     dayjoining:1,
                     male:1,
                     class_id:1,
                     class_name:{$arrayElemAt:["$result.name",0]},
                     he_so_luong:1,
                     phu_cap:1,
                     chuc_vu:1,
                     str_id:1,
                   }
                 }
               ]);
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

hs_employee_Schema.methods.findemployee = function(cb){
  var model  = this.model('hs_Employee');
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
                     localField:"parent_id",
                     foreignField:"parent_id",
                     as:"result",
                   }
                 },
                 {
                   $project:{
                     firstname:1,
                     lastname:1,
                     address:1,
                     birthday:1,
                     dayjoining:1,
                     male:1,
                     cmnd:1,
                     phonenumber:1,
                     class_id:1,
                     he_so_luong:1,
                     phu_cap:1,
                     chuc_vu:1,
                     parent_id:1,
                     str_id:1,
                     student:"$result.student_id",
                   }
                 },
                 {
                   $lookup:{
                     from:"hs_class",
                     localField:"class_id",
                     foreignField:"str_id",
                     as:"result",
                   }
                 },
                 {
                   $project:{
                     firstname:1,
                     lastname:1,
                     address:1,
                     birthday:1,
                     dayjoining:1,
                     male:1,
                     cmnd:1,
                     phonenumber:1,
                     class_id:1,
                     class_name:{$arrayElemAt:["$result.name",0]},
                     he_so_luong:1,
                     phu_cap:1,
                     chuc_vu:1,
                     parent_id:1,
                     str_id:1,
                     student:1,
                   }
                 },
                 {
                   $lookup:{
                     from:"hs_student",
                     localField:"student",
                     foreignField:"str_id",
                     as:"student",
                   }
                 },
                 {
                   $project:{
                     firstname:1,
                     lastname:1,
                     address:1,
                     birthday:1,
                     dayjoining:1,
                     male:1,
                     cmnd:1,
                     phonenumber:1,
                     class_id:1,
                     class_name:1,
                     he_so_luong:1,
                     phu_cap:1,
                     chuc_vu:1,
                     parent_id:1,
                     str_id:1,
                     "student.firstname":1,
                     "student.lastname":1,
                     "student.str_id":1,
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

var hs_Employee=mongoose.model('hs_Employee',hs_employee_Schema);

module.exports=hs_Employee;
