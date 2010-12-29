require('../lib');

var Db = require('mongodb').Db, Connection = require('mongodb').Connection, Server = require('mongodb').Server, BSON = require('mongodb').BSONNative;
=======

var Db = require('mongodb').Db, Connection = require('mongodb').Connection, Server = require('mongodb').Server, BSON = require('mongodb').BSONPure;


var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : '127.0.0.1';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

db = exports.DB = new Db('mydb', new Server(host, port, {}), {
    native_parser: false
});


var product = {
    name: 'myname',
    createTime: new Date()
}

db.open(function(err, db){
    db.collection('products', function(err, con){
    
       
         
         con.find({''},{'limit':2,'sort':[['_id',-1]]}, function(err, products){
         products.toArray(function(err, products){
         console.log(products);
         });
         });
         
        /* 
        con.insert(product, function(err){
            con.find({}, function(err, products){
                products.toArray(function(err, products){
                    console.log(products);
                });
            });
        });
        */
        

var ObjectID = BSON.ObjectID;
db.open(function(err, db){
    console.log("aaa");
    db.collection('users', function(err, con){
    
        con.insert({
            name: 'myname'
        }, function(err){
            con.remove({
                _id: new ObjectID("4d0e235b1bb275380b000001")
            }, function(err){
                con.find({}, function(err, users){
                    users.toArray(function(err, users){
                        console.log(users);
                    });
                    
                });
                
                
            });
        });

    });
});


