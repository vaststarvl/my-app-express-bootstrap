var express = require('express');
var mongoclient = require('mongodb').MongoClient;
var router = express.Router();



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
  const uri = 'mongodb+srv://admin:admin@vaststar-v7yxs.mongodb.net/';
  mongoclient.connect(uri, function(err, client) {
    if (err) {
  //    client.close();
      console.log(err);
      return render_table(0,undefined);
    }
    const db = client.db("test");
    const collection = db.collection("myaccount");
    collection.find({}).toArray(function(err, result) {
      if (err) {
        console.log(err);
        return res.send("Fail to Get Data");
      }
      console.log(result);
      //res.send(result);

      render_table(err,result);
      client.close();
    });

  });

  function render_table(err, json_data){
    if (err){
      res.render('user_name_mongodb',{err:0,data:json_data});
    }
    else
  //  const js_object = JSON.parse(json_data);
    res.render('user_name_mongodb',{err:err,data:json_data});
  }
  //  res.send("Fail to Connect to Server!");
});

module.exports = router;
