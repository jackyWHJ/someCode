import axios from 'axios';
import queryString from 'querystring';
import errorResponse from './axios.error';

const CancelToken = axios.CancelToken;

// 接口的基本地址
axios.defaults.baseURL = Util.getBaseUrl();

// post请求方式，Content-Type默认为application/x-www-form-urlencoded
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 默认的请求时间为20秒
axios.defaults.timeout = 20000;

// 默认返回类型是json格式
axios.defaults.responseType = 'json';

// before request
axios.interceptors.request.use(function (config) {
	return config;
}, function (error) {
	return Promise.reject(error);
});

// before response
axios.interceptors.response.use(function (response) {
	return Promise.resolve(response.data);
}, function (error) {
	return dispatchErrorResponse(error);
});

const dispatchErrorResponse = function dispatchErrorResponse(error = {}) {
	const response = error.response || {};
	const status = response.status;

	if (error.code == 'ECONNABORTED' || status >= 400) {
		errorResponse(error.code, error);
	} else {
		return Promise.reject(error);
	}
};

const transformRequest = function transformRequest(data) {
	return queryString.stringify(data);
};

const znAxios = function znAxios( config ) {
	if (!config.transformRequest) {
		config.transformRequest = [ transformRequest ];
	}

	if (!config.data) {
		config.data = {};
	}
	config.data.d = new Date().getTime();

	return getAxios()({
		method: 'post',
		...config
	});
};

znAxios.getAxios = function getAxios() {
	return axios;
};

/* 	will return an object
* 	token is for axios config,
* 	when what to cancel request, call method cancel.
*
*	Example:
*		const token = znAxios.getCancelToken(()=>{console.log("token")});
*		znAxios({ cancelToken: token.token });
*		token.cancel();
*/
znAxios.getCancelToken = function getCancelToken( cancel ) {
	const tokenObj = {};
	const token = new CancelToken(function executor( c ) {
		if (cancel && cancel.apply) {
			cancel.apply(null);
		}

		tokenObj.cancel = c;
	});

	tokenObj.token = token;

	return tokenObj;
};

export default znAxios;