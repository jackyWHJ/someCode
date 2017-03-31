import React from 'react';
import createContainer from 'zn-container';
import IndexApp from '../component/IndexApp';

import * as actions from '../action';

const StandardIndex = React.createClass({

	componentDidMount() {
		if (this.needInitial()) {
			this.props.actions.loadIndexData();
		}
	},

	needInitial() {
		return this.props.banner.length == 0 &&
			this.props.choice.length == 0 &&
			this.props.columns.length == 0 &&
			this.props.links.length == 0;
	},

	reload(extraParams = {}, refreshing = false) {
		this.props.actions.loadIndexData(extraParams, refreshing); 
	},

	render() {
		const { navBar, banner, columns, choice, links, ..._props } = this.props;    

		return (
			<IndexApp navBar={navBar}
				banners={banner}
				choices={choice}
				columns={columns}
				links={links}
				reload={this.reload}
				{..._props}/>
		)
	}
});

export default createContainer("index.main", actions, {
	navBar: {},
	banner: [],
	choice: [],
	columns: [],
	links: [],
	extra: {},
	isRefreshing: false
}).bind(StandardIndex);