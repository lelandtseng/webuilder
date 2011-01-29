var FormData = require("../../../form-data");

var form = new FormData();

form.validat('name', 'len', {
    min: 2,
    max: 4
}, "产品名称应该在2~4字符之间!");

form.validat('price', 'len', {
    min: 1,
    max: 25
}, "产品价格应该在1~25字符之间!");

form.validat('des', 'len', {
    min: 5,
    max: 20
}, "描述文字应该是 5 ~ 50 字符之间。");
form.validat('img', function(value, params){
    console.log(value);
    if (value.length > 6000000) 
        return false;
    else 
        return true;
}, {}, "产品图片大小应在60K之内");

exports.form = form.build();
