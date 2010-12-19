var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
var users = [{
    id: 1,
    loginname: 'loginname1',
    password: 'password1',
    enable: false,
    domain: 'domain1'
}, {
    id: 2,
    loginname: 'loginname2',
    password: 'password2',
    enable: true,
    domain: 'domain2'
}, {
    id: 3,
    loginname: 'loginname3',
    password: 'password3',
    enable: false,
    domain: 'domain3'
}]

function yz(req, res, next){
    if (req.session && req.session.adm) {
        next()
    }
    else {
        res.render('login.html')
    }
}

app.get('/open_add_page', yz, function(req, res){
    res.render('add.html');
});

app.post('/add',yz,function(req,res){
	
	db.createCollection('users',function(err,con){
		
		con.insert(req.body,function(err){
			console.log("dddd")
			res.redirect('/admin')
		});
	})
});

app.get('/', yz, function(req, res){
    res.render('index.html', {
        users: users
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

app.post('/update', function(req, res){
    users[req.body.id] = req.body;
    res.redirect('/admin');
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

