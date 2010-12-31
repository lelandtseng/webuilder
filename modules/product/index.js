var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var ObjectID = require('mongodb').BSONPure.ObjectID;
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


/**得到最新产品*/
function zxcp(req, res, next){
    db.collection("products", function(err, con){
        con.find({}, {
            limit: 50,
            sort: [['_id', -1]]
        }, function(err, products){
            products.toArray(function(err, products){
                req.zxproducts = products;
                next();
            });
        });
    });
}

//得到推荐产品
function tjcp(req, res, next){
    db.collection("products", function(err, con){
        con.find({
            top: true
        }, {
            limit: 10,
            sort: 'createTime'
        }, function(err, products){
            products.toArray(function(err, products){
                req.tjproducts = products;
                next();
            });
        });
    });
}

// 删除产品
function del(req, res, next){
    db.collection('products', function(err, con){
        con.remove({
            _id: new ObjectID(req.params.id)
        }, function(err, type){
            next();
        });
    });
}

// 得到产品列表
function cplist(req, res, next){
    db.collection("products", function(err, con){
        con.find({}, {
            limit: 20,
            sort: 'createTime'
        }, function(err, products){
            products.toArray(function(err, products){
                req.listproducts = products;
                next();
            });
        });
    });
}

//得到产品类别列表
function producttypes(req, res, next){
    db.collection("producttypes", function(err, con){
        con.find({}, function(err, producttypes){
            products.toArray(function(err, producttypes){
                req.producttypes = producttypes;
                next();
            });
        });
    });
}

//得到指定ID的产品类别
function type(req, res, next){
    db.collection("producttypes", function(err, con){
        con.find({
            _id: new ObjectID(req.params.id)
        }, function(err, producttypes){
            products.toArray(function(err, producttypes){
                req.producttype = producttypes[0];
                next();
            });
        });
    });
}

// 更新产品类别
function type(req, res, next){
    db.collection("producttypes", function(err, con){
        con.update({
            _id: new ObjectID(req.params.id)
        }, req.data, function(err, producttype){
            next();
        });
    });
}

// 添加产品类别
function addtype(req, res, next){
    db.collection('producttypes', function(err, con){
        con.insert(req.data, function(err, type){
            next();
        });
    });
}

// 删除产品类别
function deltype(req, res, next){
    db.collection('producttypes', function(err, con){
        con.remove({
            _id: new ObjectID(req.params.id)
        }, function(err, type){
            next();
        });
    });
}

// 得到指定ID的产品
function product(req, res, next){
    db.collection("products", function(err, con){
        con.find({
            _id: new ObjectID(req.params.id)
        }, function(err, products){
            products.toArray(function(err, products){
                req.product = products[0];
                next();
            });
        });
    });
}



// 添加产品类别
app.post('/type/add', function(req, res){
    db.collection('producttypes', function(err, con){
        con.insert(req.data, function(err){
            res.redirect('/products/type/list')
        });
    });
});



// 显示产品类别列表
app.get('/type/list', producttypes, function(req, res){
    res.render('producttypes.html', {
        producttypes: req.producttypes
    });
});

// 打开更新产品类别的页面
app.get('/type/:id/edit', type, function(req, res){
    res.render('update_type.html', {
        producttype: req.producttype
    });
});

// 更新产品类别
app.get('/type/:id/update', function(req, res){
    res.render('update_type.html', {
        producttype: req.producttype
    });
});

// 产品首页
app.get('/', zxcp, function(req, res){
    res.render('index.html', {
        zxproducts: req.zxproducts
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
        db.collection('products', function(err, con){
            con.insert(req.data, function(err){
                res.redirect('/product')
            });
        });
    }
    
});

//打开更新页面
app.get("/:id/edit", product, function(req, res){
    res.render('edit.html', {
        product: req.product
    });
});

// 更新产品
app.post("/:id/update", V.validat(va), product, function(req, res){
    if (req.errmsg) {
        res.render('edit.html', {
            errmsg: req.errmsg,
            product: req.product
        });
    }
    else {
        db.collection('products', function(err, con){
            con.update({
                '_id': new ObjectID(req.params.id)
            }, req.data, function(err){
                console.log(req.params.id);
                res.redirect('/product')
            });
        });
    }
})

// 删除产品
app.get('/:id/delete', del, function(req, res){
    res.redirect('/product')
});

// 得到一个产品
app.get("/:id", function(req, res){
    db.collection('products', function(err, con){
        con.findOne({
            '_id': req.params.id
        }, function(err, user){
            res.render("show", {
                user: user
            });
        });
    });
});


// 得到最新产品
app.get("/new", function(req, res){

});

// 得到推荐产品
app.get("/best", function(req, res){

});

// 得到产品列表
app.get("/list/:page", function(req, res){

});

