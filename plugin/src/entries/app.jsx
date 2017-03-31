import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware,compose } from 'redux';
import { Router, hashHistory } from 'react-router';
import thunk from 'redux-thunk';

import rootReducer from './rootReducer';
import resolveRoutes from './rootRoute';

let redux_tool_obj = typeof (window.__REDUX_DEVTOOLS_EXTENSION__) == 'undefined' ? applyMiddleware(thunk) :compose(applyMiddleware(thunk),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const store = createStore(rootReducer, redux_tool_obj);
const routes = resolveRoutes();

const start = function start() {
	render(
		<Provider store={store}>
			<Router routes={routes} history={hashHistory}/>
		</Provider>,
		document.getElementById('zn-app'));
};

export default { start };