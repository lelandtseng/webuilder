var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var FormData = require("form-data");
var form = new FormData();
var Model = require('mongo-model').Model;
var SiteState = new Model("sitestate");
var Logo = new Model("logo","/home/leland/tmp");
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

// logo update
app.post("/logo/update",yz,form.build(),function(req,res){
    Logo.find({user:req.session.loginuser.loginname},{},function(data){
        if(data[0]){
            Logo.update(data[0]._id,req.formdata,function(){
                res.send("success");
            });
        }else{
            req.formdata._id = new ObjectID(req.session.loginuser.loginname);
            Logo.save(req.formdata,function(){
                res.send("success");
            });
        }
    });
});

// show logo
app.get("/logo",function(req,res){
    Logo.find({},{},function(data){
        try{
           
            var path = '/home/leland/tmp/'+data[0].data.path; 
            console.log(path);
            res.sendfile(path);
        }catch(e){
            res.send("");
        }
    });    
});

