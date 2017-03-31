import React from 'react';
import Question from './Question';

import { Button } from 'antd-mobile';

import $ from 'n-zepto';

const DetailsForm = React.createClass({


	componentWillReceiveProps(nextProps) {
	    
		if(this.props.data.introduction != nextProps.data.introduction){
			//如果副标题有变化则进行检测是否需要“显示全部”
			this.setIntroTip();
		}

	},


	getInitialState() {
	    return {
	        showAllTip: false, //默认不出现"显示全部"提示  
	    };
	},

	componentDidMount(){
		
		//判断副标题高度是否大于四行则显示“显示全部”按钮
		this.setIntroTip();

	},


	setIntroTip(){
		//设置是否出现“显示全部”的提示
		setTimeout(()=>{
			var height = $(this.refs.introduction).height();
			var maxHeight = Util.getDeviceDPR() * 18 * 4 + 5;
			if(height > maxHeight){
				this.setState({
					showAllTip: true,
				})
			}else{
				this.setState({
					showAllTip: false,
				});
			}
		}, 0);
	},


	showAll(){
		this.setState({
			showAllTip: false,
		});
	},


	getInitialState() {
	    return {
	        questionArr: this.props.data.questionArr || [],  
	    };
	},

	render() {


		let _this = this;

		let questionArr = this.props.data.questionArr && this.props.data.questionArr.map(function(question, index){
			//return <div key={index}>222</div>
			return <Question {..._this.props}  {...question}  index={index} key={index} />
		})
		
		return (
			
			<div className="questionnaire-details-main">
				<div className={"questionnaire-details-title " + (this.state.showAllTip?"show-all-tip":"")  }>
					<h2>{this.props.data.intgTitle}</h2>
					<h3 ref="introduction">{this.props.data.introduction}</h3>
					<h4><a href="javascript:;" onClick={this.showAll}>显示全部</a></h4>
				</div>
				<div className="questionnaire-details-list">{questionArr}</div>
				{this.props.data.intgTitle&&<div className="questionnaire-details-footer"><Button onClick={this.props.handleSubmit} className={this.props.data.tested==1?"tested":""}>提交</Button></div>}
			</div>	
		)
	}
});

export default DetailsForm