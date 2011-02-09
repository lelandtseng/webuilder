var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('../../../mongo-model').Model;
var ObjectID = require('../../../mongo-model').ObjectID;
var Product = new Model('products','/home/leland/tmp');
var ProductType = new Model('producttypes');
var form = require("./validator").form;
app.helpers = function(obj){
    this.viewHelpers = obj;
    return this;
}
app.helpers({
    abc: function(){return '<font color="red">fdfdfd</font>'}
});

// 最新产品
function zxproducts(req,res,next){
   Product.find({}, {
        sort: [['_id', -1]],
        pagenum: req.param('page') ? req.param('page') : 1,
        rsnum: 5
   },function(data,pageinfo){

   });   
}

// 推荐产品
function zxproducts(req,res,next){
   Product.find({tuijian:true}, {
        sort: [['_id', -1]],
        pagenum: req.param('page') ? req.param('page') : 1,
        rsnum: 5
   },function(data,pageinfo){

   });
   
}

// 全部产品类型
function alltype(req,res,next){
   ProductType.find({tuijian:true}, {},function(data){
       req.types = data;
   });   
}

// 产品首页
app.get('/' , function(req, res){
    Product.find({}, {
        sort: [['_id', -1]],
        pagenum: req.param('page') ? req.param('page') : 1,
        rsnum: 5
    }, function(data,pageinfo){
         res.render('index.html',{
            layout:!req.xhr,
            zxproducts: data,
            pageinfo:pageinfo
        });
    });
});

// 打开添加产品的页面
app.get('/new', function(req, res){
    res.render('new.html',{layout:false});
});

// 添加产品
app.post('/create',form, function(req, res){
    if (req.errmsg) {
        res.render('new.html',{layout:false,errmsg:req.errmsg});
    }else{
       Product.save(req.formdata, function(){
            res.send("ok");
       });  
    }
});

// 显示图片
app.get("/img/:name",function(req,res){
    var path = '/home/leland/tmp/'+req.params.name;
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
app.put("/:id/update", form ,function(req, res){
    
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
app.del('/:id',function(req,res){
    Product.remove(new ObjectID(req.params.id),function(){
        res.redirect('/product');    
    });
});


// 产品类别列表
app.get('/type/list',function(req,res){
    ProductType.find({},{},function(data){
        res.render('typelist.html',{layout:false,types:data});
    });
});


// 打开添加产品的页面
app.get('/type/new', function(req, res){
    res.render('typenew.html');
});


// 添加产品类型
app.post('/type/create',form,function(req, res){
    if (req.errmsg) {
        res.render('typenew.html',{layout:false,errmsg:req.errmsg});
    }else{
       ProductType.save(req.formdata, function(){
            res.redirect("/product/type/list");
       });  
    }
});

// 删除产品
app.del('/type/:id',function(req,res){
    ProductType.remove(new ObjectID(req.params.id),function(){
        res.redirect('/product/type/list');    
    });
});



