import { Toast } from 'antd-mobile';

export const API ={
    courseSubjectIndex:'/learn/app/clientapi/course/tobStudyMotList.do'
};


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

export const updataParams = (params)=>{
	return{
		ajaxParams:params
	}
}