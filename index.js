/*
 * @Descripttion: 简易代理池主程序
 * @Author: BerryBC
 * @Version: 0.3.0
 * @Date: 2019-01-20 22:32:21
 * @LastEditors: BerryBC
 * @LastEditTime: 2020-05-08 23:18:37
 */
//需要下载的库
// const async = require('async');
// const superagentCheerio = require('superagent-cheerio');
const request = require('superagent');
require('superagent-proxy')(request);

//自带的库
const fs = require('fs');
const path = require('path');

//自编库
// const cCommon = require('./class/cCommon.js');
const cControllerIO = require("./class/cControllerIO");
const cControllerRequest = require("./class/cControllerRequest");
//全局变量
let objTimeConfig = {};
let objCTLIO;
let objCTSpy;
let objReadyNextRound = { 'GoPro': true, 'VerifyProxy': true, 'GoRand': true };

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
    let intRetry = 0;
    funStarMain();

    function funStarMain() {
        objCTLIO.checkOnline(function(err, bolResult) {
            if (bolResult) {
                console.log(' 完成初始化 ');
                timeToGoPro();
                timeToVerifyProxy();
                timeToGoRandPro();
            } else {
                intRetry++;
                console.log(' 第 ' + intRetry + ' 次尝试启动');
                setTimeout(funStarMain, 3000);
            };
        });
    };
};

function funGoPro() {
    objCTSpy.reqPro(objCTLIO, (err, result) => {
        console.log((new Date().toString()) + ' 完成了爬代理网站。');
        setTimeout(() => {
            objReadyNextRound.GoPro = true;
        }, (1000 * 60 * 60 * (objTimeConfig.spy[0] + Math.random() * objTimeConfig.spy[1])));
    });
};

function timeToGoPro() {
    setInterval(function() {
        if (objReadyNextRound.GoPro) {
            objReadyNextRound.GoPro = false;
            funGoPro();
            // console.log(' -- 真的 GoPro');
        };
        // console.log('定时检查是否 GoPro');
    }, 20000);
};


function funGoRandPro() {
    objCTSpy.reqRandPro(objCTLIO, (err, result) => {
        console.log((new Date().toString()) + ' 完成了随机测试网上服务器。');
        setTimeout(() => {
            objReadyNextRound.GoRand = true;
        }, (1000 * 60 * 60 * (objTimeConfig.testrand[0] + Math.random() * objTimeConfig.testrand[1])));
    });
};

function timeToGoRandPro() {
    setInterval(function() {
        if (objReadyNextRound.GoRand) {
            objReadyNextRound.GoRand = false;
            funGoRandPro();
            // console.log(' -- 真的 GoRand');
        };
        // console.log('定时检查是否 GoRand');
    }, 20000);
};



function funVerifyProxy() {
    objCTLIO.loadEveryProxy((err, result) => {
        console.log((new Date().toString()) + ' 列出完所有代理。');
        objCTSpy.verifyTheProxy(result, objCTLIO, (err, result) => {
            console.log((new Date().toString()) + ' 验证完所有了。');
            objCTLIO.saveTick((err, result) => {
                console.log((new Date().toString()) + ' 保存完。');
                setTimeout(() => {
                    objReadyNextRound.VerifyProxy = true;
                }, (1000 * 60 * 60 * (objTimeConfig.verify[0] + Math.random() * objTimeConfig.verify[1])));
            });
        });
    });
};

function timeToVerifyProxy() {
    setInterval(function() {
        if (objReadyNextRound.VerifyProxy) {
            objReadyNextRound.VerifyProxy = false;
            funVerifyProxy();
            // console.log(' -- 真的 GoVerify');
        };
        // console.log('定时检查是否 GoVerify');
    }, 20000);
};

funInit();