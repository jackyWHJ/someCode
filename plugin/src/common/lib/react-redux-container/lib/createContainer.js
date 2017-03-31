import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {dispatchWrapper} from './dispatch';
import {PREFIX} from './common';

/**
*	getReducerKey 根据key值，获取actionType
*	key, 是容器的唯一标识
*/
const getReducerKey = (key) => {
	return PREFIX + key;
};

/**
*	checkInitState 检查组件的model是否为对象值
*	key, 是容器的唯一标识
*	initState, reducer中model
*/
const checkInitState = (key, initState) => {
	if (_.isUndefined(initState)) {
		throw new Error('container: \'', key , '\', initState should be a plain object.');
	} 
};

/**
*	getInjectorsState， 获取需要注入的reducer
*	state， redux的状态树
*	injectors, 需要注入的其他reducer
*/
const getInjectorsState = (state, injectors) => {
	if (!_.isArray(injectors)) {
		return {};
	}

	const states = {};
	const containerReducer = state.containerReducer;

	injectors.map(injector => {
		const reducerKey = getReducerKey(injector);

		// 首先获取containerReducer中的reducer，若无，则从state中获取
		if (containerReducer[reducerKey]) {
			states[injector] = containerReducer[reducerKey];
		} else if (state[injector]) {
			states[injector] = state[injector];
		}
	});

	return states;
};

const createContainer = (key, actions, initState) => {
	if (!key) {
		throw new Error('container should has a unique key.');
	}

	checkInitState(key, initState);

	let init = true;

	let injectors = [];
	let callback = function() {};

	// 获取初始的state
	const getInitState = (props) => {
		if (_.isFunction(initState)) {
			return initState(props);
		} else {
			return initState;
		}
	};

	const mapStateToProps = (state, props) => {
		let states = {...getInjectorsState(state, injectors)};
		const containerReducer = state['containerReducer'];

		// 注入后的回调
		const extra = callback(states) || {};

		if (containerReducer[getReducerKey(key)]) {
			states = {...containerReducer[getReducerKey(key)], ...extra};

			return states;
		} else {
			return {...getInitState(props), ...extra};
		}
	};

	const mapDispatchToProps = (dispatch, props) => {
		const dispatcher = dispatchWrapper(getReducerKey(key), dispatch);
		let userActions = {};

		if (_.isFunction(actions)) {
			userActions = actions(dispatcher);
		} else {
			userActions = bindActionCreators(actions, dispatcher);
		}

		return {
			actions: userActions,
			containerActions: {
				clearReducer: () => { dispatcher(getInitState(props)); }
			}
		}
	};

	return {
		bind: (component) => {
			let componentWillMount = () => {};
			let componentWillUnmount = () => {};

			if (component.prototype.componentWillMount) {
				componentWillMount = component.prototype.componentWillMount;
			}

			// 在组件初始化时, 初始化reducer
			component.prototype.componentWillMount = function initReducer() {
				if (init) {
					init = false;
					this.props.containerActions.clearReducer();
				}

				componentWillMount.apply(this, arguments);
			}

			if (component.prototype.componentWillUnmount) {
				componentWillUnmount = component.prototype.componentWillUnmount;
			}

			return connect(mapStateToProps, mapDispatchToProps)(component);
		},

		// 注入别的reducer， 根据keys获取
		// keys， 数组
		// cb， 回调函数
		inject(keys, cb) {
			injectors = keys || [];
			if (_.isFunction(cb)) {
				callback = cb;
			}
		}
	};
};

export default createContainer;