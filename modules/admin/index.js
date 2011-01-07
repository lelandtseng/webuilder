
/**
总后台
    登录
    用户管理 CURD
    用户登录
*/

var Model = require('model').Model;
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
app.get('/open_add_page', yz, function(req, res){
    res.render('add.html');
});

// 添加功能
app.post('/add', yz, function(req, res){
    User.save(req.body,function(){
        res.redirect('/admin');
    })
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


app.post('/login', function(req, res){

    var loginname = req.body['loginname'];
    var password = req.body['password'];
    if (loginname && password && loginname == 'admin' && password == 'jialu1024') {
        req.session.adm = 1;
        res.redirect('/admin');
    }
    else {
        res.render('login.html');
    }
});



