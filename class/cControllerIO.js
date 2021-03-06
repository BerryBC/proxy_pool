/*
 * @Descripttion: 存储模块，存储控制器
 * @Author: BerryBC
 * @Version: 0.1.1
 * @Date: 2019-01-23 09:28:35
 * @LastEditors  : BerryBC
 * @LastEditTime : 2020-02-13 20:30:32
 */
//需要下载的库
const async = require('async');
//自带的库
const path = require('path');
class cControllerIO {
    /**
     * 初始化时把配置各个输入输出控制器的定义存入当前实例中。
     * @param {Array} arrSaveIO
     * @memberof cControllerIO
     */
    constructor(arrSaveIO, intMaxFailTime) {
        const that = this;
        that.objCTLIOMethod = [];
        that.intMaxFailTime = intMaxFailTime;
        for (let intI = 0; intI < arrSaveIO.length; intI++) {
            const eleIO = arrSaveIO[intI];
            that.objCTLIOMethod.push(new(require(path.join(__dirname, eleIO.libPath)))(eleIO));
        };
    };

    /**
     * 插入一个代理到存储器中。
     * @param {Object} [objProxy={}]
     * @param {requestCallback} funCB
     * @memberof cControllerIO
     */
    saveOneProxy(objProxy = {}, funCB) {
        const that = this;
        let arrFun = [];
        objProxy.ft = new Date();
        objProxy.fail = 0;
        for (let intI = 0; intI < that.objCTLIOMethod.length; intI++) {
            arrFun.push((objProxy, funCB) => {
                that.objCTLIOMethod[intI].saveOneProxy(objProxy, funCB);
            });
        }
        async.applyEach(arrFun, objProxy, (err, result) => {
            if (!err) {
                funCB(null, true);
            } else {
                funCB(err);
            };
        });
        arrFun = null;
    }

    /**
     * 检查代理是否存在于现在的代理池。
     * @param {Object} [objProxy={}]
     * @param {requestCallback} funCB
     * @memberof cControllerIO
     */
    checkProxyExist(objProxy = {}, funCB) {
        const that = this;
        let arrFun = [];
        for (let intI = 0; intI < that.objCTLIOMethod.length; intI++) {
            arrFun.push((objProxy, funCB) => {
                that.objCTLIOMethod[intI].checkProxyExist({ u: objProxy.u, p: objProxy.p }, funCB);
            });
        }
        async.applyEach(arrFun, objProxy, (err, result) => {
            if (!err) {
                if (result.indexOf(true) > -1) {
                    funCB(null, true);
                } else {
                    funCB(null, false);
                }
            } else {
                funCB(err);
            }
        });
        arrFun = null;
    }

    /**
     * 存储时刻。
     * @param {requestCallback} funCB
     * @memberof cMongodbIO
     */
    saveTick(funCB) {
        const that = this;
        let arrFun = [];
        for (let intI = 0; intI < that.objCTLIOMethod.length; intI++) {
            arrFun.push((funCB) => {
                that.objCTLIOMethod[intI].saveTick(funCB);
            });
        }
        async.parallel(arrFun, (err, result) => {
            if (!err) {
                if (result.indexOf(true) > -1) {
                    funCB(null, true);
                } else {
                    funCB(null, false);
                }
            } else {
                funCB(err);
            }
        });
        arrFun = null;
    };

    /**
     * 读取全量代理信息，并以列表形式返回。
     * @param {requestCallback} funCB
     * @memberof cControllerIO
     */
    loadEveryProxy(funCB) {
        const that = this;
        let arrFun = [];
        for (let intI = 0; intI < that.objCTLIOMethod.length; intI++) {
            arrFun.push((funCB) => {
                that.objCTLIOMethod[intI].loadEveryProxy(funCB);
            });
        }
        async.parallel(arrFun, (err, result) => {
            let dictProxyCheckDup = [];
            let arrOutput = [];
            for (const arrProxy of result) {
                for (const strProxy of arrProxy) {
                    if (!dictProxyCheckDup[strProxy]) {
                        dictProxyCheckDup[strProxy] = true;
                        arrOutput.push(strProxy);
                    }
                }
            }
            funCB(err, arrOutput);
        });
        arrFun = null;
    }

    /**
     * 删除某个代理
     * @param {Object} objProxy
     * @param {requestCallback} [funCB=(err, result) => { }]
     * @memberof cControllerIO
     */
    deleteOneProxy(objProxy, funCB = (err, result) => {}) {
        const that = this;
        let arrFun = [];
        for (let intI = 0; intI < that.objCTLIOMethod.length; intI++) {
            arrFun.push((objProxy, funCB) => {
                that.objCTLIOMethod[intI].deleteOneProxy(objProxy, funCB);
            });
        }
        async.applyEach(arrFun, objProxy, (err, result) => {
            if (!err) {
                if (result.indexOf(true) > -1) {
                    funCB(null, true);
                } else {
                    funCB(null, false);
                }
            } else {
                funCB(err);
            }
        });
        arrFun = null;
    };

    /**
     * 更新代理错误次数
     * @param {Object} objProxy
     * @param {requestCallback} [funCB=(err, result) => { }]
     * @memberof cControllerIO
     */
    updateProxyFailTime(objProxy, funCB = (err, result) => {}) {
        const that = this;
        let arrFun = [];
        for (let intI = 0; intI < that.objCTLIOMethod.length; intI++) {
            arrFun.push((objProxy, funCB) => {
                that.objCTLIOMethod[intI].updateProxyFailTime(objProxy, that.intMaxFailTime, funCB);
            });
        };
        async.applyEach(arrFun, objProxy, (err, result) => {
            if (!err) {
                if (result.indexOf(true) > -1) {
                    funCB(null, true);
                } else {
                    funCB(null, false);
                }
            } else {
                funCB(err);
            }
        });
        arrFun = null;
    };

    /**
     * 对错误次数清0
     * @param {Object} objProxy
     * @param {requestCallback} [funCB=(err, result) => { }]
     * @memberof cControllerIO
     */
    cleanProxyFailTime(objProxy, funCB = (err, result) => {}) {
        const that = this;
        let arrFun = [];
        for (let intI = 0; intI < that.objCTLIOMethod.length; intI++) {
            arrFun.push((objProxy, funCB) => {
                that.objCTLIOMethod[intI].cleanProxyFailTime(objProxy, funCB);
            });
        };
        async.applyEach(arrFun, objProxy, (err, result) => {
            if (!err) {
                if (result.indexOf(true) > -1) {
                    funCB(null, true);
                } else {
                    funCB(null, false);
                }
            } else {
                funCB(err);
            }
        });
        arrFun = null;
    };
    checkOnline(funCB) {
        const that = this;
        let arrFun = [];
        for (let intI = 0; intI < that.objCTLIOMethod.length; intI++) {
            arrFun.push((funCB) => {
                that.objCTLIOMethod[intI].checkOnline(funCB);
            });
        }
        async.parallel(arrFun, (err, result) => {
            // let dictProxyCheckDup = [];
            // let arrOutput = [];
            let bolAllOL = true;
            for (const bolOnline of result) {
                bolAllOL = bolAllOL && bolOnline;
            };
            funCB(err, bolAllOL);
        });
        arrFun = null;
    };
};
module.exports = cControllerIO;