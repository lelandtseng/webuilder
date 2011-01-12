var Model = require('mongo-model').Model;
var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var User = new Model('users');


var User = new Model('users');

var createVN = require('validnum').createVN;
var validatVN = require('validnum').validatVN;

// 验证是否有adm
function yz(req, res, next){
    if (req.session && req.session.adm) {
        next();
    }
    else {
        res.render('login.html' ,{
            vname:req.session.vnum.vname,
            a:req.session.vnum.a,
            b:req.session.vnum.b
        })
    }
}

// 打开添加页面
app.get('/add', yz,createVN, function(req, res){
    res.render('add.html',{
        vname:req.session.vnum.vname,a:req.session.vnum.a,b:req.session.vnum.b
    });
});




// 显示主页
app.get('/', createVN , yz,  function(req, res){

    User.find({},{},function(data){
        res.render('index.html', {
            users: data
        });
        });
});

app.post('/save', yz, validatVN , function(req, res){
    if(req.vn){
    req.body._id = req.body.loginname;
      User.save(req.body,function(){
        res.redirect('/admin')
      });    
    }else{
        res.redirect('/admin/add');
    }
});

// 显示主页
app.get('/',createVN ,  yz, function(req, res){
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
app.post('/update/:id',yz, createVN ,function(req,res){
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

app.post('/login', validatVN , function(req, res){

    var loginname = req.body['loginname'];
    var password = req.body['password'];
    if (req.vn && loginname && password && loginname == 'admin' && password == 'jialu1024') {
        req.session.adm = 1;
   
    }
    res.redirect('/admin');
});
































