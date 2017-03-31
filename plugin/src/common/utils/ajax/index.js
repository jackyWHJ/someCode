import $ from 'n-zepto';
import 'zepto/src/callbacks';
import 'zepto/src/deferred';

const def = {
	type: 'POST',
	dataType: 'json',
	timeout: 20000			// 20s
};

const baseUrl = Util.getBaseUrl();

export default function ajax(config) {
	const cfg = { ...def, ...config };

	if (!cfg.url) {
		return ;
	}

	if (!Util.isAbsoluteUrl(cfg.url)) {
		const splitter = cfg.url.startsWith('/') ? '' : '/';
		cfg.url = baseUrl + splitter + cfg.url;
	}

	return $.ajax(cfg);
};