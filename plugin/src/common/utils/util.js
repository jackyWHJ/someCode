import store from 'store';
import {storageKeys} from '../constants';
import _ from 'lodash';

// 获取应用的版本号
const getVersion = () => {
	return __VER__;
};

// 获取接口服务器地址
const getBaseUrl = () => {
	return __BASEURL__;
};

// 是否为开发环境
const isDev = () => {
	return __ISDEV__;
};

const backToNative = () => {
	const ua = window.navigator.userAgent.toUpperCase();
	if (ua.indexOf('ANDROID') != -1) {
		if (window.JsNative && _.isFunction(window.JsNative.closeWebView)) {
			window.JsNative.closeWebView();
		}
	} else if (ua.indexOf('IPHONE OS') != -1) {
		let iframe = document.createElement('iframe');
		iframe.src = "http://zhi-niao/JsNative/closeWebView";
		iframe.style.display = "none";
		document.body.appendChild(iframe);
	    iframe.parentNode.removeChild(iframe);
	    iframe = null;
	} else if (ua.indexOf('MICROMESSENGER') != -1) {
		window.location.href = document.referrer;
	}
};

const isAbsoluteUrl = (url) => {
	return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

const strToReactDom = (str) => {
	return { 
		dangerouslySetInnerHTML: {
			__html: str
		}
	}
};

const getDeviceDPR = () => {

	// var win = window;
	// var ua = navigator.userAgent;
	// var matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
	// var UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
	// var isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;
	// var isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
	// var dpr = win.devicePixelRatio || 1;
	// if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
	//   // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
	//   dpr = 1;
	// }
	
	// return dpr;
	return 1;
};

const ensureRouterUrl = (url) => {
	if (!_.isString(url) || !url) {
		return url;
	}

	if (!url.startsWith('/')) {
		url = "/" + url;
	}

	return url;
};

const dateToStr = (date, format = "yyyy-MM-dd hh:mm:ss") => {
	let dateObj = null;
	try {
		dateObj = new Date(date);
	} catch(_) {
		return null;
	}

	const year = dateObj.getYear();
	const fullYear = dateObj.getFullYear();
	const month = dateObj.getMonth() + 1;
	const day = dateObj.getDate();
	const hour = dateObj.getHours();
	const minute = dateObj.getMinutes();
	const second = dateObj.getSeconds();

	format = format.replace('yyyy', fullYear);
	format = format.replace('MM', month > 9 ? month : '0' + month);
	format = format.replace('M', month);
	format = format.replace('dd', day > 9 ? day : '0' + day);
	format = format.replace('d', day);
	format = format.replace('hh', hour > 9 ? hour : '0' + hour);
	format = format.replace('h', hour);
	format = format.replace('mm', minute > 9 ? minute : '0' + minute);
	format = format.replace('m', minute);
	format = format.replace('ss', second > 9 ? second : '0' + second);
	format = format.replace('s', second);

	return format;
};

const storage = {
	push(key, data) {
		store.set(key, data);
	},

	get(key) {
		return store.get(key);
	},

	remove(key) {
		store.remove(key);
	},

	clear() {
		store.clear();
	},

	getStore() {
		return store;
	},

	getSid() {
		return this.get(storageKeys.SID);
	},

	getHomeId() {
		const homeInfo = this.get(storageKeys.HOMEINFO) || {};
		return homeInfo.homeId;
	},

	getNavBarColor() {
		const homeInfo = this.get(storageKeys.HOMEINFO) || {};
		return homeInfo.navBarColor;
	}

};

module.exports = {
	storage,
	getVersion,
	getBaseUrl,
	isDev,
	isAbsoluteUrl,
	backToNative,
	getDeviceDPR,
	dateToStr,
	strToReactDom,
	ensureRouterUrl
}