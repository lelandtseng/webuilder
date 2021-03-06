
var express = require('express');
var helpers = require('express-helpers');
var app = module.exports = express.createServer();
var app = helpers.all(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('mongo-model').Model;
var ObjectID = require('mongo-model').ObjectID;
var Product = new Model('products','/home/lelandtseng/tmp');
var ProductType = new Model('producttypes');
var form = require("./validator").form;

//验证
function yz(req,res,next){
    if(req.session.loginuser){
            if(req.params.id){
            Product.find({_id:new ObjectID(req.params.id)}, {},function(ps){
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

// 全部产品类型
function alltype(req, res , next){
    ProductType.find({}, {}, function(data){
         req.types = data;
         next();
    });
}

function bestproducts(req,res,next){
    Product.find({best:true}, {
        sort: [['_id', -1]],
        pagenum: req.param('page') ? req.param('page') : 1,
        rsnum: 5
    }, function(data,pageinfo){
        req.bestproducts = data;
        next();
    });    
}

// 产品首页
app.get('/' ,bestproducts, function(req, res){
    Product.find({}, {
        sort: [['_id', -1]],
        pagenum: req.param('page') ? req.param('page') : 1,
        rsnum: 5
    }, function(data,pageinfo){
         res.render('index.html',{
            logined:req.session.loginuser?req.session.loginuser:false,
            layout:!req.xhr,
            zxproducts: data,
            bestproducts:req.bestproducts,
            pageinfo:pageinfo,
            product:false
        });
    });
});

// 产品首页
app.get('/type/:typename' , function(req, res){
    Product.find({type:req.params.typename}, {
        sort: [['_id', -1]],
        pagenum: req.param('page') ? req.param('page') : 1,
        rsnum: 5
    }, function(data,pageinfo){
         res.render('type.html',{
            layout:!req.xhr,
            products: data,
            pageinfo:pageinfo,
            typename:req.params.typename
        });
    });
});


// 打开添加产品的页面
app.get('/new', yz2, form, alltype , function(req, res){
    res.render('new.html',{layout:false,errmsg:[],product:{},types:req.types,validatnum:req.validatnum});
});

app.get('/:id', function(req, res){
    Product.get(new ObjectID(req.params.id), function(data){
        res.render('view.html', {
            product: data
        });
    });
});

// 添加产品
app.post('/create',yz,form,alltype, function(req, res){
    if (req.errmsg) {
        res.render('new.html',{
            layout:false,
            types:req.types,
            validatnum:req.validatnum,
            errmsg:req.errmsg,
            product:req.formdata});
    }else{
       req.formdata.user = req.session.loginuser.loginname;
       Product.save(req.formdata, function(){
            res.send("success");
       });  
    }
});

// 显示图片
app.get("/img/:name",function(req,res){
    var path = '/home/lelandtseng/tmp/'+req.params.name;
    res.sendfile(path);
});

//打开更新页面
app.get("/:id/edit", form,alltype , function(req, res){
    Product.get(new ObjectID(req.params.id), function(data){
        res.render('edit.html', {
            layout:false,
            product: data,
            types:req.types,
            validatnum:req.validatnum,
            errmsg:false
        });
    });
});

// 更新产品
app.post("/:id/update", yz2, form,  alltype ,function(req, res){
    if (req.errmsg) {
        req.formdata._id = req.params.id;
        res.render('edit.html', {
            layout:false,
            product: req.formdata,
            types:req.types,
            validatnum:req.validatnum,
            errmsg:req.errmsg
        });
    }
    else {
        Product.update(new ObjectID(req.params.id), req.formdata, function(){
            res.send("success");
        });
    }
})

// 删除产品
app.del('/:id',yz,function(req,res){
    Product.remove(new ObjectID(req.params.id),function(){
        res.send("success");
    });
});


