const md5 = require("./utils/md5.js");

// 生产环境的参数配置
const production = {
	baseUrl: 'http://test-mlearning.pingan.com.cn:45080',			// 接口服务器
	params: {
		sid: 'D73FCFA918AC4FF6BB8AA132FC679FF1'
	}
};

// 开发环境的参数配置
const development = {
	// baseUrl: 'http://10.20.21.159:7001',				// 接口服务器
	// baseUrl: 'http://hrmsv3-mlearning-dmzstg1.pingan.com.cn',
	baseUrl: 'http://test-mlearning.pingan.com.cn:45080',
	sid: 'D9E852240FC74446AD10DE1D4E4E7D94',				// 手动设置sid
	debug: true,
	params: {											// 测试时的参数
		pluginType: 2,
		appId: "com.pingan.wanjiab",
		accountType: 1,
		// userId: '17652223001',
		// phone: '17652223001',
		userId: '13751074503',
		phone: '13751074503',
		username: "xxp",
		birthday: "",
		token: "0E2E2BD633203645DCC00173A7AB6D2F"
	},
	getParams: function getParams() {
		let paramStr = "";
		for (var param in this.params) {
			if (param != 'token') {
				paramStr = paramStr + this.params[param] + '&';
			}
		}

		const time = new Date().getTime().toString(16);
		let tokenUrl = "TOKEN_TEST?" + paramStr + time;
		const token = md5(tokenUrl).toUpperCase();

		tokenUrl = tokenUrl + '&token=' + token;

		this.params.token = token;
		this.params.time = time;

		return this.params;
	}
};

module.exports = {
	production: production,
	development: development
}