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

const ClassifyListContainer = React.createClass({

	contextTypes: {
	  router: React.PropTypes.object.isRequired,
	},

	toMainface: function() {
      // this.context.router.push(`/classify/mainface`);
      this.context.router.goBack();
    },

	getInitialState() {
        return {
        	moduleName: '',
        	moduleTagArr: [],
        	moduleTagName: '',
        	showPopup: false,
        	showAttr: false,
        	sortType: 1,
        	ArrTypeId1: '',
        	ArrTypeId1Name: '默认',
        };
    },

    componentWillMount(){
    	if(!(this.props.attrs && this.props.attrs.length>0))
    		this.props.actions.requestAttributeArrayList({type: this.props.params.type || 2, moduleTagId: this.props.params.moduleTagId});

	    this.context.router.setRouteLeaveHook(
	      this.props.route,
	      this.routerWillLeave
	    );
    },

    routerWillLeave(next){
    	 let reg = /(\/courseDetail)/; //如果不是跳转到课程详情页面，则清空list
		 if (!reg.test(next.pathname)){
		      this.props.containerActions.clearReducer();
		      //进入的不是详情，清空观察者回调
				courseObserve.remove("classify.courselist");
		 }else{
		 	//进入详情，注入观察者
			courseObserve.add("classify.courselist", this.coureseDetailsUpdate);
		 }
    },

    coureseDetailsUpdate(dispatch, course){
    	let list = this.props.list;
		var newList = list.map(function(item, index){
	        if(item.courseId == course.courseId){
	            item.isCompleted = course.isCompleted=='Y' ? '1' : '0';
	            //平均分
				item.rating = course.averageScore.replace(/\.0$/,"");
				//评论数
				item.totalComments = course.totalComments;
	        }
	        return item;
	    });
	    return {
	        type: this.type,
	        list: newList,
	    }
    },

	componentDidMount() {
		let moduleTagId = this.props.params.moduleTagId || '';
		let moduleId = this.props.params.moduleId || '';
		// this.setState({moduleId: moduleId, moduleTagId: moduleTagId});

		let moduleArr = this.props.body.moduleArr || [];
		for(let i=0;i<moduleArr.length;i++){
			let obj = moduleArr[i];
			this.setState({moduleName: obj.moduleName});
			if(obj && obj.moduleId && obj.moduleId==moduleId){
				let moduleTagArr = obj.moduleTagArr || [];
				this.setState({moduleTagArr: moduleTagArr});
				for(let j=0;j<moduleTagArr.length;j++){
					let tag = moduleTagArr[j];
					if(tag && tag.moduleTagId && tag.moduleTagId==moduleTagId){
						if(moduleTagId==moduleId){
							this.setState({moduleTagName: obj.moduleName});
						}else{
							this.setState({moduleTagName: tag.moduleTagName});
						}
						
						break;
					}
				}
				break;
			}
		}

		this.updateAjaxParams();
	},
	// 更新列表接口参数
	updateAjaxParams(restart, params){
		let newAjaxParams = {...this.props.ajaxParams, moduleTagId: this.props.params.moduleTagId, sortType: this.state.sortType, ArrTypeId1: this.state.ArrTypeId1};
		if(params)
			newAjaxParams = {...newAjaxParams, ...params};

		this.props.actions.updateAjaxParams(newAjaxParams);

		if(restart)
			this.refs.znListView && this.refs.znListView.restart();
	},

	//下拉刷新成功回调
	onRefreshSuccess(data, ajaxParams){
		 var totalPage = Math.ceil(data.body.courseNum/ajaxParams.numPerPage);
		//用用list参数覆盖现在的this.propr.list
		this.props.actions.loadData(data.body.courseArr, 
			{...ajaxParams, 
				moduleTagId: this.props.params.moduleTagId,
				showedAllPages: totalPage <=1, 
				showNoResultTip: totalPage==0, 
				showListView: totalPage!=0
			}
		);
	},

	//上拉加载更多成功回调
	onEndReachedSuccess(data, ajaxParams){
		var totalPage = Math.ceil(data.body.courseNum/ajaxParams.numPerPage);
		//要在现有this.props.list数据上追加list
		let newList = [...this.props.list, ...data.body.courseArr];
		this.props.actions.loadData(newList, 
			{...ajaxParams, 
				showedAllPages: totalPage==ajaxParams.curPage, 
			}
		);
	},

	onScroll(scrollTop){
		this.props.actions.updateScrollTop(scrollTop);
	},


	showPopup(e){
		e.stopPropagation();
		this.setState({showPopup: !this.state.showPopup});
	},

	hidePopup(e){
		e.stopPropagation();
		this.setState({showPopup: false});
	},

	clickSpan(e, moduleTagId){
		// e.stopPropagation();
		if(moduleTagId==this.props.params.moduleId){
			this.setState({moduleTagName: this.state.moduleName});
		}else{
			let moduleTagArr = this.state.moduleTagArr;
			for(let j=0;j<moduleTagArr.length;j++){
				let tag = moduleTagArr[j];
				if(tag && tag.moduleTagId && tag.moduleTagId==moduleTagId){
					this.setState({moduleTagName: tag.moduleTagName});
					break;
				}
			}
		}
		this.setState({moduleTagId: moduleTagId, sortType: 1, ArrTypeId1: '', ArrTypeId1Name: '默认'});
		this.updateAjaxParams(true, {moduleTagId: moduleTagId, sortType: 1, ArrTypeId1: ''});
		// this.hidePopup(e);
	},

	createLi(obj, i){
		return <li key={`keyMdTg${i}`} onClick={(e)=>{this.clickSpan(e, obj.moduleTagId);}} ><span className={`${obj.moduleTagId==this.props.params.moduleTagId ? 'selected' : ''}`}>{obj.moduleTagName}</span></li>;
	},

	changeSortType(type){
		this.setState({sortType: type});
		this.updateAjaxParams(true, {sortType: type});
	},

	showAttr(){
		this.setState({showAttr: !this.state.showAttr});
	},

	createAttrContent(attrs){
		let _this = this;
		return attrs.map(function(obj, i){
			return <div className="cs-showAttr-content" key={`keyDiv${i}`}>
						<span>{obj.typeName}</span>
						<ul>{obj.ArrType.map(_this.createLiOfAttr)}</ul>
					</div>;
		});
	},

	clickLiOfAttr(id,name){
		this.setState({ArrTypeId1: id, ArrTypeId1Name: name || '默认'});
		this.updateAjaxParams(true, {ArrTypeId1: id});
	},

	createLiOfAttr(obj, i){

		return <li key={`keySp${i}`} className={`${obj.isDefault==1 ? 'selected' : ''}`} onClick={()=>{this.clickLiOfAttr(`${obj.id}`, `${obj.name}`);}} >{obj.name}</li>;
	},

	render() {
		const row = (rowData, sectionID, rowID) => {
			let courseImg = rowData.courseImg || '';
			//替换图片地址，开发用，上生产时去掉
			// courseImg = courseImg.replace('http://test-mlearning.pingan.com.cn:45080/','http://hrmsv3-mlearning-dmzstg1.pingan.com.cn/'); 
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
			url: '/learn/app/clientapi/course/moduleTagCourseFilterList.do',
			row: row,
			list: this.props.list,
			ajaxParams: this.props.ajaxParams,
			onRefreshSuccess: this.onRefreshSuccess,
			onEndReachedSuccess: this.onEndReachedSuccess,
			noResultTipContent: "您暂时还没有课程哦",
			offsetTop: 45 + 35,
			initialListSize: this.props.list.length,
			onScroll: this.onScroll,
			...this.props,
		};

		return (
			<div className="zn-classify-course-list">
				<ZnNavBar className="app-bar" onLeftClick={this.toMainface} > <span onClick={this.showPopup} >{this.state.moduleTagName}</span> </ZnNavBar>
				<ul className="cs-filter">
					<li><span>筛选</span><span className="selected" onClick={this.showAttr}>{this.state.ArrTypeId1Name}</span></li>
					<li></li>
					<li><span className={`${this.state.sortType==1 ? 'selected' : ''}`} onClick={()=>{this.changeSortType(1);}} >按最新</span><span className={`${this.state.sortType==2 ? 'selected' : ''}`} onClick={()=>{this.changeSortType(2);}} >按最热</span></li>
				</ul>
				<ZnListView ref="znListView"  {...znListViewProps} />
				<div className={`cd-popup-mask ${this.state.showPopup ? 'cs-popup-show' : ''}`} onClick={this.showPopup} >
					<ul className="cs-popup-content">
						{this.state.moduleTagArr.map(this.createLi)}
					</ul>
				</div>

				<div className={`cd-popup-mask cd-attr-mask ${this.state.showAttr ? 'cs-popup-show' : ''}`} onClick={this.showAttr} >
					{this.props.attrs && this.props.attrs.length>0 ? this.createAttrContent(this.props.attrs) : ''}
				</div>
			</div>
		)
	}
});

export default createContainer("classify.courselist", actions, {
	attrs: [],
	list: [],
	ajaxParams: {
		sortType:1,
		moduleTagId: '',
		ArrTypeId1: '',
		ArrTypeId2: '',
		ArrTypeId3: '',
		ArrTypeId4: '',
	},
	scrollTop: 0,
}).inject(["classify.mainface"], function(state) {
	return {
		body: state["classify.mainface"] ? state["classify.mainface"].body : {}
	}
}).bind(ClassifyListContainer);
