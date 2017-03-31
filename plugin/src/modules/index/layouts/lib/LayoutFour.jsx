import React from 'react';

import ColumnLayout from '../../component/ColumnLayout';
import ZnImage from 'zn-component/znImage';

import "../style/index.scss";

const LayoutFour = React.createClass({
	clickOnColumn(item) {
		if (this.props.clickOnColumn) {
			this.props.clickOnColumn(item, this.props.data);
		}
	},

	render() {
		const data = this.props.data || {};
		const columnElementList = data.columnElementList || [];
		const elements = [];

		columnElementList.map((element, index) => {
			const content = <div key={index} className="column-four">
					<ZnImage className="column-img" src={element.imgUrl}/>
					<div className={`column-title index-text-ellipsis zn-font-md ${data.titlePosition == 2 ? 'text-position-center' : ''}`}>
						{ element.title }
					</div>
				</div>;

			elements.push({ content });
		});

		return <ColumnLayout columns={3} data={elements}></ColumnLayout>
	}
});

export default LayoutFour;