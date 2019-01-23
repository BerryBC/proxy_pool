class cCommon { };
/**
 *根据新的SetCookies修改旧的Cookies字符串
 * @param {String} strOldCookies
 * @param {String} arrSetCookies
 * @returns {String}
 */
cCommon.renewCookies = function (strOldCookies, arrSetCookies) {
	let strNewCookies = '';
	let arrNewCookies = [];
	let objCookies = {};
	if (!strOldCookies) strOldCookies = '';
	let arrOldCookies = strOldCookies.split(';');
	if (strOldCookies) {
		for (let intI = 0; intI < arrOldCookies.length; intI++) {
			let arrOneField = arrOldCookies[intI].split('=');
			objCookies[arrOneField[0].trim()] = arrOneField[1];
		};
	};
	for (const strSingleCookie of arrSetCookies) {
		let arrSingleCookie = strSingleCookie.split(';');
		let arrOneField = arrSingleCookie[0].split('=');
		objCookies[arrOneField[0].trim()] = arrOneField[1];
	}
	for (const strCookieName in objCookies) {
		if (objCookies.hasOwnProperty(strCookieName)) {
			arrNewCookies.push(strCookieName + '=' + objCookies[strCookieName]);
		};
	};
	strNewCookies = arrNewCookies.join(';');
	return strNewCookies;
};

/**
* 把代理对象转乘字符串
* @param {Object} objProxy
* @returns {String} 返回代理对象的
*/
cCommon.funObj2Str = function (objProxy) {
	let strReturn = "";
	strReturn = objProxy.u + ':' + objProxy.p;
	return strReturn;
};
/**
 * 把代理字符串转为对象。
 * @param {String} strProxy
 * @returns {Object} 返回代理字符串。
 */
cCommon.funStr2Obj = function (strProxy) {
	let objReturn = {};
	let arrProxy=strProxy.split(':');
	objReturn.u=arrProxy[0];
	objReturn.p=arrProxy[1];
	return objReturn;
};
module.exports = cCommon;