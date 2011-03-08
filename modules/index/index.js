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
var BG = new Model("bg","/home/lelandtseng/tmp");
var banner = new Model("banner","/home/lelandtseng/tmp");
var seo = new Model("seo");
var user = new Model("users");

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

function keywords(req,res,next){
    seo.get(req.username,function(data){
        if(data){
        req.keywords = data.keywords;
        next();
        }else{
            next();
        }
    });  
}

//打开首页
app.get('/',username,keywords,function(req,res,next){
    res.render('index.html',
    {     
        loginuser:req.session.loginuser ? req.session.loginuser : false,
        keywords:req.keywords
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

// BG update
app.post("/bg/update",yz,form.build(),function(req,res){
    BG.find({_id:req.session.loginuser.loginname},{},function(data){
        if(data[0]){
            BG.update(data[0]._id,req.formdata,function(){
                res.send("success");
            });
        }else{
            req.formdata._id = req.session.loginuser.loginname;
            BG.save(req.formdata,function(){
                res.send("success");
            });
        }
    });
});

// BG logo
app.get("/bg",username,function(req,res){
    BG.get(req.username,function(data){
        try{           
            var path = '/home/lelandtseng/tmp/'+data.data.path; 
            //console.log(path);
            res.sendfile(path);
        }catch(e){
            res.send("");
        }
    });    
});

// banner update
app.post("/banner/update",yz,form.build(),function(req,res){
    banner.find({_id:req.session.loginuser.loginname},{},function(data){
        if(data[0]){
            banner.update(data[0]._id,req.formdata,function(){
                res.send("success");
            });
        }else{
            req.formdata._id = req.session.loginuser.loginname;
            banner.save(req.formdata,function(){
                res.send("success");
            });
        }
    });
});

// banner logo
app.get("/banner",username,function(req,res){
    banner.get(req.username,function(data){
        try{           
            var path = '/home/lelandtseng/tmp/'+data.data.path; 
            //console.log(path);
            res.sendfile(path);
        }catch(e){
            res.send("");
        }
    });    
});

// seo update
app.post("/seo/update",yz,form.build(),function(req,res){
    seo.find({_id:req.session.loginuser.loginname},{},function(data){
        if(data[0]){
            seo.update(data[0]._id,req.formdata,function(){
                res.send("success");
            });
        }else{
            req.formdata._id = req.session.loginuser.loginname;
            seo.save(req.formdata,function(){
                res.send("success");
            });
        }
    });
});

// modules
app.get("/modules/:name",function(req,res){
    var name = req.params.name;
    
    switch(name){
        case "gonggao" : 
            res.redirect("/gonggao");
        break;
        case "link" :
            res.redirect("/link");
            break;
        case "contact" :
            res.redirect("/contact");
            break;
        case "about" :
            res.redirect("/about");
            break;
        case "producttype" :
            res.redirect("/producttype");
            break;
        default:
        res.render(name+".html",{layout:false});
    }
    //res.redirect("/gonggao");
});

// show update password page.
app.get("/updatepwd",function(req,res){
    res.render("updatepwd.html",{layout:false});
});

function yz2(req,res,next){
    req.session.loginuser?next():res.redirect("/login");
}

// update user password!
app.post("/updatepwd",yz2,form.build(),function(req,res){
    var lu = req.session.loginuser;
    
    if(lu.password === req.formdata.oldpwd && req.formdata.password === req.formdata.confirm){
        lu.password = req.formdata.password;
        user.update(lu._id,lu,function(){
            res.send("success");
        });
    }else{
        res.redirect("/updatepwd");
    }
});





