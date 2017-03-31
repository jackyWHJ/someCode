import React from 'react';
import "./style/index.scss";


let ZnListItem = React.createClass({

	getDefaultProps() {
		return {
			className: "",//默认样式
			backgroundColor: "#fff",//背景颜色默认白色
			borderBottom: "",//默认底部边框
			leftContent: "",//默认左边内容，支持string  element
			title: "",//默认主标题，支持string  element
			subTitle: "",//默认副标题，支持string  element
			intro:"",//默认右边最底部内容，支持string  element
			titleAlign:"left",//默认主标题对齐方式
			subTitleAlign:"left",//默认主标题对齐方式
			introAlign:"left",//默认主标题对齐方式
		};
	},

	render(){
		return (
			<div className={"zn-list-item clearfix " + this.props.className} style={{backgroundColor: this.props.backgroundColor, borderBottom: this.props.borderBottom}}>
				<div className="zn-list-item-left">
					{this.props.leftContent}
				</div>
				<div className="zn-list-item-right">
					<h2 className={"h2-" + this.props.titleAlign} style={{textAlign: this.props.titleAlign}}>{this.props.title}</h2>
					<h3 className={"h3-" + this.props.subTitleAlign} style={{textAlign: this.props.subTitleAlign}}>{this.props.subTitle}</h3>
					<h4 className={"h4-" + this.props.introAlign} style={{textAlign: this.props.introAlign}}>{this.props.intro}</h4>
				</div>
			</div>
		)
	},
})



export default ZnListItem;






