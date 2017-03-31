export const API = {
	indexDataAPI: "/learn/app/clientapi/home/loadHome.do"
};

const ensureUrl = (url) => {
	if (!url.startsWith('/')) {
		return "/" + url;
	}

	return url;
};

export const getRouterUrl = (data = {}) => {
	const isList = data.resourceType == "4" && data.ext;
	const type = isList ? data.ext.type : data.resourceType;
	const module = moduleMap[type];


	if (module && module.enable) {
		let routers = {};

		if (module.getRouterUrl) {
			routers = module.getRouterUrl(data);
			return ensureUrl(isList ? routers.list : routers.detail);
		}

		return ensureUrl(isList ? module.list : module.detail);
	}

	return "";
};

export const moduleMap = {
	23: {	// 问卷
		enable: true,
		getRouterUrl(data){
			return {
				list: 'questionnaire',
				detail: 'questionnaire/questionnaireDetails/' + data.resourceId
			}
		}
	},
	0: { //课程
		enable: true,
		getRouterUrl(data) {
			return {
				list: '',
				detail: 'classify/courseDetail/' + data.resourceId
			}
		}
	},
	1: {	// 资讯
		enable: true,
		list: 'info/information',
		detail: 'info/information/infoDetail'
	},
	14: {	//	必修
		enable: true,
		list: 'courseLearn/14',
		detail: 'courseLearn/14'
	},
	29:{  //  选修
		enable: true,
		list: 'courseLearn/29',
		detail: 'courseLearn/29'
	},
	3:{	//	自定义专题
		enable: true,
		getRouterUrl(data){
			return {
				list: 'customTopic/'+ data.resourceId + '/' + data.title,
				detail: 'customTopic/'+ data.resourceId + '/' + data.title,
			}
		}
	},
	5:{//排行榜
		enable: true,
		list: 'rank',
		detail: 'rank'
	},
	12:{ // 课程专题
		enable: true,
		getRouterUrl(data){
			return {
				list: '/courseSubject',
				detail: '/courseSubject/subjectDetail/' + data.resourceId
			}
		}
	},
	18:{	// 课程分类
		enable: true,
		getRouterUrl(data){
			return {
				list: 'classify/mainface',
				detail: 'classify/mainface'
			}
		}
	},
	10:{//考试列表
		enable: true,
		list: 'examMain',
		detail: 'examMain'
	}
};