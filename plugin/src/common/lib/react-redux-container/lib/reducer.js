import {PREFIX} from './common';

/**
*	containerReducer 唯一的一个reducer，在rootReducer中注册
*	action的type值前缀为 ${PREFIX}的，默认会由此reducer处理
*/
const containerReducer = (state = {}, action = {}) => {
	const actionType = action.type;

	// 如果action的type属性值以${PREFIX}开头，则会由此reducer处理
	if (actionType && ( actionType.startsWith(PREFIX) || state[`${PREFIX}${actionType}`] )) {
		const newState = {...state};
		let {type, ...data} = action;
		type = actionType.startsWith(PREFIX) ? type : PREFIX + actionType;

		// 根据传进了的action，直接更新reducer中的对象值
		if (!newState[type]) {
			newState[type] = data;
		} else {
			const updater = newState[type];
			for (let key in data) {
				if (updater.hasOwnProperty(key)) {
					updater[key] = data[key];
				}
			}

			newState[type] = updater;
		}
		// newState[type] = newState[type] || {};
		// newState[type] = {...newState[type], ...data};

		return newState;
	}

	return state;
};

export default containerReducer;