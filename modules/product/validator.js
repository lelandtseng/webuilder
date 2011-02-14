var FormData = require("form-data");

var form = new FormData();

form.validatnum(true," 验证码错误！ ");

form.convert("best","Boolean","Best no boolean.");

form.validat('name', 'len', {
    min: 2,
    max: 4
}, "产品名称应该在2~4字符之间!");

form.validat('price', 'len', {
    min: 1,
    max: 25
}, "产品价格应该在1~25字符之间!");

form.validat('price','isPrice',{},"产品价格格式 --- xx.xx --- ");

form.validat('des', 'len', {
    min: 5,
    max: 20
}, "描述文字应该是 5 ~ 50 字符之间。");

form.validat('img', function(value, params){
    if (value.length > 30000) 
        return false;
    else 
        return true;
}, {}, "产品图片大小应在30K之内");

exports.form = form.build();
