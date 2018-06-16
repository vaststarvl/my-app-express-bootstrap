var express = require('express');
var account = require('../models/model_user2');
var router = express.Router();

//var mongoose = require('mongoose');
//const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/test';
//mongoose.connect(uri);
//var Schema = mongoose.Schema;
   /*var db = mongoose.connection;
   db.on('error',console.error.bind(console,'connection error:'));*/

/*var accountSchema = new Schema({
      user:String,
      pass:String,
      age:String
    },{collection:'myaccount'});

//var Account=mongoose.model('Account',accountSchema);




/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(req.params.name);
  res.render('index', {
    title: 'Express',
    parameter: ''
  });
});

router.get('/user', function(req, res, next) {
  console.log(req.query);
  res.render('user_name', {
    name: req.query.name,
    age: req.query.age
  });
});


router.get('/user_mongodb', function(req, res, next) {
  mongoose.connect(uri)
   .then(
     ()=>{
       var db = mongoose.connection;
         Account.find(function(err,accounts){
            if (err) res.render('user_name_mongodb',{err:0,data:undefined});
            else{
            console.log(accounts);
            res.render('user_name_mongodb',{err:1,data:accounts});
           }
          });

     },
     err=>{
       console.log(err);
       res.render('user_name_mongodb',{err:0,data:undefined});

     }
   );
});


router.get('/user_mongodb_model', function(req, res, next) {
    /*var myaccount = new account();

    myaccount.findallAccounts(function(err,accounts){
      if(err)  {
        console.log(err);
        res.render('user_name_mongodb',{err:0,data:undefined});
      }
      else{
        console.log(accounts);
        res.render('user_name_mongodb',{err:1,data:accounts});
      }

    });*/

    var myaccount = new account();
    myaccount.entertoServer(function(err,db){
      if (err) res.render('user_name_mongodb',{err:0,data:undefined});
      myaccount.findallAccounts()
        .then(
          (accounts)=>{
              console.log(accounts);
              res.render('user_name_mongodb',{err:1,data:accounts});
              db.close();
          }
        )
        .catch(err=>{
          console.log(err);
          res.render('user_name_mongodb',{err:0,data:undefined});
        });

    });


});

router.get('/user_panel/', function(req, res, next) {
  console.log(req.session);
  if (req.session.flag===true){
    var myaccount = new account();
      myaccount.findallAccounts()
        .then(
          (accounts)=>{
              console.log(accounts);
              res.render('user_name_mongodb',{err:1,data:accounts});

          }

        ).catch(err=>{
          console.log(err);
          res.render('user_name_mongodb',{err:0,data:undefined});
        });


  }
  else res.send("FAIL!");

});



router.get('/user_login',function(req, res, next){
  var query = req.query;
  console.log(query);
  if (query.err)
  {
    res.render('user_login',{err:query.err,});
  }
  else
  res.render('user_login',{err:null});
});

router.get('/user_login_jquery',function(req, res, next){
  var query = req.query;
  console.log(query);
  if (query.err)
  {
    res.render('user_login_jquery_ajax',{err:query.err,});
  }
  else
  res.render('user_login_jquery_ajax',{err:null});
});

router.post('/login',function(req, res, next){

//    console.log(account.connection.readyState);
    var myaccount = new account({
      user:req.body.user,
      pass:req.body.pass
    });



/*  try{
      myaccount.findAccount(function(err,account){
          if (account){
            console.log(account);
            req.session.flag = true;
            res.redirect("/user_panel/");
          } else res.redirect("/user_login?err=001");
      });
    }catch(err){
      console.log(err);
      res.redirect("/user_login?err="+err);
    }*/

  myaccount.findAccount(function(err,result){
    if (err) {
      console.log(err);
      res.redirect("/user_login?err=002");
      }
    else{
      console.log("server:"+result);
      if (result) {
        console.log("server:"+result);
        req.session.flag = true;
        res.redirect("/user_panel/");
        }
      else res.redirect("/user_login?err=001");
    }
  });

});


router.post("/login_ajax",function(req,res,next){
  console.log("ajax");
  console.log(req.body);
  var myaccount ={
    user:req.body.user,
    pass:req.body.pass
  };
  res.setHeader("Conten-Type","application/json")
  res.send(JSON.stringify(myaccount));
});

router.get("/user_resigter",function(req,res,next){
  res.render("user_resigter",{err:null});
});

router.post("/resigter",function(req,res,next){
  var myaccount = new account({
    user:req.body.user,
    pass:req.body.pass,
    age:req.body.age
  });

  console.log(myaccount.user);

  /*myaccount.addAccount(function(err,result){
    if (err){
      console.log(err);
      res.setHeader("Content-Type","application/json");
      res.send(JSON.stringify({flag:"fail"}));
    } else{
      if (result){
        console.log(result);
        res.setHeader("Content-Type","application/json");
        res.send(JSON.stringify({flag:"true"}));
      }
      else{
        res.setHeader("Content-Type","application/json");
        res.send(JSON.stringify({flag:"fail"}));
      }
    }
  });*/

    myaccount.findUser()
      .then((result)=>{
        if (!result){
          myaccount.addAccount()
           .then((result)=>{
             if (result){
               console.log(result);
               res.setHeader("Content-Type","application/json");
               res.send(JSON.stringify({flag:"true"}));
             }
             else{
               res.setHeader("Content-Type","application/json");
               res.send(JSON.stringify({flag:"false"}));
             }
           })
           .catch((err)=>{
             console.log(err);
             res.setHeader("Content-Type","application/json");
             res.send(JSON.stringify({flag:"false"}));
           });
        }
        else{
          console.log("Tài Khoản đã được sử dụng!");
          res.setHeader("Content-Type","application/json");
          res.send(JSON.stringify({flag:"false"}));
        }
      })
      .catch((err)=>{
          console.log(err);
          res.setHeader("Content-Type","application/json");
          res.send(JSON.stringify({flag:"false"}));
        });


});

router.get("/user_modify",function(req,res,next){
  var myaccount = new account();
    myaccount.findallAccounts()
      .then(
        (accounts)=>{
            console.log(accounts);
            res.render('user_name_mongodb_modify',{err:1,data:accounts});
        }

      ).catch(err=>{
        console.log(err);
        res.render('user_name_mongodb_modify',{err:0,data:undefined});
      });
});

router.post("/delete",function(req,res,next){
  //delete
  var myaccount = new account({
    user:req.body.user,
    pass:req.body.pass
  });

  myaccount.deleteAccount()
    .then((result)=>{
      if (result.n==0){
        console.log("XOA KHONG THANH CONG!");
        res.setHeader("Content-Type","application/json");
        res.send(JSON.stringify({flag:false}));
      }
      else{
        console.log("XOA THANH CONG");
        res.setHeader("Content-Type","application/json");
        res.send(JSON.stringify({flag:true}));
      }

    })
    .catch(err=>{
          console.log(err);
          res.setHeader("Content-Type","application/json");
          res.send(JSON.stringify({flag:false}));
    });

});

router.post("/update",function(req,res,next){
  //Edit
  var myaccount = new account({
    user:req.body.user,
    pass:req.body.pass,
    age:req.body.age

  });

  console.log(myaccount.user);
  console.log(myaccount.pass);
  console.log(myaccount.age);

  myaccount.updateAccount()
    .then((result)=>{
      if (result.modifiedCount==0){
        console.log("UPADTE KHONG THANH CONG!");
        res.setHeader("Content-Type","application/json");
        res.send(JSON.stringify({flag:false}));
      }
      else{
        console.log("UPDATE THANH CONG");
        res.setHeader("Content-Type","application/json");
        res.send(JSON.stringify({flag:true}));
      }

    })
    .catch(err=>{
          console.log(err);
          res.setHeader("Content-Type","application/json");
          res.send(JSON.stringify({flag:false}));
    });

});

module.exports = router;
