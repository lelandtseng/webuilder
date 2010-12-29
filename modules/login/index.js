var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));

app.get('/open_login_page', function(req, res){
    res.render('login.html');
});

// 登录
app.post('/', function(req, res){

    var loginname = req.body['loginname'];
    var password = req.body['password'];
    
    db.collection('users', function(err, con){
        con.find({
            'loginname': loginname
        }, function(err, users){
            users.toArray(function(err, users){
                if (users.length == 0) 
                    res.redirect('/login/open_login_page');
                else {
                    if (users[0].password == password) {
                        req.session.user = users[0];
                        res.send(" login success ! ");
                    }
                    else {
                        res.redirect('/login/open_login_page');
                    }
                }
            });
        });
    });
});

