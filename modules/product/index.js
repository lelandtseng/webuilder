var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('../../../mongo-model').Model;
var ObjectID = require('../../../mongo-model').ObjectID;
var Product = new Model('products','/home/lelandtseng/tmp');
var form = require("./validator").form;

// 产品首页
app.get('/' , function(req, res){
    Product.find({}, {
        sort: [['_id', -1]],
        pagenum: req.param('page') ? req.param('page') : 1,
        rsnum: 5
    }, function(data,pageinfo){
         res.render('index.html',{
            zxproducts: data,
            pageinfo:pageinfo
        });
    });
});

// 打开添加产品的页面
app.get('/new', function(req, res){
    res.render('new.html');
});

// 添加产品
app.post('/create',form, function(req, res){
    if (req.errmsg) {
        res.render('new.html',{errmsg:req.errmsg});
    }else{
       Product.save(req.formdata, function(){
            res.redirect('/product')
        });  
    }
});

// 显示图片
app.get("/img/:name",function(req,res){
    var path = '/home/lelandtseng/tmp/'+req.params.name;
    res.sendfile(path);
});

//打开更新页面
app.get("/:id/edit", function(req, res){
    Product.get(new ObjectID(req.params.id), function(data){
        res.render('edit.html', {
            product: data
        });
    });
});

// 更新产品
app.post("/:id/update", form ,function(req, res){
    
    if (req.errmsg) {
        res.render('edit.html',{product:req.formdata});
    }
    else {
        Product.update(new ObjectID(req.params.id), req.formdata, function(){
            res.redirect('/product')
        });
    }
})

// 删除产品
app.del('/:id', function(req, res){
    Product.remove(new ObjectID(req.params.id), function(){
        res.redirect('back')
    });
});

