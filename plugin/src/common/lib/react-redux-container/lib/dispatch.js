import _ from 'lodash';

/**
  * 包装一下dispath，使通过dispatch的action可以不带type属性， 默认为当前容器组件的key值
  */
export const dispatchWrapper = (type, dispatch) => {
	return function dispatcher(action) {
		if (_.isFunction(action)) {
			action(dispatcher);
		} else {
			const actionType = action.type;
			if (actionType) {
				dispatch(action);
			} else {
				dispatch({
					type,
					...action
				});
			}
		}
	}
};