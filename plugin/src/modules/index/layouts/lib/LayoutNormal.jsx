import React from 'react';

import ZnImage from 'zn-component/znImage';

import ColumnCard from '../../component/ColumnCard';
import ColumnLayout from '../../component/ColumnLayout';

import "../style/index.scss";

const LayoutNormal = React.createClass({
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

		if (data.lineQuantity > 1 ) { 
			columnElementList.map((element, index) => {
				const image = <ZnImage className="column-img" src={element.imgUrl} />;
				const title = <div className={`column-title index-text-ellipsis zn-font-md ${this.getTitlePosition()}`}>{ element.title }</div>
				const footer = <h4 className={this.getTitlePosition()}><span className={`view-img column-view-quantity`}>{ element.viewQuantity }</span></h4>

				elements.push({ content: <ColumnCard onClick={this.clickOnColumn.bind(this, element)} contents={[image, title, footer]}/> });
			});
		} else {
			columnElementList.map((element, index) => {
				const content = <div key={index} className="columns-1" onClick={this.clickOnColumn.bind(this, element)}>
						<ZnImage className="column-img" src={ element.imgUrl } />
						<div className="column-1-footer">
							<div className={`column-footer-left zn-font-md ${this.getTitlePosition()}`}>{ element.title }</div>
							<h4 className={`column-footer-right ${this.getTitlePosition()}`}>
								<span className="view-img column-view-quantity">
									{ element.viewQuantity }
								</span>
							</h4>
						</div>
					</div>;

				elements.push({ content });
			});
		}

		return <ColumnLayout columns={ data.lineQuantity } data={elements}></ColumnLayout>;
	}
});

export default LayoutNormal;