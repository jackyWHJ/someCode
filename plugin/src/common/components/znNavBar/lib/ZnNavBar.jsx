import React from 'react';
import createContainer from 'zn-container';
import { NavBar } from 'antd-mobile';

const ZnNavBar = React.createClass({
	goBack() {
		if (this.props.onLeftClick) {
			this.props.onLeftClick();
			return ;
		}

		if (this.props.beforeBack) {
			this.props.beforeBack();
		}

		this.context.router.goBack();
	},

	render() {
		const { onLeftClick, navBar, actions, containerActions, children, ..._props } = this.props;

		return <NavBar onLeftClick={this.goBack} style={{ backgroundColor: Util.storage.getNavBarColor() }} {..._props}>
			{ children }
		</NavBar>	
	}
});

ZnNavBar.contextTypes = {
	router: React.PropTypes.object
};

ZnNavBar.propTypes = {
	beforeBack: React.PropTypes.func
};

// export default createContainer("NavBar", {}, {}).inject(["index.main"], function(state) {
// 	const indexMain = state["index.main"] || {};
// 	return { navBar: indexMain.navBar };
// }).bind(ZnNavBar);
export default ZnNavBar;