var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));

app.get('/',function(req,res,next){
    res.render('index.html',
        {
            layout:false , 
            user:req.session.user ? req.session.user : {loginname:'none'}
        });
});
