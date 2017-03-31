import React from 'react';
import _ from 'lodash';
import { Grid } from 'antd-mobile';

const GridLayout = function( props ) {
	const renderItem = function renderItem(dataItem, index) {
		if (_.isArray(dataItem)) {
			return <Grid columnNum={1} data={dataItem} renderItem={renderItem}></Grid>;
		}
		return <div>{ props.renderItem(dataItem, index) }</div>
	}

	const data = props.data || [];
	const dataItems = props.data.map((item, index) => {
		if (index % 2 == 1) {
			if (item.length < 2) {
				item.push({});
			}
		}

		return item;
	});

	return <Grid columnNum={2} data={dataItems} className={props.className} style={props.style}
		renderItem={renderItem}></Grid>
};

export default GridLayout;