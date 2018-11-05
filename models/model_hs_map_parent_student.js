var mongoose = require('mongoose');
var async = require('async');
mongoose.set("bufferCommands",false);
const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/test';
//mongoose.connect(uri);
var Schema = mongoose.Schema;

var hs_map_parent_student_Schema = new Schema({
      student_id:String,
      parent_id:Array,
    },{collection:'hs_map_parent_student'});


hs_map_parent_student_Schema.methods.insertmap = function(cb){
  var _model = this.model('hs_Map_parent_student');
  console.log("mongoose talk:");
  console.log(this.student_id);
  let _student_id = this.student_id;
  let _parent_id = this.parent_id;


  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        try {
          console.log("_____________KETNOI_________INSERT_MAP_PARENT_STUDENT_______");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.create({student_id:_student_id,parent_id:_parent_id});
          if (data!==null){
            db.close();
            console.log("Connect:"+mongoose.connection.readyState);
            console.log(data);
            cb(data);
          }
          else {
            db.close();
            console.log("Connect:"+mongoose.connection.readyState);
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

hs_map_parent_student_Schema.methods.deletemap = function(cb){
  var _model = this.model('hs_Map_parent_student');
  console.log("mongoose talk:");
  console.log(this.student_id);
  let _student_id = this.student_id;

  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        try {
          console.log("_____________KETNOI_________DELETE_MAP_PARENT_STUDENT_______");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.deleteOne({student_id:_student_id});
          if (data!==null){
            db.close();
            console.log("Connect:"+mongoose.connection.readyState);
            console.log(data);
            cb(data);
          }
          else {
            db.close();
            console.log("Connect:"+mongoose.connection.readyState);
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


hs_map_parent_student_Schema.methods.findstudent_who_has_siblings = function(cb){
  let _model = this.model('hs_Map_parent_student');
  console.log("mongoose talk:");

  mongoose.connect(uri,function(err,db){
    if (err) {
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        try{
          console.log("_____________KETNOI_________FIND_STUDENT_WHO_HAS_SIBLINGS____");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.aggregate([
            {
              $group:{
                _id:{parent_list:"$parent_id"},
                count:{$sum:1},
                student_list:{"$push":"$student_id"},
              }
            },
            {
              $match:{
                count:{$gt:1},
              }
            },
            {
              $project:{
                _id:0,
                student_list:1,
              }
            },
            {
              $unwind:{
                path:"$student_list",
                includeArrayIndex: "index",
                preserveNullAndEmptyArrays:true,
              }
            },
            {
              $lookup:{
                from:'hs_student',
                localField:'student_list',
                foreignField:'str_id',
                as:'list_of_student',
              }
            },
            {
              $replaceRoot:{
                newRoot:{$mergeObjects:[{$arrayElemAt:["$list_of_student",0]},"$$ROOT"]},
              }
            },
            {
              $project:{
                list_of_student:0,
              }
            },
            {
              $lookup:{
                from:'hs_class',
                localField:'class_id',
                foreignField:'str_id',
                as:'class_name',
              }
            },
            {
              $project:{
                firstname:1,
                lastname:1,
                address:1,
                male:1,
                birthday:1,
                dayjoining:1,
                type_id:1,
                str_id:1,
                class_id:1,
                class_name:{$arrayElemAt:['$class_name.name',0]},
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

hs_map_parent_student_Schema.methods.findstudent_who_has_parent_is_employee = function(cb){
  let _model = this.model('hs_Map_parent_student');
  console.log("mongoose talk:");

  mongoose.connect(uri,function(err,db){
    if (err) {
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        try{
          console.log("_____________KETNOI_________FIND_STUDENT_WHO_HAS_PARENT IS EMPLOYEE____");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.aggregate([
            {
              $lookup:{
                from:'hs_employee',
                localField:'parent_id',
                foreignField:'parent_id',
                as:'mapping',
              }
            },
            {
              $match:{
                mapping:{$ne:[]},
              }
            },
            {
              $project:{
                student_id:1,
              }
            },
            {
              $lookup:{
                from:'hs_student',
                localField:'student_id',
                foreignField:'str_id',
                as:'result',
              }
            },
            {
              $replaceRoot:{
                newRoot:{$arrayElemAt:['$result',0]},
              }
            },
            {
              $lookup:{
                from:'hs_class',
                localField:'class_id',
                foreignField:'str_id',
                as:'class_name',
              }
            },
            {
              $project:{
                firstname:1,
                lastname:1,
                address:1,
                male:1,
                birthday:1,
                dayjoining:1,
                type_id:1,
                str_id:1,
                class_id:1,
                class_name:{$arrayElemAt:['$class_name.name',0]},
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

var hs_Map_parent_student=mongoose.model('hs_Map_parent_student',hs_map_parent_student_Schema);

module.exports=hs_Map_parent_student;
