import React from 'react';
import { Modal } from 'antd-mobile';

export default function errorResponse( code, error = {} ) {
	if (code == "ECONNABORTED") {
		Modal.alert('连接错误', renderErrorDom(code, error.message || "连接超时"));
		return ;
	}

	if (!Util.isDev()) {
		Modal.alert('系统错误', renderErrorDom(code, "系统出错，请联系客服"));
	} else {
		Modal.alert('错误', renderErrorDom(code, error.response && error.response.message ? error.response.message : "接口出错"));
	}
}

const renderErrorDom = function renderErrorDom(code, message) {
	return <div>
			<div>编号: { code }</div>
			<div>错误信息: { message }</div>
		</div>
}