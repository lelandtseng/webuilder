var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('mongo-model').Model;
var ObjectID = require('mongo-model').ObjectID;
var ProductType = new Model('producttypes');
var form = require("./validator").form;

//验证
function yz(req,res,next){
    if(req.session.loginuser){
            if(req.params.id){
            ProductType.find({_id:new ObjectID(req.params.id)}, {},function(ps){
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

// 产品类别首页
app.get('/' , function(req, res){
    ProductType.find({}, {}, function(data){
         res.render('index.html',{
            layout:false,
            types:data,
            logined:req.session.loginuser?true:false
        });
    });
});

// 打开添加产品类别的页面
app.get('/new',yz2, function(req, res){
    res.render('new.html',{layout:false});
});

// 添加产品类别
app.post('/create',yz , form, function(req, res){
    if (req.errmsg) {
        res.render('new.html',{errmsg:req.errmsg});
    }else{
       req.formdata.user = req.session.loginuser.loginname;
       ProductType.save(req.formdata, function(){
            res.redirect('/producttype');
       });  
    }
});

// 删除产品类别
app.del('/:id',function(req,res){
    ProductType.remove(new ObjectID(req.params.id),function(){
        res.redirect('/producttype');    
    });
});


