import React from 'react';
import createContainer from 'zn-container';

import "../style/index.scss";

import ZnNavBar from 'zn-component/znNavBar';

import ZnListItem from 'zn-component/znListItem';

import ZnImage from 'zn-component/znImage';

import ZnListView from 'zn-component/znListView/index';

import { API } from '../dataConfig';

import $ from 'n-zepto';

import { Link } from 'react-router';

import courseObserve from '../../../common/utils/courseObserve';


import * as actions from '../action';

import { Tabs, NavBar } from 'antd-mobile';

const TabPane = Tabs.TabPane;

const RequiredElective = React.createClass({


	componentWillMount(){
		this.context.router.setRouteLeaveHook(
			this.props.route,
			this.routerWillLeave
		);
	},

	routerWillLeave(next){
		let reg = /(\/courseDetail)/; //如果不是跳转到课程详情页面，则清空list
		if (!reg.test(next.pathname)){
			//进入的不是详情，则清空redux
			this.props.containerActions.clearReducer();
			//进入的不是详情，清空观察者回调
			courseObserve.remove("requiredElective.list");
			
		}else{
			//进入详情，注入观察者
			courseObserve.add("requiredElective.list", this.coureseDetailsUpdate);
		}
	},

	coureseDetailsUpdate(dispatch, course){

		let listRequired = this.props.listRequired.map(function(item, index){
			if(item.courseId === course.courseId){
				//已学未学
				item.isCompleted = (course.isCompleted=="Y"?"1":"0");
				//平均分
				item.rating = course.averageScore.replace(/\.0$/,"");
				//评论数
				item.totalComments = course.totalComments;
			}
			return item;
		});

		let listElective = this.props.listElective.map(function(item, index){
			if(item.courseId === course.courseId){
				//已学未学
				item.isCompleted = (course.isCompleted=="Y"?"1":"0");
				//平均分
				item.rating = course.averageScore.replace(/\.0$/,"");
				//评论数
				item.totalComments = course.totalComments;
			}
			return item;
		});

		dispatch({
			type:"requiredElective.list",
			listRequired,
			listElective,
		})
	},

	changeTab(key){
		this.props.actions.changeTab(key);
	},


	//下拉刷新成功回调
	onRefreshSuccess(data, ajaxParams){
		//用用list参数覆盖现在的this.propr.list
		this.props.actions[this.props.activeKey=="1"?"loadDataRequired":"loadDataElective"](data.body.courseArr, 
			{...ajaxParams, 
				lv: data.body.rv, //时间戳
			}
		);
	},

	//上拉加载更多成功回调
	onEndReachedSuccess(data, ajaxParams){
		//要在现有this.props.list数据上追加list
		let newList;
		if(this.props.activeKey=="1"){
			newList = [...this.props.listRequired, ...data.body.courseArr];
		}else{
			newList = [...this.props.listElective, ...data.body.courseArr];
		}
		this.props.actions[this.props.activeKey=="1"?"loadDataRequired":"loadDataElective"](newList, 
			{...ajaxParams, 
				lv: data.body.rv, //时间戳
			}
		);
	},

	onScroll(scrollTop){
	  //console.log(scrollTop);
	  //更新scrollTop值
	  this.props.actions[this.props.activeKey=="1"?"updateScrollTopRequired":"updateScrollTopElective"](scrollTop);
	},

	componentDidMount() {
		//this.props.actions.loadIndexData();
	},

	render() {


		const row = (rowData, sectionID, rowID) => {
			var rowDataProps = {
				leftContent: <div><ZnImage src={rowData.courseImg} />{rowData.isCompleted=="1"?<i className="studied-icon"></i>:null}</div>,
				title: rowData.courseName,
				intro: <div className="comment-bottom">
		          <span className="course-score"><i></i>{rowData.rating}</span>
		          {/*<span className="course-heart"><i></i>{rowData.totalLike}</span>*/}
		          <span className="course-comment"><i></i>{rowData.totalComments}</span>
		        </div>
			}
			return <Link to={"classify/courseDetail/" + rowData.courseId }><ZnListItem {...rowDataProps} introAlign={"right"} /></Link>
		};

		var requiredListProps = {
			url: API.requiredList,
			row: row,
			list: this.props.listRequired,
			ajaxParams: this.props.ajaxParamsRequired,
			onRefreshSuccess: this.onRefreshSuccess,
			onEndReachedSuccess: this.onEndReachedSuccess,
			noResultTipContent: "您暂时还没有必修课程哦",
			initialListSize: this.props.listRequired.length!=0?this.props.listRequired.length:undefined,
			offsetTop: 45 + 44,
			...this.props,
			scrollTop: this.props.scrollTopRequired,
			onScroll: this.onScroll,
		}


		var electiveListProps = {
			url: API.requiredList,
			row: row,
			list: this.props.listElective,
			ajaxParams: this.props.ajaxParamsElective,
			onRefreshSuccess: this.onRefreshSuccess,
			onEndReachedSuccess: this.onEndReachedSuccess,
			noResultTipContent: "您暂时还没有选修课程哦",
			initialListSize: this.props.listElective.length!=0?this.props.listElective.length:undefined,
			offsetTop: 45 + 44,
			...this.props,
			scrollTop: this.props.scrollTopElective,
			onScroll: this.onScroll,
		}

		return (
			<div>

				<ZnNavBar className="app-bar">课程</ZnNavBar>

				<Tabs defaultActiveKey={this.props.activeKey} swipeable={false} onChange={this.changeTab} style={{paddingTop: "0.9rem"}}>
					<TabPane tab="必修" key="1">
						<ZnListView  {...requiredListProps} />
					</TabPane>
					<TabPane tab="选修" key="2">
						<ZnListView  {...electiveListProps} />
					</TabPane>
				</Tabs>

			</div>
		)
	}
});

export default createContainer("requiredElective.list", actions, {
	activeKey: "1",
	listRequired:[],
	ajaxParamsRequired:{
		sortType:1,
		required:1,
		lv: null,
	},
	scrollTopRequired: 0,

	listElective:[],
	ajaxParamsElective:{
		sortType:1,
		required:0,
		lv: null,
	},
	scrollTopElective: 0,
}).bind(RequiredElective);