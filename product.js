var Model = require('../mongo-model').Model;
var ObjectID = require('../mongo-model').ObjectID;
var Product = new Model('products');
var FormData = require("../form-data");
var form1 = new FormData();

exports.index = [
form1.build(),
function(req, res){
    Product.find({}, {
        sort: [['_id', -1]],
        pagenum: req.formdata.page,
        rsnum: 5
    }, function(data,pageinfo){
         res.render('product/index.html', {
            
            zxproducts: data,
            pageinfo:pageinfo
        });
    });
}];

exports.new = function(req, res){
  res.render('product/add.html');
};

exports.create = [
form1.build(),
function(req, res){
    Product.save(req.formdata, function(){
     //console.log(req.formdata);
    res.redirect('/product?page=1')
  });
}];

exports.show = [
    function(req, res){
        res.send('show forum ' + req.params.id);
    }
];

exports.edit = 
function(req, res){
    Product.get(new ObjectID(req.params.id), function(data){
        res.render('product/edit.html', {
            product: data
        });
    });
};

exports.update = [
form1.build(),
function(req, res){
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
            res.redirect('/product?page=1')
        });
    }
}];

exports.destroy = function(req, res){
    Product.remove(new ObjectID(req.params.id), function(){
        res.redirect('back')
    });
};

