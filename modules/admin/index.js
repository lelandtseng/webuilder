var Model = require('mongo-model').Model;
var FormData = require('form-data');
var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var User = new Model('users');
var form0 = new FormData();
var form = new FormData();


form.validatnum(true," 验证码错误！ ");


form.validat("loginname",function(value,params){
    if("leland" === value){ return true; } else{return false;}
},null,"登录名错误！");


form.validat("password",function(value,params){
    if("jialu1024" === value){ return true; } else{return false;}
},null,"登录密码错误！");



// 验证是否有adm
function yz(req, res, next){
    if (req.session && req.session.adm) {
        next();
    }
    else {
        res.redirect("/admin/login");
    }
}

// 打开添加页面
app.get('/add', yz, function(req, res){
    res.render('add.html');
});

// 打开login页面
app.get("/login",form0.build() , function(req,res){
    res.render("login.html",{validatnum:req.validatnum});
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
            validatnum:req.validatnum,
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

// 登录action
app.post('/login' , form.build(), function(req, res){
    if(req.errmsg){
        res.render("login.html",{
            validatnum:req.validatnum,
            errmsg:req.errmsg
        });
    }else{
        req.session.adm = "111";
        res.redirect("/admin");
    }
});

