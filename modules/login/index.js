var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));

app.get('/open_login_page', function(req, res){
    res.render('login.html');
});

app.post('/', function(req, res){

    var loginname = req.body['loginname'];
    var password = req.body['password'];
    if (loginname && password && loginname == 'admin' && password == 'jialu1024') {
        req.session.user = 1;
        res.redirect('/');
    }
    else {
        res.render('login.html');
    }
});

