// import axios from 'zn-common/utils/axios';
import { Toast } from 'antd-mobile';

import { API } from '../dataConfig';


export const changeTab = (activeKey) => {
	return {
		activeKey,
	}
}


export const loadDataRequired = (listRequired, ajaxParamsRequired) => {
	return {
		listRequired,
		ajaxParamsRequired,
	}
}


export const updateScrollTopRequired = (scrollTopRequired) => {
	return {
		scrollTopRequired
	}
}



export const loadDataElective = (listElective, ajaxParamsElective) => {
	return {
		listElective,
		ajaxParamsElective,
	}
}


export const updateScrollTopElective = (scrollTopElective) => {
	return {
		scrollTopElective
	}
}

