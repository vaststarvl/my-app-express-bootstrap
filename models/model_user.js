var mongoose = require('mongoose');
mongoose.set("bufferCommands",false);
const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/test';
//mongoose.connect(uri);
var Schema = mongoose.Schema;
   /*var db = mongoose.connection;
   db.on('error',console.error.bind(console,'connection error:'));*/

var accountSchema = new Schema({
      user:String,
      pass:String,
      age:String
    },{collection:'myaccount'});


accountSchema.methods.entertoServer = function(cb){
  return mongoose.connect(uri,cb);
};

accountSchema.methods.findallAccounts = function(cb){
  return this.model('Account').find({},cb);
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

  return this.model('Account').create({user:this.user,pass:this.pass,age:this.age},cb);
};

accountSchema.methods.findAccount = function(cb){
  return this.model('Account').findOne({user:this.user,pass:this.pass},cb);
};

var Account=mongoose.model('Account',accountSchema);

/*Account.findallAccounts(function(err,accounts){
  if(err) return 0;
  return accounts;
});*/

function find(){
    /* Account.find(function(err,accounts){
       if (err) return 0;
       console.log(accounts);
       return accounts;
     });*/
     Account.find()
      .then(function (accounts){
         console.log(accounts);
          return accounts;
      });
   }




module.exports=Account;
