var express = require('express');

var app = module.exports = express.createServer(require('connect-form')() , express.staticProvider(__dirname + '/public'), express.bodyDecoder(), express.cookieDecoder(),express.methodOverride(), express.session({ secret: 'keyboard cat' }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
app.use('/product',require('./modules/product'));
app.use('/producttype',require('./modules/producttype'));
app.use('/photofolder',require('./modules/photofolder'));
app.use('/zhengshu',require('./modules/zhengshu'));
app.use('/admin',require('./modules/admin'));
app.use('/photo',require('./modules/photo'));
app.use('/',require('./modules/index'));
app.use('/login',require('./modules/login'));
app.use('/doctype',require('./modules/doctype'));
app.use('/doc',require('./modules/doc'));
app.use('/job',require('./modules/job'));
app.use('/link',require('./modules/link'));
app.use('/gonggao',require('./modules/gonggao'));
app.use('/contact',require('./modules/contact'));
app.use('/about',require('./modules/about'));
app.use('/msg',require('./modules/msg'));
app.listen(3000);

