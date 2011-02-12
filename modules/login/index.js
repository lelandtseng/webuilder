var express = require('express');
var app = module.exports = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));

app.get('/', function(req, res){
    res.render('login.html');
});

// 登录
app.post('/login',function(req, res){

    var loginname = req.body['loginname'];
    var password = req.body['password'];
    
    db.collection('users', function(err, con){
        con.find({
            _id : loginname
        }, function(err, users){
            users.toArray(function(err, users){
                if (users.length == 0) 
                    res.redirect('/login');
                else {
                    if (users[0].password == password) {
                        req.session.user = users[0];
                        res.render('loginsuccess.html');
                    }
                    else {
                        res.redirect('/login');
                    }
                }
            });
        });
    });
});

