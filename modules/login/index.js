var express = require('express');
var Model = require('mongo-model').Model;
var User = new Model('users');
var app = module.exports = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));

app.get('/', function(req, res){
    res.render('login.html');
});

// 登录
app.post('/login',function(req, res){

    var loginname = req.body['loginname'];
    var password = req.body['password'];
    
    User.find({loginname:loginname,password:password},{},function(users){
        if(users[0]){
            req.session.loginuser = users[0];
            res.redirect('/product');
        }else{
            res.redirect('/login');
        }
    });    

});

