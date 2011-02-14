var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));

//打开首页
app.get('/',function(req,res,next){
    res.render('index.html',
    {
     layout:false , 
     loginuser:req.session.loginuser ? req.session.loginuser : false,
     left:[],
     center:[],
     right:[]
    });
});

//保存网站状态
app.post('/save',function(req,res){
    
});

