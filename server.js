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


// 根目录跳转
app.get('/',function (req, res) {
  fs.createReadStream('./users.html').pipe(res);
});
// 用户列表页渲染
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
// 增加用户
app.post('/add',function (req, res) {
  var users = JSON.parse(fs.readFileSync(db,'utf8'));
  var id = users[users.length-1]==undefined?0:parseInt(users[users.length-1]['id']+1);
  var data= {"name":req.body.name,"age":req.body.age,"id":id};
  users.push(data);
  fs.writeFile(db,JSON.stringify(users),function (err) {
    if(err) return console.log(err);
    res.send(data);
  })
});

// 删除操作
app.delete('/users/:id',function(req,res){
  var id = req.params.id;
  var user1 = JSON.parse(fs.readFileSync(db,'utf8'));
  var users = user1.filter(function(user){
    return user['id'] !== parseInt(id);
  });
  fs.writeFile(db,JSON.stringify(users),function(err){
    if(err) return console.log(err);
    res.send(true);
  })
});
// 修改操作
app.patch('/edit/:id',function (req, res) {
  /*var id = req.params.id;
  var name = req.body.name;
  var age = req.body.age;
  // console.log(id,name,age);
  var dbUser = JSON.parse(fs.readFileSync(db,'utf8'));


  /!*dbUser = dbUser.map(function (user) {
    if(user['id']==id){
      console.log(1)
    }
  })*!/
  /!*fs.writeFile();
  var newUser = [];
  for(var i=0;i<dbUser.length;i++){
    if(dbUser[i]['id']===id){
      newUser  = dbUser;
      newUser.splice(i,1);
    }
  }
  console.log(newUser);*!/*/

  var newUser = req.body;
  var users = JSON.parse(fs.readFileSync(db,'utf8'));
  users = users.map(function (user) {
    if(user.id==req.params.id){
      for(var attr in newUser){
        if(newUser.hasOwnProperty(attr)){
          user[attr] = newUser[attr];
        }
      }
      newUser = user;
      return newUser;
    }else{
      return user;
    }
  });
  fs.writeFile(db,JSON.stringify(users),function (err) {
    res.send(newUser);
  });


});

// 查询操作
app.get('/query',function (req, res) {
  var name = req.query.name;
  var age = req.query.age;
  var dbUsers = JSON.parse(fs.readFileSync(db,'utf8'));
  // console.log(dbUsers);
  var returnUsers = dbUsers.filter(function (user) {
    // console.log(typeof user['name']);
    return user['name'].match(name)&&user['age'].match(age);
  });
  if(returnUsers.length===0){
    res.send({"msg":"无查询结果","error":"0"});
  }else{
    res.send(returnUsers);
  }

});




app.listen(1100);
