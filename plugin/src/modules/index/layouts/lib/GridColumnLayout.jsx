import React from 'react';
import { Flex } from 'antd-mobile';
import GridLayout from '../../component/GridLayout';

import ZnImage from 'zn-component/znImage';

import "../style/index.scss";

/*
	数据结构
	allowShare:0
	columnId: 栏目id
	commentQuantity:0
	id:内容id
	imgUrl:图片地址
	orderNumber:0
	resourceId:资源id
	resourceLink:""
	resourceType:"0"
	subTitle:副标题
	title:主标题
	viewQuantity:0
*/
/*
	Grid布局
	styleType: 2
*/
const FlexItem = Flex.Item;
const GridColumnLayout = React.createClass({
	render() {
		const clickOnColumn = function clickOnColumn(item) {
			if (this.props.clickOnColumn) {
				this.props.clickOnColumn(item, this.props.data);
			}
		};

		const getTextPosition = () => {
			return this.props.data.titlePosition == 2? 'text-position-center' : "";
		}

		const renderItem = (dataItem, index) => {
			const data = dataItem.data || {};
			if (dataItem.layout == 'vertical') {
				return <div className="grid-vertical layout-content" onClick={clickOnColumn.bind(this, data)}>
						<div className={`column-title grid-column-title index-text-ellipsis zn-font-md ${getTextPosition()}`}>{ data.title }</div>
						<div className={`column-subtitle grid-column-subtitle index-text-ellipsis zn-font-sm ${getTextPosition()}`}>{ data.subTitle }</div>
						<div className="grid-column-image"><ZnImage className="column-image" src={ data.imgUrl }/></div>
					</div>
			} else {
				if (!data.title && !data.imgUrl) {
					return <Flex></Flex>;
				}

				return <Flex className="grid-horizontal layout-content" onClick={clickOnColumn.bind(this, data)}>
						<FlexItem> 
							<div className={`column-title grid-column-title index-text-ellipsis zn-font-md ${getTextPosition()}`}>{ data.title }</div>
							<div className={`column-subtitle grid-column-subtitle index-text-ellipsis zn-font-sm ${getTextPosition()}`}>{ data.subTitle }</div>
						</FlexItem>
						<FlexItem className="grid-column-image"><ZnImage className="column-image" src={ data.imgUrl }/></FlexItem>
					</Flex>
			}
		};

		const data = this.props.data ? this.props.data.columnElementList : [];

		const structorData = [];
		const len = data.length;
		const counts = Math.ceil(len / 3);

		for (let i = 0; i < counts; i++) {
			const elements = [];
			const start = i * 3;
			const end = start + 3;

			for (let k = start; k < end; k++) {
				if (k % 3 == 0 && data[k]) {
					elements.push({ data: data[k], layout: 'vertical' });
				} else if (k % 3 == 1 && data[k]) {
					elements.push([{ data: data[k], layout: 'horizontal' }]);
				} else if (data[k]) {
					elements[elements.length - 1].push({ data: data[k], layout: 'horizontal' });
				}
			}

			structorData.push(<GridLayout className="grid-layout" key={structorData.length + 1} data={ elements } renderItem={ renderItem } />);
		}

		return <div> { structorData } </div>;
	}
});

export default GridColumnLayout;