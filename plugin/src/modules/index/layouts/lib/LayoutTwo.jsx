import React from 'react';

import ZnImage from 'zn-component/znImage';
import ColumnLayout from '../../component/ColumnLayout';

import "../style/index.scss";

const LayoutTwo = React.createClass({
	clickOnColumn(item) {
		if (this.props.clickOnColumn) {
			this.props.clickOnColumn(item, this.props.data);
		}
	},

	getTitlePosition() {
		return this.props.data.titlePosition == 2 ? 'text-position-center': '';
	},

	render() {
		const data = this.props.data || {};
		const columnElementList = data.columnElementList || [];
		const elements = [];

		columnElementList.map((element, index) => {
			const content = <div key={index} className="column-two" onClick={this.clickOnColumn.bind(this, element)}>
					<ZnImage className="column-img" src={element.imgUrl} />
					<div className={`column-title index-text-ellipsis zn-font-md ${this.getTitlePosition()}`}>{ element.title }</div>
				</div>

			elements.push({ content });
		});

		return <ColumnLayout columns={4} data={elements}></ColumnLayout>
	}
});

export default LayoutTwo;