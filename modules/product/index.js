var express = require('express');
var app = module.exports = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.register('.html',require('ejs'));



// 产品类别数据
var product_type_list = [
	{id:0,name:'product type 0'},
	{id:1,name:'product type 1'},
	{id:2,name:'product type 2'}
]
// 产品
var products = [
	{id:'0',name:'product 0',img:'http://zh-cn.start3.mozilla.com/firefox/images/search/google.png'},
	{id:'2',name:'product 2',img:'http://zh-cn.start3.mozilla.com/firefox/images/search/google.png'},
	{id:'1',name:'product 0',img:'http://zh-cn.start3.mozilla.com/firefox/images/search/google.png'}
]


// 产品首页
app.get('/',function(req,res){
	res.render('index.html',{locals:{
		product_type_list:product_type_list},
		products:products
	});
});
