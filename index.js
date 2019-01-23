//需要下载的库
const async = require('async');
const superagentCheerio = require('superagent-cheerio');
const request = require('superagent');
require('superagent-proxy')(request);

//自带的库
const fs = require('fs');
const path = require('path');

//自编库
const cCommon = require('./class/cCommon.js');
const cControllerIO = require("./class/cControllerIO");
const cControllerRequest = require("./class/cControllerRequest");
//全局变量
let objTimeConfig = { spy: [7, 10], verify: [5, 3] };
let objCTLIO;
let objCTSpy;

/**
 *读取配置文件并初始化。
 */
function funInit() {
	let strConfig = fs.readFileSync(path.join(__dirname, '/cfg.json'), { encoding: "utf-8" });
	let objConfig = JSON.parse(strConfig);
	let arrSaveSet = objConfig.saveSet;
	let objWebCfg = objConfig.webCfg;
	objCTLIO = new cControllerIO(arrSaveSet);
	objCTSpy = new cControllerRequest(objWebCfg);
	funGoPro();
};
function funGoPro() {
	objCTSpy.reqPro(objCTLIO, (err, result) => {
		console.log((new Date().toString()) + ' 完成了爬代理网站。');
		setTimeout(() => {
			funVerifyProxy();
		}, (1000 * 60 * (objTimeConfig.spy[0] + Math.random() * objTimeConfig.spy[1])));
	});
};
function funVerifyProxy() {
	objCTLIO.loadEveryProxy((err, result) => {
		console.log((new Date().toString()) + ' 列出完所有代理。');
		objCTSpy.verifyTheProxy(result, objCTLIO, (err, result) => {
			console.log((new Date().toString()) + ' 验证完所有了。');
			objCTLIO.saveTick((err, result) => {
				console.log((new Date().toString()) + ' 保存完。');
				setTimeout(() => {
					funGoPro();
				}, (1000 * 60 * 60 * (objTimeConfig.verify[0] + Math.random() * objTimeConfig.verify[1])));
			});
		});
	});
}
funInit();