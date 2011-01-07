exports.createVN = function(req,res,next){
    var a = Math.round(Math.random()*10);
    var b = Math.round(Math.random()*10);
    var h = a + b;
    
    req.session.vnum = {vname:"vname"+new Date().getTime(),a:a,b:b,h:h}
    
    next();
}

exports.validatVN = function(req,res,next){
    if(req.body[req.session.vnum.vname]  && parseInt(req.body[req.session.vnum.vname]) == req.session.vnum.h){
        req.vn = true;
    }else{
        req.vn = false;
    }
    next();
}
