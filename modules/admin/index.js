var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));

// 验证是否有adm
function yz(req, res, next){
    if (req.session && req.session.adm) {
        next();
    }
    else {
        res.render('login.html')
    }
}

// 打开添加页面
app.get('/open_add_page', yz, function(req, res){
    res.render('add.html');
});

// 添加功能
app.post('/add', yz, function(req, res){
    db.createCollection('users', function(err, con){
        con.insert(req.body, function(err){
            res.redirect('/admin')
        });
    })
});

// 全部用户
function alluser(req, res, next){
    db.collection('users', function(err, con){
        con.find({}, function(err, users){
            console.log(users);
            var userlist = [];
            users.toArray(function(err, users){
                req.users = users;
                next();
            });
            
        });
    })
}

// 显示主页
app.get('/', yz, alluser, function(req, res){
    res.render('index.html', {
        layout: 'layout2',
        users: req.users
    });
});

app.get('/open_update_page', function(req, res){
    if (req.session.adm) {
        if (req.param('id') && users[req.param('id')]) {
            res.render('update.html', {
                updateuser: users[req.param('id')]
            });
        }
        else {
            res.redirect('/admin');
        }
    }
    else {
        res.render('login.html');
    }
});


app.post('/login', function(req, res){

    var loginname = req.body['loginname'];
    var password = req.body['password'];
    if (loginname && password && loginname == 'admin' && password == 'jialu1024') {
        req.session.adm = 1;
        res.redirect('/admin');
    }
    else {
        res.render('login.html');
    }
});



