var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));

var Model = require('mongo-model').Model;
var SiteState = new Model("sitestate");

function state(req,res,next){
    SiteState.find({user:req.session.loginuser?req.session.loginuser.loginname:null},{},function(data){
        req.state = data[0]?data[0]:{};
        next();
    });
}

//打开首页
app.get('/',state,function(req,res,next){
    res.render('index.html',
    {
     layout:false , 
     loginuser:req.session.loginuser ? req.session.loginuser : false,
     state:req.state
    });
});

//保存网站状态
app.post('/savestate',function(req,res){
    req.body.user = req.session.loginuser.loginname;
    
    SiteState.find({user:req.session.loginuser.loginname},{},function(data){
        if(data[0]){
        SiteState.update(data[0]._id,req.body,function(){
            res.send("ok!");
        });
        }else{
        SiteState.save(req.body,function(){
            res.send("ok2!");
        });
        }
    });
});

