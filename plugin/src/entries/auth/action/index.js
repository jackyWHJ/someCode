// import axios from 'zn-common/utils/axios';
import { URL } from '../dataConfig';

export const validateSid = (params = {}, success, fail) => {
	return dispatch => {
		if (Util.isDev()) {		// 开发环境
			params = { ...__AUTHPARAMS__, ...params };
		}

		Ajax({
			url: URL.Auth, 
			data: params,
			success(data) {
				if (data && data.sid) {
					success(data);
				} else {
					fail();
				}
			},
			error(xhr, type) {
				fail();
			}
		});
	}
};