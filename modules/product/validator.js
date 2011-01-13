var V = require('express-validator');

var productValidator = V.create();

productValidator.validatField('name', 'len', {
    min: 2,
    max: 4
}, "产品名称应该在2~4字符之间!");

productValidator.validatField('price', 'len', {
    min: 1,
    max: 25
}, "产品价格应该在1~25字符之间!");

productValidator.validatField('price', 'isDecimal', {}, "价格应该是0.0的格式");
productValidator.validatField('des', 'len', {
    min: 5,
    max: 20
}, "描述文字应该是 5 ~ 50 字符之间。");
productValidator.validatField('img', function(value, params){
    console.log(value);
    if (value.length > 6000000) 
        return false;
    else 
        return true;
}, {}, "产品图片大小应在60K之内");

exports.productValidator = V.validat(productValidator);
