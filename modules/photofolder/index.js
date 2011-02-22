
var express = require('express');
var helpers = require('express-helpers');
var app = module.exports = express.createServer();
var app = helpers.all(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var Model = require('mongo-model').Model;
var ObjectID = require('mongo-model').ObjectID;
var photofolder = new Model('photofolders','/home/leland/tmp');
var form = require("./validator").form;

//验证
function yz(req,res,next){
    if(req.session.loginuser){
            if(req.params.id){
            photofolder.find({_id:new ObjectID(req.params.id)}, {},function(ps){
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

// 相册首页
app.get('/' ,function(req, res){
    photofolder.find({}, {
        sort: [['_id', -1]]
    }, function(data){
         res.render('index.html',{
            logined:req.session.loginuser?req.session.loginuser:false,
            layout:!req.xhr,
            photofolders:data
        });
    });
});

// 打开添加相册的页面
app.get('/new', yz2, form, function(req, res){
    res.render('new.html',{layout:false,errmsg:[],photofolder:{},validatnum:req.validatnum});
});

app.get('/:id', function(req, res){
    photofolder.get(new ObjectID(req.params.id), function(data){
        res.render('view.html', {
            photofolder: data
        });
    });
});

// 添加相册
app.post('/create',yz,form,function(req, res){
    if (req.errmsg) {
        res.render('new.html',{
            layout:false,
            validatnum:req.validatnum,
            errmsg:req.errmsg,
            photofolder:req.formdata});
    }else{
       req.formdata.user = req.session.loginuser.loginname;
       photofolder.save(req.formdata, function(){
            res.send("success");
       });  
    }
});

// 显示图片
app.get("/img/:name",function(req,res){
    var path = '/home/leland/tmp/'+req.params.name;
    res.sendfile(path);
});

//打开更新页面
app.get("/:id/edit", form, function(req, res){
    photofolder.get(new ObjectID(req.params.id), function(data){
        res.render('edit.html', {
            layout:false,
            photofolder: data,
            validatnum:req.validatnum,
            errmsg:false
        });
    });
});

// 更新相册
app.post("/:id/update", yz2, form, function(req, res){
    if (req.errmsg) {
        req.formdata._id = req.params.id;
        res.render('edit.html', {
            layout:false,
            photofolder: req.formdata,
            validatnum:req.validatnum,
            errmsg:req.errmsg
        });
    }
    else {
        photofolder.update(new ObjectID(req.params.id), req.formdata, function(){
            res.send("success");
        });
    }
})

// 删除相册
app.del('/:id',yz,function(req,res){
    photofolder.remove(new ObjectID(req.params.id),function(){
        res.send("success");
    });
});


