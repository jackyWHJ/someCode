import React from 'react';
import {Link} from 'react-router';
import createContainer from 'zn-container';
import ZnNavBar from 'zn-component/znNavBar';
import ZnListItem from 'zn-component/znListItem';
import ZnImage from 'zn-component/znImage';
import ZnListView from 'zn-component/znListView/index';
import * as actions from '../action/courseAction';
import courseObserve from '../../../common/utils/courseObserve';
import '../style/classify.scss'

const CourseAllContainer = React.createClass({

	contextTypes: {
	  router: React.PropTypes.object.isRequired,
	},

	getInitialState() {
        return {};
    },

    componentWillMount(){
    	this.props.actions.requestAttributeArrayList({type: 2, moduleTagId: this.props.params.moduleTagId});

	    this.context.router.setRouteLeaveHook(
	      this.props.route,
	      this.routerWillLeave
	    );
    },

    routerWillLeave(next){
    	 let reg = /(\/courseDetail)/; //如果不是跳转到课程详情页面，则清空list
		 if (!reg.test(next.pathname)){
		      console.log(next.pathname)
		 }
    },

	componentDidMount() {
		this.context.router.setRouteLeaveHook(
	      this.props.route,
	      this.routerWillLeave
	    );
	},

	  //下拉刷新成功回调
	onRefreshSuccess(data, ajaxParams){
		//用用list参数覆盖现在的this.propr.list
		this.props.actions.loadData(data.body.courseArr, ajaxParams);
	},

	//上拉加载更多成功回调
	onEndReachedSuccess(data, ajaxParams){
		//要在现有this.props.list数据上追加list
		let newList = [...this.props.list, ...data.body.courseArr];
		this.props.actions.loadData(newList, ajaxParams);
	},

	onScroll(scrollTop){
		this.props.actions.updateScrollTop(scrollTop);
	},

	routerWillLeave(next){
    	 let reg = /(\/courseDetail)/; //如果不是跳转到课程详情页面，则清空list
		 if (!reg.test(next.pathname)){
		      this.props.containerActions.clearReducer();
		 		//进入的不是详情，清空观察者回调
				courseObserve.remove("classify.courseall");
		 }else{
		 	//进入详情，注入观察者
			courseObserve.add("classify.courseall", this.coureseDetailsUpdate);
		 }
    },

    coureseDetailsUpdate(dispatch, course){
    	let list = this.props.list;
		var newList = list.map(function(item, index){
	        if(item.courseId == course.courseId){
	            item.isCompleted = course.isCompleted=='Y' ? '1' : '0';
	        }
	        return item;
	    });
	    return {
	        type: this.type,
	        list: newList,
	    }
    },


	render() {
		const row = (rowData, sectionID, rowID) => {
			let courseImg = rowData.courseImg || '';
			//替换图片地址，开发用，上生产时去掉
			courseImg = courseImg.replace('http://test-mlearning.pingan.com.cn:45080/','http://hrmsv3-mlearning-dmzstg1.pingan.com.cn/'); 
			var rowDataProps = {
				leftContent: <div><ZnImage src={courseImg} />{rowData.isCompleted=="1"?<i className="studied-icon"></i>:null}</div>,
				title: rowData.courseName,
				intro: <div className="comment-bottom cs-course-bottom">
		          <span className="course-score"><i></i>{rowData.rating}</span>
		          <span className="course-comment"><i></i>{rowData.totalComments}</span>
		        </div>
			}
			return <Link to={`/classify/courseDetail/${rowData.courseId}`} ><ZnListItem {...rowDataProps} /></Link>
		};

		let znListViewProps = {
			url: '/learn/app/clientapi/course/courselist.do',
			row: row,
			list: this.props.list,
			ajaxParams: this.props.ajaxParams,
			onRefreshSuccess: this.onRefreshSuccess,
			onEndReachedSuccess: this.onEndReachedSuccess,
			noResultTipContent: "您暂时还没有课程哦",
			offsetTop: 45,
			initialListSize: this.props.list.length,
			onScroll: this.onScroll,
			...this.props,
		};

		return (
			<div className="zn-course-all">
				<ZnNavBar className="app-bar" ><span>课程</span></ZnNavBar>
				<ZnListView ref="znListView"  {...znListViewProps} />
			</div>
		)
	}
});

export default createContainer("classify.courseall", actions, {
	list: [],
	ajaxParams: {},
	scrollTop: 0,
}).bind(CourseAllContainer);
