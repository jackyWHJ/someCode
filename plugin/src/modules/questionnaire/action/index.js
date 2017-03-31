// import axios from 'zn-common/utils/axios';
import { Toast } from 'antd-mobile';

import { API } from '../dataConfig';

export const loadData = (list, ajaxParams) => {
	return {
		list,
		ajaxParams,
	}
}


export const updateScrollTop = (scrollTop) => {
	return {
		scrollTop
	}
}
