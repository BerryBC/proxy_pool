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
						MongoClient.connect(that.strMGUrl, function (err, client) {
							if (!err) {
								const db = client.db(that.dbSet.dbName);
								db.collection(that.dbSet.col).insertOne(objProxy, function (err, res) {
									client.close();
									if (!err) {
										funCB(null, true);
									} else {
										funCB('error:in "saveOneProxyMongodb" after insert, err : ' + err);
									};
								});
							} else {
								funCB('error:in "saveOneProxyMongodb" after connect, err : ' + err);
							};
						});
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
			MongoClient.connect(that.strMGUrl, function (err, client) {
				if (!err) {
					const db = client.db(that.dbSet.dbName);
					db.collection(that.dbSet.col).findOne(objProxy, {}, function (err, item) {
						client.close();
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
				} else {
					funCB('error:in "checkProxyExistMongodb" after connect, err : ' + err);
				};
			});
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
		MongoClient.connect(that.strMGUrl, function (err, client) {
			if (!err) {
				const db = client.db(that.dbSet.dbName);
				db.collection(that.dbSet.col).find({}).toArray(function (err, item) {
					client.close();
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
			} else {
				funCB('error:in "loadEveryProxyMongodb" after connect, err : ' + err);
			};
		});
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
			MongoClient.connect(that.strMGUrl, function (err, client) {
				if (!err) {
					const db = client.db(that.dbSet.dbName);
					db.collection(that.dbSet.col).deleteOne(objProxy, function (err, item) {
						client.close();
						funCB(null, true);
					});
				} else {
					funCB('error:in "deleteOneProxyMongodb" after connect, err : ' + err);
				}
			});
		} else {
			funCB('error:in "deleteOneProxyMongodb" , err : 没有传入代理信息');
		}
	}
}

module.exports = cMongodbIO;