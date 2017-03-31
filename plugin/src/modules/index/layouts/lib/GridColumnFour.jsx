import React from 'react';
import { Grid } from 'antd-mobile';

import ZnImage from 'zn-component/znImage';

const GridColumnFour = ( props ) => {
	const getTitlePosition = (titlePosition) => {
		return titlePosition == 2 ? 'text-position-center': '';
	};

	const renderItem = (rowData, index) => {
		return <div className="grid-column-item" key={index}>
				<div className="grid-image">
					<ZnImage className="column-img" src={rowData.imgUrl} />
				</div>
				<div className={`column-title index-text-ellipsis zn-font-md ${getTitlePosition(rowData.titlePosition)}`}>{ rowData.title }</div>
				<h4 className={getTitlePosition(rowData.titlePosition)}><span className="view-img column-view-quantity">{ rowData.viewQuantity }</span></h4>
			</div>
	};

	const clickOnColumn = (data, index) => {
		if (props.clickOnColumn) {
			props.clickOnColumn(data);
		}
	};

	const data = props.data.columnElementList || [];
	return (
		<div className="grid-four">
			<Grid data={data} onClick={clickOnColumn} renderItem={renderItem}></Grid>
		</div>
	)
};

GridColumnFour.propTypes = {
	data: React.PropTypes.object
};

GridColumnFour.defaultProps = {
	data: {}
};

export default GridColumnFour;