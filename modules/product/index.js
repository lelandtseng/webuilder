var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('../../model').Model;

var Product = new Model('products');

var data = require('express-data');

// 添加产品表单验证
var productValidator = require('./validator').productValidator;

// 产品首页
app.get('/page/:num', function(req, res){
    var page = parseInt(req.params.num) - 1;
    
    Product.find({}, {
        sort: [['_id', -1]],
        limit: 5,
        skip: page * 5
    }, function(data,num){
			console.log("num ===========> "+num);
        res.render('index.html', {
            zxproducts: data
        });
    });
});

// 打开添加产品的页面
app.get('/add', function(req, res){
    res.render('add.html');
});

// 添加产品
app.post('/save', productValidator, function(req, res){

    if (req.errmsg) {
        res.render('add.html', {
            errmsg: req.errmsg,
            flash: req.data
        });
    }
    else {
        Product.save(req.data, function(){
            res.redirect('/product/page/1')
        });
    }
    
});

//打开更新页面
app.get("/edit/:id", function(req, res){
    Product.get(req.params.id, function(data){
        res.render('edit.html', {
            product: data
        });
    });
});

// 更新产品
app.post("/update/:id", productValidator, function(req, res){
    if (req.errmsg) {
        Product.get(req.params.id, function(data){
            res.render('edit.html', {
                errmsg: req.errmsg,
                product: data
            });
        });
    }
    else {
        Product.update(req.params.id, req.data, function(){
            res.redirect('/product/page/1')
        });
    }
})

// 删除产品
app.get('/delete/:id', function(req, res){
    Product.remove(req.params.id, function(){
        res.redirect('back')
    });
});

