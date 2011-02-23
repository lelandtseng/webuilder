
var express = require('express');
var helpers = require('express-helpers');
var app = module.exports = express.createServer();
var app = helpers.all(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('mongo-model').Model;
var ObjectID = require('mongo-model').ObjectID;
var msg = new Model('msgs');
var form = require("./validator").form;

//验证
function yz(req,res,next){
    if(req.session.loginuser){
            if(req.params.id){
            msg.find({_id:new ObjectID(req.params.id)}, {},function(ps){
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

// 显示留言
app.get('/' , function(req, res){
    if(req.session.loginuser){
    msg.find({}, {
        sort: [['_id', -1]],
        pagenum: req.param('page') ? req.param('page') : 1,
        rsnum: 5
    }, function(data,pageinfo){
         res.render('index.html',{
            logined:req.session.loginuser,
            layout:!req.xhr,
            msgs:data,
            pageinfo:pageinfo
        });
    });
    }else{
        res.render('index.html',{
            logined:false,
            layout:!req.xhr,
            msg:{}
        });
    }
});

// 打开留言页面
app.get('/new', form , function(req, res){
    res.render('new.html',{
        layout:false,
        errmsg:[],
        msg:{},
        validatnum:req.validatnum
    });
});

// 留言
app.post('/create',form, function(req, res){
    if (req.errmsg) {
        res.render('new.html',{
            layout:false,
            validatnum:req.validatnum,
            errmsg:req.errmsg,
            msg:req.formdata
        });
    }else{
       msg.save(req.formdata, function(){
            res.send("success");
       });  
    }
});

// 删除产品
app.del('/:id',yz,function(req,res){
    msg.remove(new ObjectID(req.params.id),function(){
        res.send("success");
    });
});

