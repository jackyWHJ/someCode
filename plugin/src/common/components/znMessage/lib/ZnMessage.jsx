import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Modal } from 'antd-mobile';

const ZnMessage = {};

ZnMessage.info = function info(message, duration) {
	return buildMessage(message, 'info', duration);
};

ZnMessage.error = function error(message, duration) {
	return buildMessage(message, 'error', duration);
};

ZnMessage.warning = function warning(message, duration) {
	return buildMessage(message, 'warning', duration);
};

const buildMessage = function buildMessage(message, type, duration = 3) {
	let timer = null;
	const div = document.createElement('div');
	document.body.appendChild(div);

	function clearTimer() {
		if (timer) {
			window.clearTimeout(timer);
			timer = null;

			unmountComponentAtNode(div);
			div.parentNode.removeChild(div);
		}
	}

	if (duration > 0) {
		timer = window.setTimeout(() => {
			clearTimer();
		}, duration * 1000);
	}

	render(<Modal className={`zn-message-${type}`} transparent visible maskClosable closable={false} onClose={clearTimer}>
			<div style={{ textAlign: 'center' }}>
				{ message }
			</div>
		</Modal>, div);
};

export default ZnMessage;