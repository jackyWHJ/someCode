import axios from 'zn-common/utils/axios';
import { Toast } from 'antd-mobile';

import { API } from '../dataConfig';

export const loadCustomTopicData = (spId) => {
	return dispatch => {
		Toast.loading('加载中...', 0);
		Ajax({ 
			url: API.customTopicDataAPI, 
			data: {
				nonGzip: 1,
				pageType: "plugin",
				spId: spId,
			 	umId: '',
			 	ver: Util.getVersion(),
			 	sid: Util.storage.getSid()
			},
			success(data) {
				Toast.hide();
				if (data.code == 0) {
					dispatch( dataAdapter(data) );
				} else {
					Toast.info(data.message, 3);
				}
			},
			error(xhr, type) {
				Toast.hide();
			}
		});
	}
}

const dataAdapter = function dataAdapter( data ) {
	if (data && data.body) {
		return data.body;
	}
	return {};
};