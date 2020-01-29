/*
 * @Descripttion: 简易代理池主程序
 * @Author: BerryBC
 * @Version: 0.1.1
 * @Date: 2019-01-20 22:32:21
 * @LastEditors  : BerryBC
 * @LastEditTime : 2020-01-29 20:48:45
 */
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
let objTimeConfig = {};
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
    let intCfgMaxFailTime = objConfig.MaxFailTime;
    objCTLIO = new cControllerIO(arrSaveSet, intCfgMaxFailTime);
    objCTSpy = new cControllerRequest(objWebCfg);
    objTimeConfig = objConfig.timeConfig;
    console.log(' 完成初始化 ');
    funGoPro();
    funVerifyProxy();
};

function funGoPro() {
    objCTSpy.reqPro(objCTLIO, (err, result) => {
        console.log((new Date().toString()) + ' 完成了爬代理网站。');
        setTimeout(() => {
            funGoPro();
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
                    funVerifyProxy();
                    // }, (1000 * 60 * 60 * (objTimeConfig.verify[0] + Math.random() * objTimeConfig.verify[1])));
                }, (1000 * 60 * (objTimeConfig.verify[0] + Math.random() * objTimeConfig.verify[1])));
            });
        });
    });
}
funInit();