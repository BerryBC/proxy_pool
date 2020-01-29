# Dependencies
- [async](https://github.com/caolan/async)
- [superagent](https://github.com/visionmedia/superagent)
- [cheerio](https://github.com/cheeriojs/cheerio)
- [node-mongodb-native](https://github.com/mongodb/node-mongodb-native)

> # 2019-1-30

### 1. 我想起了其实我有时候想做爬虫
`爬虫`很多人绕不开的一个事实就是会`封IP`，那么这个时候就需要一个`代理池`了（其实`代理池`是否有用我也不太清楚）。
`代理池`我看网上很多方法做，我选择了最简单的--[NodeJs从零构建代理ip池（二）项目框架介绍与搭建](https://www.jianshu.com/p/a8922e1551ae)。

### 2. 我也很想抄啊，但我想存在MongoDB中，所以只能改框架
直接抄是有点困难，于是只能看看写写，后来想出一个超级简单的框架。
> 图片看不到

### 3. 主程序超级简单
主程序就定义一个`请求函数`，一个`验证函数`和一个`初始函数`，然后请求和验证两个函数就在不断`setTimeout`的互相调用。
> 图片看不到

### 4.ES6到底是什么？
说真的，看到要求那里都写着需求熟练`ES6`什么什么什么什么规范，我真不太清楚，到底`ES6`跟前期学的有什么不同呢？于是我就搜索了一下，结果，发现了一个神奇的东西：[《ECMAScript 6 入门》](http://es6.ruanyifeng.com/#README)，看完十分感动！
于是我决定在这次机会浅浅的学习一下。

### 5.还是先放源代码先
源代码在[一个全球交友平台上](https://github.com/BerryBC/proxy_pool)。
大体结构如下
```
├──index.js
├──cfg.json
└──  class
    ├──cCommon.js
    ├──cControllerIO.js
    ├──cControllerRequest.js
    └── IOEng
        ├──cIOMongodb.js
        └──cIOJSON.js
```
其实文件夹`IOEng`里面可以随时增加存储模块，然后在`cfg.json`里面增加存储模块的配置就行了。

### 6.无聊如我还会有什么话题呢？
其实我一开觉得我有很多东西写的，好像`箭头函数`、`js的类`、`async`等，但后来发现网上一大堆的，我就还是算了，我觉得要找到好工作，现在还是学`python`吧。


> 2020-1-29

### 1.缘起
原本的`架构`介绍如下：
[拾肆-NodeJS简单代理池（起）](https://blog.csdn.net/BerryBC/article/details/86700357)

然后今天为了做其他需要把这个完善一下。

### 2.配置文件
原本就没用 `ini` 的`配置文件`存储方式，所以就用一个 `JSON` 文件存储配置，其中代码如下：
```js
/**
 *读取配置文件并初始化。
 */
function funInit() {
    //读取配置文件
    let strConfig = fs.readFileSync(path.join(__dirname, '/cfg.json'), { encoding: "utf-8" });
    //文本转为对象
    let objConfig = JSON.parse(strConfig);
    //应用各种配置
    let arrSaveSet = objConfig.saveSet;
    let objWebCfg = objConfig.webCfg;
    objCTLIO = new cControllerIO(arrSaveSet);
    objCTSpy = new cControllerRequest(objWebCfg);
    objTimeConfig = objConfig.timeConfig;
    console.log(' 完成初始化 ');
    funGoPro();
};
```
但 `JSON` 有一个坏处，就是无法`注释`，只能增加多一个`字段`作为注释。

```
//原本为：
"saveSet": [{
  "libPath": "/IOEng/cIOMongodb.js",
  "dbName": "dbProxy",
  "host": "27017",
  "user": "Berry",
  "pw": "Berry",
  "col": "tbProxy"
}, {
  "libPath": "/IOEng //cIOJSON.js",
  "file": "../../proxy.json"
}]

//新增一字段，把内容写到该内容里面并作为字符改为：
"saveSet": [{
  "libPath": "/IOEng/cIOMongodb.js",
  "dbName": "dbProxy",
  "host": "27017",
  "user": "Berry",
  "pw": "Berry",
  "col": "tbProxy"
}],
"Comment": {
  "ForsaveSet": ", {'libPath': '/IOEng //cIOJSON.js','file': '../../proxy.json'}"
}
```

### 3.保存时加入时间
原本保存的内容只有两个内容：
```js
ProxyContent:[
  {
    u:"119.101.118.126",
    p:"9999"
  }
]
```
现在需要增加保存时间为：
```js
ProxyContent:[
  {
    u:"119.101.118.126",
    p:"9999",
    ft:1580267620322
  }
]
```

### 4.修改检测数据库是否存在该代理
因为前期存入`数据库`只存入`代理地址`、`代理端口`，故在新增字段之后是会检测不到存在的，所以只能修改为查找数据库时只查找`地址`以及`端口`，以针对 `MongoDB` 的`驱动`为例，修改一下：
```
//修改前
checkProxyExist(objProxy = {}, funCB) {
    ....
      db.collection(that.dbSet.col).findOne(objProxy, {}, function(err, item) {
    ....
    };

//修改后
checkProxyExist(objProxy = {}, funCB) {
    ....
      db.collection(that.dbSet.col).findOne({ u: objProxy.u, p: objProxy.p }, {}, function(err, item) {
    ....
    };
```

### 5.修改循环流程
原本的`流程`图为：
> 图片看不到

更改后的流程图：
> 图片看不到

### 6.修改这个算是完成了吧
测试好像还需要一段时间，就先整理一下今天要做的事情：

- [x] 把前期做的代理池修改一下
- [ ] 在腾讯云服务器上配置PM2
- [ ] 找寻 Python 爬虫相关包及方法
- [ ] 思考关键字舆情该怎么保存
- [x] 吃个好早餐