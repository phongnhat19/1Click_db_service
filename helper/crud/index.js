let crud = {}
const config = require(baseRoot+'config');
const dburl = config.database;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const logHelper = require('../logger')

const defaultSort = {dateCreated:-1}

crud.create = (obj,next)=>{
    MongoClient.connect(dburl,{ useNewUrlParser: true }, function (err, client) {
        if (err) {
            logHelper.error(`DB SERVICE -  CONNECT DB ERROR`)
            logHelper.debug(err)
            next('ERROR',"DB ERROR");
        }
        else {
            const db = client.db(config.dbName);
            db.collection(obj.collection).insert(obj.data,(err,result)=>{
                if (err) {
                    logHelper.error(`DB SERVICE - CREATE ERROR`)
                    logHelper.debug(err)
                    next('ERROR',"DB ERROR");
                    client.close()
                }
                else {
                    next('SUCCESS',result.ops[0]);
                    client.close()
                }
            })
        } 
    });
}

crud.read = (obj,next)=>{
    MongoClient.connect(dburl,{ useNewUrlParser: true }, function (err, client) {
        if (err) {
            logHelper.error(`DB SERVICE -  CONNECT DB ERROR`)
            logHelper.debug(err)
            next('ERROR',"DB ERROR");
        }
        else {
            const db = client.db(config.dbName);
            let sort = defaultSort
            if (obj.sort) {
                sort = obj.sort
            }
            let page = 1
            let limit = 0
            if (obj.page) {
                page = obj.page
            }
            if (obj.limit) {
                limit = obj.limit
            }
            if (obj.condition._id) {
                obj.condition._id = new ObjectID(obj.condition._id)
            }
            let query = db.collection(obj.collection).find(obj.condition)
            query.count((err,count)=>{
                if (err) {
                    logHelper.error(`DB SERVICE - READ ERROR`)
                    logHelper.debug(err)
                    next('ERROR',"DB ERROR")
                    client.close()
                }
                else {
                    query.skip((page-1)*limit).limit(limit).sort(sort).toArray((err,result)=>{
                        if (err) {
                            logHelper.error(`DB SERVICE - READ ERROR`)
                            logHelper.debug(err)
                            next('ERROR',"DB ERROR");
                            client.close()
                        }
                        else {
                            let returnData = {
                                total:count,
                                page:page,
                                limit:limit,
                                items:result
                            }
                            next('SUCCESS',returnData);
                            client.close()
                        }
                    });
                }
            })
        } 
    });
}

crud.update = (obj,next)=>{
    MongoClient.connect(dburl,{ useNewUrlParser: true }, function (err, client) {
        if (err) {
            logHelper.error(`API SERVICE - KEY-VALUE HELPER - CONNECT DB ERROR`)
            logHelper.debug(err)
            next('ERROR',"DB ERROR");
        }
        else {
        	const db = client.db(config.dbName);
            let condition = obj.condition
            if (condition._id) {
                condition._id = new ObjectID(condition._id)
            }
            let newData = obj.data
            db.collection(obj.collection).findOneAndUpdate(condition,{$set:newData},{upsert:true,returnOriginal:false},function(err,result){
                if (err) {
                    logHelper.error(`API SERVICE - KEY-VALUE HELPER - QUERY ERROR`)
                    logHelper.debug(err)
                    next('ERROR',"DB ERROR");
                    client.close()
                }
                else {
                    next('SUCCESS',result.value);
                    client.close()
                }
            });
        } 
    });
}

crud.delete = (condition,next)=>{

}

module.exports = crud