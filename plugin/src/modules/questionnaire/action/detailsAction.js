// import axios from 'zn-common/utils/axios';
import { Toast } from 'antd-mobile';

import { API } from '../dataConfig';
import {storageKeys} from 'zn-common/constants';

export const loadData = (ajaxParams) => {
	return dispatch => {
		Toast.loading('加载中...', 0);

		Ajax({ 
			url: API.getIntgPaper, 
			data: {
				nonGzip: 1,
				pageType: "plugin",
			 	umId: '',
			 	ver: Util.getVersion(),
			 	sid: Util.storage.getSid(),
			 	...ajaxParams,
			},
			type: /json$/ig.test(API.getIntgPaper)?"get":"post",//兼容模拟json请求
			success(data) {
				Toast.hide();

				if (data.code == 0) {
					dispatch( {data: data.body} );
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



export const updateData = (data) => {
	return {
		data,
	}
}



export const submitAction = (ajaxParams, dataProps) => {
	return dispatch => {
		Toast.loading('提交中...', 0);

		Ajax({ 
			url: API.saveIntgInfo, 
			data: {
				nonGzip: 1,
				pageType: "plugin",
			 	umId: '',
			 	ver: Util.getVersion(),
			 	sid: Util.storage.getSid(),
			 	...ajaxParams,
			},
			type: /json$/ig.test(API.getIntgPaper)?"get":"post",//兼容模拟json请求
			success(data) {
				Toast.hide();

				if (data.code == 0) {
					Toast.success("提交成功！", 3);
					dispatch( {data: {...dataProps, tested: "1"} } )
					//dispatch( {data: data.body} );
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

export const updateList = (intgId, list) => {
	var newList = list.map(function(item, index){
		if(item.intgId == intgId){
			item.istested = "1";
		}
		return item;
	})
	return {
		type: "questionnaire.list",
		list: newList,
	}
}


