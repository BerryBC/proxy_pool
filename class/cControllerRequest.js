
//需要下载的库
const async = require('async');
const superagentCheerio = require('superagent-cheerio');
const request = require('superagent');

//自编库
const common = require('./cCommon.js');
class cControllerRequest {
    /**
     *请求服务器控制器初始化。
     * @param {Object} objProxyWebSiteCfg
     * @memberof cControllerRequest
     */
	constructor(objProxyWebSiteCfg) {
		const that = this;
		that.arrPWS = objProxyWebSiteCfg.proxyWebSite;
		that.arrUA = objProxyWebSiteCfg.UserAgent;
		that.objHeader = objProxyWebSiteCfg.headerField;
		that.intPages = objProxyWebSiteCfg.numOfPages;
		that.switchAgent();
		that.cookies = [];
	}
    /**
     *开始爬，并存入输入输出控制器对象。
     * @param {Object} objCTLSave 传入输入输出控制器对象
     * @param {requestCallback} funCB 回传函数
     * @memberof cControllerRequest
     */
	reqPro(objCTLSave, funCB) {
		const that = this;
		let funGoSpy = (objWhatWeb, funCB) => {
			if (!!that.cookies[objWhatWeb.ws]) {
				that.objHeader.Cookie = that.cookies[objWhatWeb.ws];
			}
			else {
				that.objHeader.Cookie = '';
			}
			let strWebURL = that.arrPWS[objWhatWeb.ws].replace('*', objWhatWeb.pg);
			request.get(strWebURL).set(that.objHeader).use(superagentCheerio).then((res) => {
				if (!!res.header['set-cookie']) {
					that.cookies[objWhatWeb.ws] = common.renewCookies(that.cookies[objWhatWeb.ws], res.header['set-cookie']);
				}
				;
				let strTableContent = res.$('table').text();
				let arrProxyList = strTableContent.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}[\n\s]*\d{1,4}/g);
				for (const strOneProxy of arrProxyList) {
					let arrReshapeProxy = strOneProxy.replace(/\s+/g, ':').split(':');
					let objProxyForSave = { u: arrReshapeProxy[0], p: arrReshapeProxy[1] };
					objCTLSave.saveOneProxy(objProxyForSave, () => {
						//It will do nothing.
						//But um....OK, give it a callback.						
					});
				}
				setTimeout(() => {
					funCB(null, true);
				}, 2000 + Math.random() * 2000);
			}).catch((err) => {
				//上不了就上不了了，不报错了。
				setTimeout(() => {
					funCB(null, err);
				}, 2000 + Math.random() * 2000);
			});
		};
		let arrSpyWebCFG = [];
		for (let intJ = 1; intJ < that.intPages; intJ++) {
			for (let intI = 0; intI < that.arrPWS.length; intI++) {
				let objSaveProxy = { ws: intI, pg: intJ };
				arrSpyWebCFG.push(objSaveProxy);
			}
		}
		async.eachSeries(arrSpyWebCFG, funGoSpy, (err) => {
			funCB(err, true);
			that.switchAgent();
			that.cookies = [];
		});
	}
    /**
     *改变当前User-Agent信息，模拟不同的电脑登陆(虽然我知道没什么鸟用)。
     * @memberof cControllerRequest
     */
	switchAgent() {
		const that = this;
		that.objHeader['User-Agent'] = that.arrUA[Math.floor(Math.random() * that.arrUA.length)];
	}
	verifyTheProxy(arrProxy, ctlIO, funCB) {
		let that = this;
		// let strProxy = '127.0.0.1:64878';
		// request.get('http://www.89ip.cn/index_1.html').use(superagentCheerio).proxy(proxy).set(objHeader).then((res) => { });
		let funCheck = function (item, funCB) {
			let strProxy = 'http://' + item;
			request.get('https://www.baidu.com').timeout({ response: 5000 }).use(superagentCheerio).proxy(strProxy).set(that.objHeader).then((res) => {
				funCB(null, true);
			}).catch((err) => {
				let objProxy = common.funStr2Obj(item);
				ctlIO.deleteOneProxy(objProxy);
				funCB(null, true);
			});
		}
		async.eachLimit(arrProxy, 6, funCheck, (err) => {
			funCB(err, true);
		});
	}
}
module.exports = cControllerRequest;
