import React from 'react';
import createContainer from 'zn-container';
import * as actions from '../action/detailsAction';
import { NavBar, Toast } from 'antd-mobile';
import { API } from '../dataConfig';
import _ from 'lodash';


import ZnNavBar from 'zn-component/znNavBar';

import DetailsHeader from '../component/DetailsHeader';
import DetailsMain from '../component/DetailsMain';
import "../style/index.scss";


const QuestionnaireDetails = React.createClass({


	getInitialState() {
	    return {
	        submiting: false,
	        hasDown: false,  
	    };
	},


	//组件销毁时候清空redux数据
	clearWhenUmnount(){
		return true;
	},

	componentDidMount(){
		this.props.actions.loadData({
			intgId: this.props.params && this.props.params.intgId
		});
	},

	//radio-checkbox点击切换选项事件
	radioChange(index, item, itemIndex){
		//如果是已提交则直接返回
		if(this.props.data.tested == "1"){
			return;
		}
		//console.log(111);
		if(item.questionType==1 && item.isUserSelected == "Y"){
			//表示已处于选中状态则直接返回
			return;
		}

		//首先找出修改的对应问题
		var questionObj = {...this.props.data.questionArr[index]};
		//再找出对应的选项
		questionObj["sectionArr"].forEach(function(section, sectionIndex){
			if(questionObj.questionType == 1){
				//判断是单选
				if(sectionIndex == itemIndex){
					section.isUserSelected = "Y";
				}else{
					section.isUserSelected = "N";
				}
			}else{
				//判断是复选
				if(sectionIndex == itemIndex){
					section.isUserSelected = (section.isUserSelected!="Y"?"Y":"N");
				}
			}
			
		})
		var len = this.props.data.questionArr.length;
		var questionArr = [...this.props.data.questionArr.slice(0, index), questionObj, ...this.props.data.questionArr.slice(index+1, len)];
		this.props.actions.updateData({...this.props.data, questionArr: questionArr});

	},

	//简答题-问答题更新
	textareaChange(event, index, item, itemIndex){

		//如果是已提交则直接返回
		if(this.props.data.tested == "1"){
			return;
		}
		
		//首先找出修改的对应问题
		var questionObj = {...this.props.data.questionArr[index]};
		//再找出对应的选项
		questionObj["sectionArr"].forEach(function(section, sectionIndex){
			if(sectionIndex == itemIndex){
				section.sectionText = event.target.value;
			}
		});
		var len = this.props.data.questionArr.length;
		var questionArr = [...this.props.data.questionArr.slice(0, index), questionObj, ...this.props.data.questionArr.slice(index+1, len)];
		this.props.actions.updateData({...this.props.data, questionArr: questionArr});
	},


	//提交
	handleSubmit(){

		//如果是已测试过的则提示已测试过了，
		if(this.props.data.tested == 1){
			Toast.fail("亲，您已经提交过一次，不能重复提交哦O(∩_∩)O~", 1);
			return;
		}
		

		//循环遍历所有问题都已完成
		//console.log("handleSubmit");
		let errMessage = "", questionArr=this.props.data.questionArr, questionObj=null, answers = [];
		for(var i=0, len=questionArr.length; i<len; i++){
			questionObj = questionArr[i];
			let error = true;
			if(questionObj.questionType=="1" || questionObj.questionType=="2"){
				questionObj.sectionArr.forEach(function(item, index){
					if(item.isUserSelected == "Y"){
						error = false;
					}
				})
			}else{
				if( _.trim( questionObj.sectionArr[0].sectionText ) != "" ){
					//表示为空了
					error = false;
				}
			}
			if(error){
				errMessage = "您好，您第" + (i+1) + "道问题没有完成";
				//检测到有错误，则跳出循环
				break;
			}
		}
		if(errMessage!=""){
			//表示出错了，弹出错误提示
			Toast.fail(errMessage, 1);
			return;
		}

		function setAnswer(id, type, value) {
		    // 答案是否已存在于答案数组中
		    var exist = false;
		    for (var i = 0; i < answers.length; i++) {
		        if (answers[i]['intgId'] == id) {
		            answers[i]['type'] = type;
		            answers[i]['optionValue'] = value;
		            exist = true;
		            break;
		        }
		    }
		    if (!exist) {
		        // 如果答案未存在于答案数组中，则添加到答案数组
		        answers.push({
		            intgId: id,
		            type: type,
		            optionValue: value
		        });
		    }
		}

		//将答题拼接成字符串传递给后台
		for(var j=0; j<len; j++){

			let questionObj = questionArr[j], id=questionObj.questionId, type=questionObj.questionType, value;
			if(questionObj.questionType=="1"){

				questionObj.sectionArr.forEach(function(item, index){
					if(item.isUserSelected == "Y"){
						value = item.sectionId;
					}
				})

			}else if(questionObj.questionType=="2"){
				let valueArr = [];
				questionObj.sectionArr.forEach(function(item, index){
					if(item.isUserSelected == "Y"){
						valueArr.push(item.sectionId);
					}
				});
				value = valueArr.join("|");
			}else{
				value = questionObj.sectionArr[0].sectionText;
			}
			setAnswer(id, type, value)
		}

		//修改当前为已完成状态
		this.props.actions.submitAction({intgInfo: JSON.stringify({intgArrs: answers}), intgInfoId: this.props.params.intgId}, _.extend({}, this.props.data) );

		//修改上个列表中的list对应数据对象状态
		this.props.actions.updateList(this.props.params.intgId, this.props.list);

	},



	render() {
		return (
			<div className="questionnaire-details">
				<ZnNavBar className="app-bar">{ this.props.data.intgTitle }</ZnNavBar>
				<div style={{paddingTop:"0.9rem", display: this.props.data.intgTitle?"block":"none" }}>
					{!this.props.data.imgUrl||this.props.data.imgUrl==""?null:<DetailsHeader {...this.props} />}
					<DetailsMain {...this.props} radioChange={this.radioChange} textareaChange={this.textareaChange} handleSubmit={this.handleSubmit}/>	
				</div>
			</div>
		)
	}
});

export default createContainer("questionnaire.details", actions, {
	data:{}
}).inject(["questionnaire.list"], function(state) {
	return {
		list: state["questionnaire.list"] ? state["questionnaire.list"].list : []
	};
}).bind(QuestionnaireDetails);