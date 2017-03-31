import React from 'react';
import createContainer from './lib/createContainer';

const componentMixin = {
	componentWillUnmount() {
		if (this.clearWhenUmnount && this.clearWhenUmnount()) {
			this.props.containerActions.clearReducer();
		}
	}
};

const registRouterMethods = (component) => {
	component.contextTypes = {router: React.PropTypes.object, ...component.contextTypes};
};

const containerWrapper = (key, actions, initState) => {
	const container = createContainer(key, actions, initState);

	return {
		bind: (component) => {
			let componentWillUnmount = () => {};
			if (component.prototype.componentWillUnmount) {
				componentWillUnmount = component.prototype.componentWillUnmount;
			}
			component.prototype.componentWillUnmount = function() {
				componentWillUnmount.apply(this, arguments);
				componentMixin.componentWillUnmount.apply(this, arguments);
			}

			registRouterMethods( component );

			return container.bind(component);
		},

		inject(key, callback) {
			container.inject(key, callback);
			return { bind: this.bind };
		}
	}
}

export default containerWrapper;