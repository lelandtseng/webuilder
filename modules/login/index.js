var express = require('express');
var app = module.exports = express.createServer();
var createVN = require('express-validatnum').createVN;
var validatVN = require('express-validatnum').validatVN;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));



app.get('/',createVN,  function(req, res){
    res.render('login.html',{
        layout:false,
        vname:req.session.vnum.vname,
        a:req.session.vnum.a,
        b:req.session.vnum.b
    });
});

// 登录
app.post('/login',validatVN, function(req, res){

    if(!req.vn) res.redirect('/login/');

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
                        res.render('loginsuccess.html',{layout:false});
                    }
                    else {
                        res.redirect('/login');
                    }
                }
            });
        });
    });
});

