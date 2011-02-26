var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var FormData = require("form-data");
var form = new FormData();
var Model = require('mongo-model').Model;
var ObjectID = require('mongo-model').ObjectID;
var SiteState = new Model("sitestate");
var Logo = new Model("logo","/home/lelandtseng/tmp");

function username(req,res,next){
    req.username = "abc";
    next();
}

function state(req,res,next){
    SiteState.find({user:req.session.loginuser?req.session.loginuser.loginname:null},{},function(data)
    {
        req.state = data[0]?data[0]:{};
        next();
    });
}

function yz(req,res,next){
    req.session.loginuser?next():res.send("");
}

//打开首页
app.get('/',state,function(req,res,next){
    res.render('index.html',
    {     
        loginuser:req.session.loginuser ? req.session.loginuser : false,
        state:req.state
    });
});

// nav
app.get('/nav',function(req,res){
    res.render("nav.html",{layout:false});
});

// toolbar
app.get('/toolbar',function(req,res){
    req.session.loginuser?res.render("toolbar.html",{layout:false}):res.send("");
});


//保存网站状态
app.post('/savestate',yz,function(req,res){
    req.body.user = req.session.loginuser.loginname;
    
    SiteState.get(req.session.loginuser.loginname,function(data){
        if(data){
        SiteState.update(data._id,req.body,function(){
            res.send("ok!");
        });
        }else{
        req.body._id = req.session.loginuser.loginname;
        SiteState.save(req.body,function(){
            res.send("ok2!");
        });
        }
    });
});

// 得到网站状态
app.get("/state",username,function(req,res){
    SiteState.get(req.username,function(data){
        if(data){
           res.send(JSON.stringify(data));
        }else{
            res.send("{}");
        }
    });
});

// logo update
app.post("/logo/update",yz,form.build(),function(req,res){
    Logo.find({_id:req.session.loginuser.loginname},{},function(data){
        if(data[0]){
            Logo.update(data[0]._id,req.formdata,function(){
                res.send("success");
            });
        }else{
            req.formdata._id = req.session.loginuser.loginname;
            Logo.save(req.formdata,function(){
                res.send("success");
            });
        }
    });
});

// show logo
app.get("/logo",username,function(req,res){
    Logo.get(req.username,function(data){
        try{           
            var path = '/home/lelandtseng/tmp/'+data.data.path; 
            console.log(path);
            res.sendfile(path);
        }catch(e){
            res.send("");
        }
    });    
});

