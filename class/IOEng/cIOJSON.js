//自带的库
const fs = require('fs');
const path = require('path');

//自编库
const common = require('../cCommon.js');

class cJSONIO {
	/**
	 *Creates an instance of cJSONIO.
	 * @param {Object} objJSONSet
	 * @memberof cJSONIO
	 */
	constructor(objJSONSet) {
		const that = this;
		that.dictProxy = [];
		that.fileName = objJSONSet.file;
		if (fs.existsSync(path.join(__dirname, that.fileName))) {
			let strProxyContent = fs.readFileSync(path.join(__dirname, that.fileName), { encoding: "utf-8" });
			let objProxyContent = JSON.parse(strProxyContent);
			let arrProxyContent = objProxyContent.ProxyContent;
			for (let intI = 0; intI < arrProxyContent.length; intI++) {
				const eleProxy = arrProxyContent[intI];
				that.dictProxy[eleProxy] = true;
			};
		};
	}
	/**
	 *插入一个代理到Mongodb存储器中。
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
						let strUandP = common.funObj2Str(objProxy);
						that.dictProxy[strUandP] = true;
						funCB(null, true);
					};
				} else {
					funCB(errCheck);
				};
			});
		} else {
			funCB('error:in "saveOneProxyJSON" , err : 没有传入代理信息');
		};
	}
	/**
	 *检查代理是否存在于现在的代理池
	 * @param {Object} [objProxy={}]
	 * @param {requestCallback} funCB
	 * @memberof cControllerIO
	 */
	checkProxyExist(objProxy = {}, funCB) {
		const that = this;
		if (Object.keys(objProxy).length) {
			let strUandP = common.funObj2Str(objProxy);
			if (!!that.dictProxy[strUandP]) {
				funCB(null, true);
			} else {
				funCB(null, false);
			};
		} else {
			funCB('error:in "checkProxyExistMongodb" , err : 没有传入代理信息');
		};
	}
	/**
	 *存储时刻，把代理存储的字典对象存储为指定位置的JSON文件。
	 * @param {requestCallback} funCB
	 * @memberof cMongodbIO
	 */
	saveTick(funCB) {
		const that = this;
		let objSave = { ProxyContent: [] }
		let arrPC = [];
		for (const strProxy in that.dictProxy) {
			if (that.dictProxy.hasOwnProperty(strProxy)) {
				arrPC.push(strProxy);
			};
		};
		objSave.ProxyContent = arrPC;
		fs.writeFile(path.join(__dirname, that.fileName), JSON.stringify(objSave), { encoding: "utf-8" }, (err) => {
			funCB(err, !err);
		});
	}
	/**
	 *最终在CallBack中返回是一个数组类型，里面包含含有代理的数组。
	 * @param {requestCallback} funCB 回调函数
	 * @memberof cJSONIO
	 */
	loadEveryProxy(funCB) {
		const that = this;
		let arrProxyBack = [];
		for (const strProxy in that.dictProxy) {
			if (that.dictProxy.hasOwnProperty(strProxy)) {
				arrProxyBack.push(strProxy);
			};
		};
		funCB(null, arrProxyBack);
	}
	/**
	 * 删除某个内存中的代理。
	 * @param {Object} objProxy
	 * @param {requestCallback} funCB
	 * @memberof cJSONIO
	 */
	deleteOneProxy(objProxy, funCB) {
		const that = this;
		let strUandP = common.funObj2Str(objProxy);
		if (!!that.dictProxy[strUandP]) {
			delete that.dictProxy[strUandP];
		}
		funCB(null, true);
	}
};
module.exports = cJSONIO;