import React from 'react';
import { Flex } from 'antd-mobile';

import "../style/index.scss";

// import ColumnCard from '../../component/ColumnCard';
import ZnImage from 'zn-component/znImage';
import ZnListItem from 'zn-component/znListItem';

const FlexItem = Flex.Item;
const LayoutOne = React.createClass({
	render() {
		const data = this.props.data ? this.props.data.columnElementList : [];
		const elements = [];

		const clickOnColumn = function clickOnColumn(item) {
			if (this.props.clickOnColumn) {
				this.props.clickOnColumn(item, this.props.data);
			}
		};

		const getTitlePosition = () => {
			return this.props.data.titlePosition == 2 ? 'text-position-center': '';
		};

		return (
			<div>
			{
				data.map((item, index) => {
					return <div key={index} onClick={clickOnColumn.bind(this, item)}>
						<ZnListItem
							leftContent={<div><ZnImage src={item.imgUrl} /></div>}
							title={<div className={`zn-font-md ${getTitlePosition()}`}>{ item.title }</div>} 
							subTitle=""
							intro={<div className={getTitlePosition()}>
								<span className="view-img column-view-quantity">{ item.viewQuantity }</span>
							</div>}/>
						</div>

				})
			}
			</div>
		);
	}
});

export default LayoutOne;