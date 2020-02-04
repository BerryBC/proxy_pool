<!--
 * @Descripttion: 
 * @Author: BerryBC
 * @Date: 2019-01-23 17:26:08
 * @LastEditors: BerryBC
 * @LastEditTime: 2020-02-04 14:22:34
 -->
# Dependencies
- [async](https://github.com/caolan/async)
- [superagent](https://github.com/visionmedia/superagent)
- [cheerio](https://github.com/cheeriojs/cheerio)
- [node-mongodb-native](https://github.com/mongodb/node-mongodb-native)

----
# 其实这个只是我无聊的时候做的东西

### 1. 主程序超级简单
主程序就定义一个`请求函数`，一个`随机请求函数`，一个`验证函数`和一个`初始函数`，然后请求和验证两个函数就在不断`setTimeout`的互相调用。

### 2.程序结构
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
        ├──cIOJSON.js
        └──......
```
其实文件夹`IOEng`里面可以随时增加存储模块，然后在`cfg.json`里面增加存储模块的配置就行了。

### 3.扩展性
其实只需要在 `IOEng` 里面添加保存的接口函数再在配置那边配置好，就可以方便的存储到诸如 `MySQL` 、 `SQLServer` 、 等数据库。

### 4.后记
其实如果想看比较详细的内容可以看我写的思路(虽然只是很随便的写)。
[拾肆-NodeJS简单代理池（起）](https://blog.csdn.net/BerryBC/article/details/86700357)
[拾捌-NodeJS简单代理池（转）](https://blog.csdn.net/BerryBC/article/details/104110171)