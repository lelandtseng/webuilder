
var express = require('express');
var helpers = require('express-helpers');
var app = module.exports = express.createServer();
var app = helpers.all(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('mongo-model').Model;
var ObjectID = require('mongo-model').ObjectID;
var contact = new Model('contact','/home/lelandtseng/tmp');
var form = require("./validator").form;

//验证
function yz(req,res,next){
    if(req.session.loginuser){
            if(req.params.id){
            contact.find({_id:new ObjectID(req.params.id)}, {},function(ps){
                if(ps[0] && ps[0].user == req.session.loginuser.loginname){
                    
                    next();
                }else{
                    res.redirect('/login');
                }
            });
            }else{next();}
    }else{
        res.redirect("/login");
    }
}

function yz2(req,res,next){
    req.session.loginuser?next():res.redirect("/login");
}

// 联系方式首页
app.get('/' ,function(req, res){
    contact.find({}, {}, function(data){
         res.render('index.html',{
            logined:req.session.loginuser?req.session.loginuser:false,
            layout:false,
            contact:data[0]?data[0]:{}
        });
    });
});

//打开更新页面
app.get("/:id/edit", form, function(req, res){
    contact.get(new ObjectID(req.params.id), function(data){
        res.render('edit.html', {
            layout:false,
            contact: data?data:{},
            validatnum:req.validatnum,
            errmsg:false
        });
    });
});

// 更新联系方式
app.post("/:id/update", yz2, form, function(req, res){
    if (req.errmsg) {
        req.formdata._id = req.params.id;
        res.render('edit.html', {
            layout:false,
            contact: req.formdata,
            validatnum:req.validatnum,
            errmsg:req.errmsg
        });
    }
    else {
        contact.get(new ObjectID(req.params.id), function(data){
            if(data){
                contact.update(new ObjectID(req.params.id), req.formdata, function(){
                    res.send("success");
                });
            }else{
                contact.save(req.formdata, function(){
                    res.send("success");
                });                
            }
        });
        
    }
})

