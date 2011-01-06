var ObjectID = require('mongodb').BSONPure.ObjectID;
var Db = require('mongodb').Db, Connection = require('mongodb').Connection, Server = require('mongodb').Server, BSON = require('mongodb').BSONNative;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

db = exports.DB = new Db('mydb', new Server(host, port, {}), {
    native_parser: false
});

db.open(function(err, db){
    console.log(err)
});

var Model = exports.Model = function Model(name){
    this.name = name;
}

// 查询数量
Model.prototype.count = function count(conditions, callback){
    db.collection(this.name, function(err, con){
        con.count(conditions, function(err, num){
            callback(data, num);
        });
    });
}

// 查询
Model.prototype.find = function find(conditions, config, callback){

    db.collection(this.name, function(err, con){
        con.count(conditions, function(err, num){
            con.find(conditions, config, function(err, data){
                data.toArray(function(err, data){
                    callback(data, num);
                });
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
                callback(data[0]);
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
