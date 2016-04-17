/**
 * Created by Administrator on 2016/4/17.
 */
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
var db = './data/users.json';
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'./css')));
app.use(express.static(path.join(__dirname,'./js')));


app.get('/',function (req, res) {
  fs.createReadStream('./users.html').pipe(res);
});
app.get('/users',function (req, res) {
  fs.readFile(db,function (err, data) {
    if(err) return console.log(err);
    if(data.toString()===''){
      fs.writeFile(db,'[]',function (err) {
        return;
      })
    }else if(data.toString()==='[]'){
      return;
    }else{
      res.send(data.toString());
    }
  })
});
app.post('/add',function (req, res) {
  var users = require(db);
  var id = users[users.length-1]==undefined?0:parseInt(users[users.length-1]['id']+1);
  var data= {"name":req.body.name,"age":req.body.age,"id":id};
  users.push(data);
  fs.writeFile(db,JSON.stringify(users),function (err) {
    if(err) return console.log(err);
    res.send(data);
  })
});

app.delete('/users/:id',function(req,res){
  var id = req.params.id;
  var user1 = require(db);
  console.log(user1);
  var users = user1.filter(function(user){
    return user['id'] !== parseInt(id);
  });
  console.log('users',users);
  fs.writeFile(db,JSON.stringify(users),function(err){
    if(err) return console.log(err);
    res.send(true);
  })
});



app.listen(1100);
