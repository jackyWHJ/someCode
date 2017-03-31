import React from 'react';
import { Flex } from 'antd-mobile';

import ColumnLayout from '../../component/ColumnLayout';
import ZnImage from 'zn-component/znImage';

const FlexItem = Flex.Item;
const LayoutThree = React.createClass({
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
		const columnElementsList = data.columnElementList || [];
		const elements = [];

		columnElementsList.map((element, index) => {
			const content = <Flex key={index} className="column-three" onClick={this.clickOnColumn.bind(this, element)}>
					<FlexItem className="layout-flex-2">
						<div className={`index-text-ellipsis line-title zn-font-md ${this.getTitlePosition()}`}>{ element.title }</div>
					</FlexItem>
					<FlexItem>
						<ZnImage className="column-img" src={element.imgUrl} />
					</FlexItem>
				</Flex>;

			elements.push({ content });
		});

		return <ColumnLayout columns={2} data={elements}></ColumnLayout>
	}
});

export default LayoutThree;