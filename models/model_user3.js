var mongoose = require('mongoose');
var async = require('async');
mongoose.set("bufferCommands",false);
const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/test';
//mongoose.connect(uri);
var Schema = mongoose.Schema;

var accountSchema = new Schema({
      user:String,
      pass:String,
      age:String
    },{collection:'myaccount'});


accountSchema.methods.entertoServer = function(cb){
  return mongoose.connect(uri,cb);
};

accountSchema.methods.findallAccounts = function(cb){
  var model  = this.model('Account');
  console.log(this.user);

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
};

var Account=mongoose.model('Account',accountSchema);

module.exports=Account;
