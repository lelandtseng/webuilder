var express = require('express');
var app = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('../../../mongo-model').Model;
var ObjectID = require('../../../mongo-model').ObjectID;


module.exports = function(resourceName,validators){
    
    var model = new Model(resourceName)

    // find
    app.get('/' ,validators.find, function(req, res){
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

    // new
    app.get('/new', validators['new'], function(req, res){
        res.render('new.html',{layout:false});
    });

    // create
    app.post('/create', validators.create,function(req, res){
        if (req.errmsg) {
            res.render('new.html',{layout:false,errmsg:req.errmsg});
        }else{
           Product.save(req.formdata, function(){
                res.send("ok");
           });  
        }
    });

    // edit
    app.get("/:id/edit", validators.edit, function(req, res){
        Product.get(new ObjectID(req.params.id), function(data){
            res.render('edit.html', {
                product: data
            });
        });
    });

    // update
    app.put("/:id/update", validators.update ,function(req, res){
        
        if (req.errmsg) {
            res.render('edit.html',{product:req.formdata});
        }
        else {
            Product.update(new ObjectID(req.params.id), req.formdata, function(){
                res.redirect('/product')
            });
        }
    })

    // delete
    app.del('/:id', validators.del ,function(req,res){
        Product.remove(new ObjectID(req.params.id),function(){
            res.redirect('/product');    
        });
    });
    
    
    return app;
    
}



