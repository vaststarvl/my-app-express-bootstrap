var mongoose = require('mongoose');
var async = require('async');
mongoose.set("bufferCommands",false);
const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/test';
//mongoose.connect(uri);
var Schema = mongoose.Schema;

var hs_student_Schema = new Schema({
      firstname:String,
      lastname:String,
      address:String,
      male:Boolean,
      birthday:Date,
      dayjoining:Date,
      class_id:String,
      type_id:String,
      str_id:String,
    },{collection:'hs_student'});



hs_student_Schema.methods.findall = function(cb){
  var model  = this.model('hs_Student');
    mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDALL"+err);
           cb(null);
         }
         else{
           async function processdata(cb){
             try {
               console.log("_____________KETNOI_________FIND_ALL__");
               console.log("Connect:"+mongoose.connection.readyState);
               //var data = await model.find({});
               var data = await model.aggregate([
                 {
                   $lookup:{
                     from: 'hs_class',
                     localField: 'class_id',
                     foreignField: 'str_id',
                     as: 'mapping'
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
                     class_name:{$arrayElemAt:["$mapping.name",0]},
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

hs_student_Schema.methods.get_all_name = function(cb){
  var model  = this.model('hs_Student');
    mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDALL"+err);
           cb(null);
         }
         else{
           async function processdata(cb){
             try {
               console.log("_____________KETNOI_________FIND_ALL__");
               console.log("Connect:"+mongoose.connection.readyState);
               //var data = await model.find({});
               var data = await model.aggregate([
                 {
                   $project:{
                     firstname:1,
                     lastname:1,
                     str_id:1,
                     class_id:1,
                   }
                 },
                 {
                   $lookup:{
                     from:'hs_class',
                     localField:'class_id',
                     foreignField:'str_id',
                     as:'mapping',
                   }
                 },
                 {
                   $project:{
                     firstname:1,
                     lastname:1,
                     str_id:1,
                     class_name:{$arrayElemAt:["$mapping.name",0]},
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

hs_student_Schema.methods.findstudent = function(cb){
  var model  = this.model('hs_Student');
  const _str_id = this.str_id;
    mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDALL"+err);
           cb(null);
         }
         else{
           async function processdata(cb){
             try {
               console.log("_____________KETNOI_________FIND_ONE__");
               console.log("Connect:"+mongoose.connection.readyState);
               //var data = await model.find({});
               var data = await model.aggregate([
                 {
                   $match:{
                     str_id:_str_id,
                   }
                 },
                 {
                   $lookup:{
                     from: 'hs_map_parent_student',
                     localField: 'str_id',
                     foreignField: 'student_id',
                     as: 'mapping'
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
                     class_id:1,
                     type_id:1,
                     str_id:1,
                     parent:{$arrayElemAt:["$mapping.parent_id",0]},
                   }
                 },
                 {
                   $lookup:{
                     from: 'hs_map_parent_student',
                     localField: 'parent',
                     foreignField: 'parent_id',
                     as: 'mapping'
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
                     class_id:1,
                     type_id:1,
                     str_id:1,
                     parent:1,
                     sibling:"$mapping.student_id",
                   }
                 },
                 {
                   $project:{
                       firstname: 1,
                       lastname: 1,
                       address: 1,
                       male: 1,
                       birthday: 1,
                       dayjoining: 1,
                       class_id: 1,
                       type_id: 1,
                       str_id: 1,
                       parent: 1,
                       sibling: {
                         $filter: {
                           input: "$sibling",
                           as: "item",
                           cond: {
                             $ne: ["$$item", "$str_id"]
                           }
                         }
                       }
                    }
                  },
                 {
                   $lookup:{
                     from: 'hs_employee',
                     localField: 'parent',
                     foreignField: 'parent_id',
                     as: 'employee'
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
                     class_id:1,
                     type_id:1,
                     str_id:1,
                     parent:1,
                     sibling:1,
                     employee:"$employee.str_id",
                   }
                 },
                 {
                   $lookup:{
                     from: 'hs_class',
                     localField: 'class_id',
                     foreignField: 'str_id',
                     as: 'result'
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
                     class_id:1,
                     class_name:{$arrayElemAt:["$result.name",0]},
                     type_id:1,
                     str_id:1,
                     parent:1,
                     sibling:1,
                     employee:1,
                   }
                 },
                 {
                   $lookup:{
                     from:'hs_parent',
                     localField:'parent',
                     foreignField:'str_id',
                     as:'result'
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
                     class_id:1,
                     class_name:1,
                     type_id:1,
                     str_id:1,
                     parent:"$result",
                     sibling:1,
                     employee:1,
                   }
                 },
                 {
                   $lookup:{
                     from:'hs_student',
                     localField:'sibling',
                     foreignField:'str_id',
                     as:'result'
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
                     class_id:1,
                     class_name:1,
                     type_id:1,
                     str_id:1,
                     parent:1,
                     sibling:"$result",
                     employee:1,
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
                     class_id:1,
                     class_name:1,
                     type_id:1,
                     str_id:1,
                     "parent.str_id":1,
                     "parent.firstname":1,
                     "parent.lastname":1,
                     "sibling.str_id":1,
                     "sibling.firstname":1,
                     "sibling.lastname":1,
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

hs_student_Schema.methods.findstudent_fordayoff = function(date,cb){
  var model  = this.model('hs_Student');
  let _date = date;
  console.log(_date);

  mongoose.connect(uri,function(err,db){
         if (err){
           console.log("ERROR FINDALL"+err);
           cb(null);
         }
         else{
           async function processdata(_date,cb){
             try {
               console.log("_____________KETNOI_________FIND_STUDENT_FOR_DAYOFF__");
               console.log("Connect:"+mongoose.connection.readyState);
               //var data = await model.find({});
               console.log(_date);
               var data = await model.aggregate([
                 {
                   $lookup:{
                      from: 'hs_dayoff',
                      let: {str:'$str_id'},
                      pipeline:[
                        {
                          $match:{
                            date:new Date(_date),
                          }
                        },
                        {
                          $project:{
                            'student.student_id':1,
                            flag:{$in:['$$str','$student.student_id']},
                          }
                        },

                      ],
                      as: 'mapping',
                   }
                 },
                 {
                   $project:{
                     _id:1,
                    firstname:1,
                    lastname:1,
                    address:1,
                    male:1,
                    birthday:1,
                    dayjoining:1,
                    class_id:1,
                    type_id:1,
                    str_id:1,
                    flag:{
                      $ifNull:[{$arrayElemAt:['$mapping.flag',0]},false]
                    }
                   }
                 },
                 {
                   $match:{
                     flag:false
                   }
                 },
                 {
                   $lookup:{
                     from: 'hs_class',
                     localField: 'class_id',
                     foreignField: 'str_id',
                     as: 'mapping'
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
                     class_name:{$arrayElemAt:["$mapping.name",0]},
                   }
                 },
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
           processdata(_date,cb);
      }
    });
};


hs_student_Schema.methods.findstudent_whohassiblings = function(cb){
  var _model = this.model('hs_Student');
  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        console.log("_____________KETNOI_________FIND_STUDEN WHO HAS SIBLINGS__");
        console.log("Connect:"+mongoose.connection.readyState);
        var data = await _model.aggregate([
          {

          },
        ]);
      };
      processdata(cb);
    }
  });
};



hs_student_Schema.methods.insertstudent = function(cb){
  var _model = this.model('hs_Student');
  console.log("mongoose talk:");
  console.log(this.firstname);
  let _firstname = this.firstname;
  let _lastname = this.lastname;
  let _male = this.male;
  let _birthday = this.birthday;
  let _address = this.address;
  let _class_id = this.class_id;
  let _dayjoining = this.dayjoining;
  let _type_id = this.type_id;

  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        try {
          console.log("_____________KETNOI_________CREATE_ACCOUNT");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.create({firstname:_firstname,lastname:_lastname,male:_male,birthday:_birthday,address:_address,class_id:_class_id,dayjoining:_dayjoining,type_id:_type_id});
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
};


hs_student_Schema.methods.deletestudent = function(cb){
  var _model = this.model('hs_Student');
  console.log("mongoose talk:");
  console.log(this.str_id);
  let _str_id = this.str_id;

  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        try {
          console.log("_____________KETNOI_________DELETE_STUDENT");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.deleteOne({str_id:_str_id});
          console.log(data);
          if (data!==null){
                db.close();
                console.log("Connect:"+mongoose.connection.readyState);
                cb(data);
            } else{
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
};


hs_student_Schema.methods.countstudent = function(cb){
  let _model = this.model('hs_Student');
  console.log("mongoose talk:");

  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }else{
      async function processdata(cb){
        try {
          console.log("_____________KETNOI_________COUNT_STUDENT");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.find({}).count();
          console.log(data);
          if (data!==null){
                db.close();
                console.log("Connect:"+mongoose.connection.readyState);
                cb(data);
            } else{
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

var hs_Student=mongoose.model('hs_Student',hs_student_Schema);

module.exports=hs_Student;
