var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('mongo-model').Model;
var ObjectID = require('mongo-model').ObjectID;
var Product = new Model('products');
var FormData = require("form-data");
var form1 = new FormData();
// 产品首页
app.get('/page/:num', function(req, res){
    var page = parseInt(req.params.num);
    
    Product.find({}, {
        sort: [['_id', -1]],
        pagenum: page,
        rsnum: 5
    }, function(data,pageinfo){   
   
         res.render('index.html', {
            zxproducts: data,
            pageinfo:pageinfo
        });
    });
});

// 打开添加产品的页面
app.get('/add', function(req, res){
    res.render('add.html');
});

// 添加产品
app.post('/save',form1.build(), function(req, res){

        Product.save(req.formdata, function(){
            //console.log(req.formdata);
            res.redirect('/product/page/1')
        });
    
});

app.get("/downimg/:name",function(req,res){
    var path = '/tmp/'+req.params.name;
    res.sendfile(path);
});

//打开更新页面
app.get("/edit/:id", function(req, res){
    Product.get(new ObjectID(req.params.id), function(data){
        res.render('edit.html', {
            product: data
        });
    });
});

// 更新产品
app.post("/update/:id", function(req, res){
    if (req.errmsg) {
        Product.get(new ObjectID(req.params.id), function(data){
            res.render('edit.html', {
                errmsg: req.errmsg,
                product: data
            });
        });
    }
    else {
        Product.update(new ObjectID(req.params.id), req.data, function(){
            res.redirect('/product/page/1')
        });
    }
})

// 删除产品
app.get('/delete/:id', function(req, res){
    Product.remove(new ObjectID(req.params.id), function(){
        res.redirect('back')
    });
});

