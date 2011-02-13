var Model = require('mongo-model').Model;
var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var User = new Model('users');

// 验证是否有adm
function yz(req, res, next){
    if (req.session && req.session.adm) {
        next();
    }
    else {
        res.render('login.html')
    }
}

// 打开添加页面
app.get('/add', yz, function(req, res){
    res.render('add.html');
});




// 显示主页
app.get('/', yz,  function(req, res){

    User.find({},{},function(data){
        res.render('index.html', {
            users: data
        });
        });
});

app.post('/save', yz, function(req, res){
      req.body._id = req.body.loginname;
      User.save(req.body,function(){
        res.redirect('/admin')
      });
});

// 显示主页
app.get('/', yz, function(req, res){
    User.find({},{},function(data){
        res.render('index.html', {
            users: data
        });
    });
});

// 编辑ID指定User
app.get('/edit/:id',yz, function(req, res){
    
    User.get(req.params.id,function(data){
        res.render('update.html', {
           updateuser:data
        });
    });    
});

// 更新用户信息
app.post('/update/:id',yz,function(req,res){
    User.update(req.params.id,req.body,function(){
       res.redirect('/admin')
    });
});

// 删除用户
app.get('/delete/:id', yz ,function(req, res){
    User.remove(req.params.id,function(){
         res.redirect('/admin')
    });
});

app.post('/login' , function(req, res){

    var loginname = req.body['loginname'];
    var password = req.body['password'];
    if (loginname && password && loginname == 'admin' && password == 'jialu1024') {
        req.session.adm = 1;
   
    }
    res.redirect('/admin');
});

