var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('../../../mongo-model').Model;
var ObjectID = require('../../../mongo-model').ObjectID;
var ProductType = new Model('producttypes');
var form = require("./validator").form;

// 产品类别首页
app.get('/' , function(req, res){
    ProductType.find({}, {}, function(data){
         res.render('index.html',{
            types:data
        });
    });
});

// 打开添加产品类别的页面
app.get('/new', function(req, res){
    res.render('new.html',{layout:false});
});

// 添加产品类别
app.post('/create',form, function(req, res){
    if (req.errmsg) {
        res.render('new.html',{layout:false,errmsg:req.errmsg});
    }else{
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


