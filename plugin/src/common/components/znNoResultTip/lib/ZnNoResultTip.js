import React from 'react';
import '../style.scss';
import $ from 'n-zepto';

const ZnNoResultTip = React.createClass({
	


	getDefaultProps() {
		return {
			className: "",//默认样式
			backgroundColor: "#fff",//背景颜色默认白色
			content:"暂无数据哦",//默认显示内容
		};
	},

	setHeight(){
		//
		var $container = $(this.refs.container);
		var $window = $(window);
		var offset = $container.offset();
		if(offset.top + $container.height() < $window.height()){
			//设置container高度
			$container.css({
				height: $window.height() - $container.offset().top,
			})
		}else{
			$container.css({
				height: "auto"
			})
		}
		
		
	},

	componentDidMount(){
		//绑定时间
		this.setHeight();
		$(window).bind("resize", this.setHeight);
		$(window).bind("orientationchange", this.setHeight);
	},

	componentWillUnmount(){
		$(window).unbind("resize", this.setHeight);
		$(window).unbind("orientationchange", this.setHeight);
	},

	render() {
		return (
			<div ref="container" className={"zn-no-result-tip " + this.props.className} style={{
				backgroundColor: this.props.backgroundColor,
			}}>
				<div className="zn-no-result-main">
					<h2></h2>
					<h3>{this.props.content}</h3>
				</div>
			</div>
		)
	}
});




export default ZnNoResultTip;