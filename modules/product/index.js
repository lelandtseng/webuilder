var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('../../model').Model;

var Product = new Model('products');


var data = require('express-data');
var V = require('connect-validator');

var va = V.create();
va.validatField('name', 'len', {
    min: 2,
    max: 4
}, "应该在2~4字符之间!");

va.validatField('price', 'isDecimal', {}, "价格应该是0.0的格式");
va.validatField('des', 'len', {
    min: 5,
    max: 20
}, "描述文字应该是 5 ~ 20 字符之间。");
va.validatField('img', function(value, params){
    console.log(value);
    if (value.length > 200) 
        return false;
    else 
        return true;
}, {}, "产品图片应该小于200byte");


// 添加产品类别
app.post('/type/add', function(req, res){
    db.collection('producttypes', function(err, con){
        con.insert(req.data, function(err){
            res.redirect('/products/type/list')
        });
    });
});




// 更新产品类别
app.get('/type/:id/update', function(req, res){
    res.render('update_type.html', {
        producttype: req.producttype
    });
});

// 产品首页
app.get('/', function(req, res){
    Product.find({}, {}, function(data){
        res.render('index.html', {
            zxproducts: data
        });
    });
});

// 打开添加产品的页面
app.get('/open_add_page', function(req, res){
    res.render('add.html');
});

// 添加产品
app.post('/add', V.validat(va), function(req, res){
    console.log(req.errmsg);
    if (req.errmsg) {
        res.render('add.html', {
            errmsg: req.errmsg
        });
    }
    else {
        Product.save(req.data, function(){
            res.redirect('/product')
        });
    }
    
});

//打开更新页面
app.get("/:id/edit", function(req, res){
    Product.get(req.params.id, function(data){
        res.render('edit.html', {
            product: data
        });
    });
});

// 更新产品
app.post("/:id/update", V.validat(va), function(req, res){
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
            res.redirect('/product')
        });
    }
})

// 删除产品
app.get('/:id/delete', function(req, res){

    Product.remove(req.params.id, function(){
        res.redirect('/product')
    });
    
});

