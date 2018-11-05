var mongoose = require('mongoose');
var async = require('async');
mongoose.set("bufferCommands",false);
const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/test';
//mongoose.connect(uri);
var Schema = mongoose.Schema;

var hs_dayoff_Schema = new Schema({
      date:Date,
      student:Array,
      tongso_hocsinh:Number,
    },{collection:'hs_dayoff'});


hs_dayoff_Schema.methods.get_dayoff_by_date = function(cb){
  var _model = this.model('hs_Dayoff');
  console.log("mongoose talk:");
  console.log(this.date);
  let _date = this.date;


  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }
    else{
      async function processdata(cb){
        try {
          console.log("_____________KETNOI_________GET_DAYOFF_BY_DATE_____");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.aggregate([
            {
              $match:{
                date:_date,
              }
            },
            {
              $unwind:{
                path:'$student',
                preserveNullAndEmptyArrays: true,
              }
            },
            {
              $lookup:{
                from:'hs_student',
                localField:'student.student_id',
                foreignField:'str_id',
                as:'mapping',
              }
            },
            {
              $project:{
                date:1,
                tongso_hocsinh:1,
                student:{$mergeObjects:[{$arrayElemAt:["$mapping",0]},"$student"]},
              }
            },
            {
              $lookup:{
                from: 'hs_class',
                localField: 'student.class_id',
                foreignField: 'str_id',
                as: 'mapping'
              }
            },
            {
              $project:{
                _id:1,
                date:1,
                tongso_hocsinh:1,
                "student.firstname":1,
                "student.lastname":1,
                "student.address":1,
                "student.male":1,
                "student.birthday":1,
                "student.dayjoining":1,
                "student.class_id":1,
                "student.type_id":1,
                "student.student_id":1,
                "student.phep":1,
                "student.class_name":{$arrayElemAt:["$mapping.name",0]},
              }
            },
            {
              $group:{
                _id:{_id:"$_id",date:"$date",tongso_hocsinh:"$tongso_hocsinh"},
                student:{$push:"$student"},
              }
            }
          ]);
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



hs_dayoff_Schema.methods.insert_dayoff_bydate = function(count_student,cb){
  // Them Hoc Sinh Vao Danh sach dua vao NGAY
  var _model = this.model('hs_Dayoff');
  console.log('mongoose talk:');
  console.log(this.date);
  let _date = this.date;
  let _list_of_student = this.student;

   mongoose.connect(uri, function(err,db){
     if (err){
       console.log("ERROR CONNECT TO SERVER:"+err);
       cb(null);
     }else{
       async function processdata(count_student,cb){
         try{
           console.log("_____________KETNOI_________INSERT_DAYOFF_BY_DATE_____");
           console.log("Connect:"+mongoose.connection.readyState);
           var data = await _model.update(
             {date:_date},
             {
               date:_date,
               $addToSet:{student:_list_of_student},
               tongso_hocsinh:count_student,
             },
             {upsert:true,new:true},
           );
           console.log(data);
           db.close();
           console.log("Connect:"+mongoose.connection.readyState);

           if (data.n>0){
             cb(true);
           }
           else {
             cb(false);
           }

         }catch(err){
           console.log(err);
           db.close();
           console.log("Connect:"+mongoose.connection.readyState);
           cb(false);
         }
       }
       processdata(count_student,cb);
     }
   });
};

hs_dayoff_Schema.methods.remove_student_dayoff_bydate = function(student_id,cb){
  var _model = this.model('hs_Dayoff');
  console.log('mongoose talk:');
  let _date = this.date;
  let _student_id = student_id;


  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(false);
    }
    else{
      async function processdata(_student_id,cb){
        try{
          console.log("_____________KETNOI_________REMOVE_STUDENT_DAYOFF_BY_DATE_____");
          console.log("Connect:"+mongoose.connection.readyState);
          var data = await _model.findOneAndUpdate(
            {date:_date},
            {$pull:{student:{student_id:_student_id}}},
            {new:true},
          );
          if (data!==null){
            if (data.student.length>0){
              console.log(data);
              db.close();
              console.log("Connect:"+mongoose.connection.readyState);
              cb(true);
            }else{
              var result = await _model.deleteOne({date:_date});
              db.close();
              console.log("Connect:"+mongoose.connection.readyState);
              cb(true);
            }
          }
          else{
            db.close();
            console.log("Connect:"+mongoose.connection.readyState);
            cb(false);
          }
        }catch(err){
          console.log(err);
          db.close();
          console.log("Connect:"+mongoose.connection.readyState);
          cb(false);
        }
      }
      processdata(_student_id,cb);
    }
  });
};

hs_dayoff_Schema.methods.get_dayoff_phepistrue_by_month = function(startofmonth,endofmonth,cb){
  var _model = this.model('hs_Dayoff');
  console.log('mongoose talk:');


  mongoose.connect(uri,function(err,db){
    if (err){
      console.log("ERROR CONNECT TO SERVER:"+err);
      cb(null);
    }else{
      async function processdata(startofmonth,endofmonth,cb){
        try{
          console.log("_____________KETNOI_________GET_DAYOFF_BY_MONTH_____");
          console.log("Connect:"+mongoose.connection.readyState);
          console.log(startofmonth);
          console.log(endofmonth);
          var data = await _model.aggregate([
            {
              $match:{
                date:{$gte:new Date(startofmonth),$lte:new Date(endofmonth)},
              }
            },
            {
              $unwind:{
                path:"$student",
                preserveNullAndEmptyArrays:true,
              }
            },
            {
              $project:{
                student_id:"$student.student_id",
                student_phep:"$student.phep",
                date:1,
              }
            },
            {
              $match:{
                student_phep:true,
              }
            },
            {
              $group:{
                _id:"$student_id",
                list:{$push:{date:"$date",phep:"$student_phep"}},
              }
            },
            {
              $lookup:{
                  from: 'hs_student',
                  localField: '_id',
                  foreignField: 'str_id',
                  as: 'mapping',
              }
            },
            {
              $project:{
                list:1,
                firstname:{$arrayElemAt:["$mapping.firstname",0]},
                lastname:{$arrayElemAt:["$mapping.lastname",0]},
                class_id:{$arrayElemAt:["$mapping.class_id",0]},
              }
            },
            {
              $lookup:{
                  from: 'hs_class',
                  localField: 'class_id',
                  foreignField: 'str_id',
                  as: 'mapping',
              }
            },
            {
              $project:{
                id:1,
                list:1,
                firstname:1,
                lastname:1,
                class_id:1,
                class_name:{$arrayElemAt:["$mapping.name",0]},
              }
            }
          ]);
          db.close();
          console.log(data);
          console.log("Connect:"+mongoose.connection.readyState);
          if (data!==null) {
            cb(data);
          }else{
            cb(null);
          }

        }catch(err){
          console.log(err);
          db.close();
          console.log("Connect:"+mongoose.connection.readyState);
          cb(null);
        }

      };
      processdata(startofmonth,endofmonth,cb);
    }

  });
}

var hs_Dayoff=mongoose.model('hs_Dayoff',hs_dayoff_Schema);

module.exports=hs_Dayoff;
