var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var ObjectID = require('mongodb').BSONPure.ObjectID;

//得到最新产品
function zxcp(req, res, next){
    db.collection("products", function(err, con){
        con.find({}, {
            limit: 10,
            sort: [['createTime',-1]]
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
app.get('/', zxcp, tjcp, cplist, producttypes, function(req, res){
    res.render('index.html', {
        tjproducts: req.tjproducts,
        zxproducts: req.zxproducts,
        listproducts: req.listproducts,
        producttypes: req.producttypes
    });
});

// 添加产品
app.post('/add', function(req, res){
    db.collection('products', function(err, con){
        con.insert(req.data, function(err){
            res.redirect('/products/list/1')
        });
    });
});

// 更新产品
app.post("/:id/update", function(req, res){
    db.collection('products', function(err, con){
        con.update({
            '_id': req.params.id
        }, req, data, function(err){
            res.redirect('/products/list/1')
        });
    });
})

// 删除产品
app.get('/:id/delete', function(req, res){
    db.collection('products', function(err, con){
        con.remove({
            '_id': req.params.id
        }, function(err){
            res.redirect('/products/list/1')
        });
    });
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

