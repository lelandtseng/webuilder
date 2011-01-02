var ObjectID = require('mongodb').BSONPure.ObjectID;

var Model = export.Model = function Model(name){
    this.name = name;
}

// 查询
Model.prototype.find = function find(conditions, config, callback){
    db.collection(this.name, function(err, con){
        con.find(conditions, config, function(err, data){
            data.toArray(function(err, data){
                callback(products);
            });
        });
    });
}

// 删除
Model.prototype.remove = function remove(id, callback){
    db.collection(this.name, function(err, con){
        con.remove({
            _id: new ObjectID(id)
        }, function(err, type){
            callback();
        });
    });
}

// 根据ID得到数据
Model.prototype.get = function get(id, callback){
    db.collection(this.name, function(err, con){
        con.find({
            _id: new ObjectID(id)
        }, function(err, data){
            data.toArray(function(err, data){
                callback(producttypes[0]);
            });
        });
    });
}

// 更新
Model.prototype.update = function update(id, data, callback){
    db.collection(this.name, function(err, con){
        con.update({
            _id: new ObjectID(id)
        }, data, function(err, data){
            callback();
        });
    });
}

// 添加新数据
Model.prototype.save = function save(data, callback){
    db.collection(this.name, function(err, con){
        con.insert(data, function(err, data){
            callback(data);
        });
    });
}
