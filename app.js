require('../lib');
require('./db');
var express = require('express');
var app = module.exports = express.createServer(require('connect-form')() , express.staticProvider(__dirname + '/public'), express.bodyDecoder(), express.cookieDecoder(), express.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));

app.use('/product', require('./modules/product'));
app.use('/admin', require('./modules/admin'));
app.use('/login', require('./modules/login'));
app.get('/book', function(req, res){
    console.log(req.errmsg);
    res.send("ok!");
})

app.post('/login', function(req, res, next){
    var loginname = req.body.loginname;
    var password = req.body.password;
    if (loginname == 'admin' && password == '123') {
        req.session.loginuser = {
            loginname: loginname
        };
        res.send('success');
    }
    else {
        res.send('errer');
    }
    
});

app.get('/logined', function(req, res, next){
    if (req.session.loginuser) 
        res.send('success');
    else 
        res.send('errer');
});

app.post('/reg', function(req, res, next){

    var loginname = req.body.loginname;
    var password = req.body.password;
    var confirm = req.body.confirm;
    
    if (req.session.user) {
        res.send(req.session.user.toString());
    }
    else {
        req.session.user = {
            loginname: loginname,
            password: password
        };
        res.send('new user');
    }
    
});

app.get('/', function(req, res){
    res.render("ii.html", {
        layout: false,
        abc: "123"
    });
});

app.get('/ss', function(req, res){
    var body = '';
    if (req.session.views) {
        ++req.session.views;
    }
    else {
        req.session.views = 1;
        body += '<p>First time visiting? view this page in several browsers :)</p>';
    }
    res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

app.listen(3000);
