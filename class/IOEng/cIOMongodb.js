//需要下载的库
const MongoClient = require('mongodb').MongoClient;

//自编库
const common = require('../cCommon.js');


class cMongodbIO {

    /**
     *Creates an instance of cMongodbIO.
     * @param {Object} objDBSet
     * @memberof cMongodbIO
     */
    constructor(objDBSet) {
        const that = this;
        that.dbSet = objDBSet;
        that.strMGUrl = 'mongodb://' + that.dbSet.user + ':' + that.dbSet.pw + '@localhost:' + that.dbSet.host + '/' + that.dbSet.dbName;
        that.clientMongo = null;
        MongoClient.connect(that.strMGUrl, { poolSize: 50, keepAlive: false, reconnectTries: 100, reconnectInterval: 30, useNewUrlParser: true }, function(err, client) {
            if (!err) {
                that.clientMongo = client;
            } else {
                console.log('error:in connect to MongoDB, err : ' + err);
            };
        });
    };
    /**
     *插入一个代理到Mongodb存储器中。
     *
     * @param {Object} [objProxy={}]
     * @param {requestCallback} funCB
     * @memberof cControllerIO
     */
    saveOneProxy(objProxy = {}, funCB) {
        if (Object.keys(objProxy).length) {
            const that = this;
            that.checkProxyExist(objProxy, (errCheck, resultCheck) => {
                if (!errCheck) {
                    if (!resultCheck) {
                        // MongoClient.connect(that.strMGUrl, function(err, client) {

                        // if (!err) {
                        const db = that.clientMongo.db(that.dbSet.dbName);
                        db.collection(that.dbSet.col).insertOne(objProxy, function(err, res) {
                            // client.logout();
                            // client.close();
                            if (!err) {
                                funCB(null, true);
                            } else {
                                funCB('error:in "saveOneProxyMongodb" after insert, err : ' + err);
                            };
                        });
                        // } else {
                        //     client.logout();
                        //     client.close();
                        //     funCB('error:in "saveOneProxyMongodb" after connect, err : ' + err);
                        // };
                        // });
                    };
                } else {
                    funCB(errCheck);
                };
            });
        } else {
            funCB('error:in "saveOneProxyMongodb" , err : 没有传入代理信息');
        };
    };
    /**
     *检查代理是否存在于现在的代理池
     * @param {Object} [objProxy={}]
     * @param {requestCallback} funCB
     * @memberof cControllerIO
     */
    checkProxyExist(objProxy = {}, funCB) {
        if (Object.keys(objProxy).length) {
            const that = this;
            // MongoClient.connect(that.strMGUrl, function(err, client) {
            // if (!err) {
            const db = that.clientMongo.db(that.dbSet.dbName);
            db.collection(that.dbSet.col).findOne({ u: objProxy.u, p: objProxy.p }, {}, function(err, item) {
                // client.logout();
                // client.close();
                if (!err) {
                    if (!!item) {
                        funCB(null, true);
                    } else {
                        funCB(null, false);
                    };
                } else {
                    funCB('error:in "checkProxyExistMongodb" after find, err : ' + err);
                };
            });
            // } else {
            //     client.logout();
            //     client.close();
            //     funCB('error:in "checkProxyExistMongodb" after connect, err : ' + err);
            // };
            // });
        } else {
            funCB('error:in "checkProxyExistMongodb" , err : 没有传入代理信息');
        };
    };

    /**
     *存储时刻，对于MongoDB不需要动作。
     * @param {requestCallback} funCB
     * @memberof cMongodbIO
     */
    saveTick(funCB) {
        //Do nothing in Mongodb	
        funCB(null, true);
    };

    /**
     *最终在CallBack中返回是一个数组类型，里面包含含有代理的数组。
     * @param {requestCallback} funCB 回调函数
     * @memberof cJSONIO
     */
    loadEveryProxy(funCB) {
        const that = this;
        // MongoClient.connect(that.strMGUrl, function(err, client) {
        // if (!err) {
        const db = that.clientMongo.db(that.dbSet.dbName);
        db.collection(that.dbSet.col).find({}, { 'noCursorTimeout': true }).toArray(function(err, item) {
            // client.logout();
            // client.close();
            if (!err) {
                if (!!item) {
                    let arrProxyBack = [];
                    for (const objProxyInMDB of item) {
                        arrProxyBack.push(common.funObj2Str(objProxyInMDB));
                    }
                    funCB(null, arrProxyBack);
                } else {
                    funCB(null, false);
                };
            } else {
                funCB('error:in "loadEveryProxyMongodb" after find, err : ' + err);
            };
        });
        //     } else {
        //         client.logout();
        //         client.close();
        //         funCB('error:in "loadEveryProxyMongodb" after connect, err : ' + err);
        //     };
        // });
    }

    /**
     * 删除某个MongoDB上的代理。
     * @param {Object} objProxy
     * @param {requestCallback} funCB
     * @memberof cMongodbIO
     */
    deleteOneProxy(objProxy, funCB) {
        const that = this;
        if (Object.keys(objProxy).length) {
            const that = this;
            // MongoClient.connect(that.strMGUrl, function(err, client) {
            //     if (!err) {
            const db = that.clientMongo.db(that.dbSet.dbName);
            db.collection(that.dbSet.col).deleteOne({ u: objProxy.u, p: objProxy.p }, function(err, item) {
                // client.logout();
                // client.close();
                funCB(null, true);
            });
            //     } else {
            //         client.logout();
            //         client.close();
            //         funCB('error:in "deleteOneProxyMongodb" after connect, err : ' + err);
            //     }
            // });
        } else {
            funCB('error:in "deleteOneProxyMongodb" , err : 没有传入代理信息');
        }
    }

    /**
     * 更新代理错误次数
     * @param {Object} objProxy
     * @param {Integer} intMaxFailTime
     * @param {requestCallback} funCB
     * @memberof cMongodbIO
     */
    updateProxyFailTime(objProxy, intMaxFailTime, funCB) {
        if (Object.keys(objProxy).length) {
            const that = this;
            // MongoClient.connect(that.strMGUrl, function(err, client) {
            //     if (!err) {
            const db = that.clientMongo.db(that.dbSet.dbName);
            db.collection(that.dbSet.col).findOne({ u: objProxy.u, p: objProxy.p }, {}, function(err, item) {
                if (!err) {
                    if (!!item) {
                        let bolCDel = false;
                        if (item.fail >= 0) {
                            if (item.fail < intMaxFailTime) {
                                let intNowFail = item.fail + 1;
                                const db = that.clientMongo.db(that.dbSet.dbName);
                                db.collection(that.dbSet.col).updateOne({ u: objProxy.u, p: objProxy.p }, { $set: { "fail": intNowFail } }, function(err, item) {
                                    // client.logout();
                                    // client.close();
                                });
                                bolCDel = false;
                            } else {
                                bolCDel = true;
                            };
                        } else {
                            bolCDel = true;
                        };
                        if (bolCDel) {
                            that.deleteOneProxy(objProxy, funCB);
                        } else {
                            funCB(null, true);
                        };
                    } else {
                        funCB(null, false);
                    };
                } else {
                    funCB('error:in "updateProxyFailTime" after find, err : ' + err);
                };
            });
            //     } else {
            //         client.logout();
            //         client.close();
            //         funCB('error:in "updateProxyFailTime" after connect, err : ' + err);
            //     };
            // });
        } else {
            funCB('error:in "updateProxyFailTime" , err : 没有传入代理信息');
        };
    };

    /**
     * 对代理错误次数清0
     * @param {Object} objProxy 代理对象
     * @param {requestCallback} funCB
     * @memberof cMongodbIO
     */
    cleanProxyFailTime(objProxy, funCB) {
        if (Object.keys(objProxy).length) {
            const that = this;
            // MongoClient.connect(that.strMGUrl, function(err, client) {
            //     if (!err) {
            const db = that.clientMongo.db(that.dbSet.dbName);
            db.collection(that.dbSet.col).findOne({ u: objProxy.u, p: objProxy.p }, {}, function(err, item) {
                if (!err) {
                    if (!!item) {
                        if (item.fail > 0) {
                            const db = that.clientMongo.db(that.dbSet.dbName);
                            db.collection(that.dbSet.col).updateOne({ u: objProxy.u, p: objProxy.p }, { $set: { "fail": 0 } }, function(err, item) {
                                // client.logout();
                                // client.close();
                            });
                        };
                        funCB(null, true);
                    } else {
                        funCB(null, false);
                    };
                } else {
                    funCB('error:in "cleanProxyFailTime" after find, err : ' + err);
                };
            });
            //     } else {
            //         client.logout();
            //         client.close();
            //         funCB('error:in "cleanProxyFailTime" after connect, err : ' + err);
            //     };
            // });
        } else {
            funCB('error:in "cleanProxyFailTime" , err : 没有传入代理信息');
        };
    };
    checkOnline(funCB) {
        const that = this;
        if (!that.clientMongo) {
            funCB(null, false);
        } else {
            funCB(null, true);
        }
    };
    reTryLink() {
        const that = this;
        that.strMGUrl = 'mongodb://' + that.dbSet.user + ':' + that.dbSet.pw + '@localhost:' + that.dbSet.host + '/' + that.dbSet.dbName;
        that.clientMongo = null;
        MongoClient.connect(that.strMGUrl, { poolSize: 100 }, function(err, client) {
            if (!err) {
                that.clientMongo = client;
                // funCB(err, false);
            } else {
                setTimeout(() => {
                    console.log('error:in connect to MongoDB, err : ' + err);
                    that.reTryLink();
                }, 3000);
            };
        });
    };
}

module.exports = cMongodbIO;