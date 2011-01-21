var contrib = require('../express-contrib/lib/express-contrib')
  , Resource = contrib.Resource;

var express = require('express');

var app = module.exports = express.createServer(require('connect-form')() , express.staticProvider(__dirname + '/public'), express.bodyDecoder(), express.cookieDecoder(),express.methodOverride(), express.session({ secret: 'keyboard cat' }),function(req,res,next){
    (req.header("content-length") > 2 * 1024 * 1024) ? req.destroy() :  next();
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
app.resource('product', require('./product'));

app.listen(3000);

