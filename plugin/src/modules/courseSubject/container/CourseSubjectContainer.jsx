import React from 'react';
import createContainer from 'zn-container';
import * as actions from '../action/index';
import ZnNavBar from 'zn-component/znNavBar';
import ZnListView from 'zn-component/znListView/index';
import  ZnFullSubjectCell from "zn-component/znFullSubjectCell";
// import data from '../data.js';
import courseObserve from 'zn-common/utils/courseObserve';

const CourseSubjectContainer = React.createClass({

    componentWillMount(){
        this.context.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        );
    },

  routerWillLeave(next){
     let reg = /\/courseSubject\/subjectDetai/; //如果不是跳转到课程专题的详情页面，则清空list
     if ( !reg.test(next.pathname) ){
          this.props.containerActions.clearReducer();
         //进入的不是详情，清空观察者回调
         courseObserve.remove("courseSubject.main");
     }
      /*else{   //本来是进行修改浏览数，可是接口那边本来就是不立刻修改浏览数，所以这里不修改
         //进入详情，注入观察者
         courseObserve.add("courseSubject.main", this.coureseDetailsUpdate);
     }*/
  },

    coureseDetailsUpdate(dispatch, course){
        let list = this.props.list;

        list.forEach((item,index)=>{
            if(item.courseId==course.courseId){
                //list[index].totalBrowse = course.bowseNumber;
                //list[index].score = course.averageScore.replace(/\.0$/,"");
            }
        })

        dispatch({
            type:"courseSubject.main",
            list: list//在this.props.list基础上，对回调回来的course进行对应课程处理
        })
    },

    componentDidMount()
    {
        let homeId = Util.storage.getHomeId();
        this.props.actions.updataParams({...this.props.ajaxParams,pageId:homeId})
    },

  //下拉刷新成功回调
  onRefreshSuccess(data, ajaxParams){
    //用用list参数覆盖现在的this.propr.list
    this.props.actions.loadData(data.body.studyMotArr, ajaxParams);
  },

  //上拉加载更多成功回调
  onEndReachedSuccess(data, ajaxParams){
    //要在现有this.props.list数据上追加list
    let newList = [...this.props.list, ...data.body.studyMotArr];
    this.props.actions.loadData(newList, ajaxParams);
  },

   onScroll(scrollTop){
    //更新scrollTop值
    this.props.actions.updateScrollTop(scrollTop);
  },

    onClick(id){
        let path = "/courseSubject/subjectDetail/"+id;
        this.context.router.push({pathname: path});
    },

    render() {
        const row = (rowData, sectionID, rowID) => {
            let imgSrc = rowData.smaImgUrl;
            return(
                <a href="javascript:;" onClick={()=>this.onClick(rowData.studyMotId)}>
                    <ZnFullSubjectCell key={'subjectcell'+rowID} imgSrc={imgSrc} title={rowData.studyMotIdName}
                    viewNum={rowData.totalBrowse}/>
                </a>
            );
        };

        let znListViewProps = {
            url: actions.API.courseSubjectIndex,
            row: row,
            list: this.props.list,
            ajaxParams: this.props.ajaxParams,
            onRefreshSuccess: this.onRefreshSuccess,
            onEndReachedSuccess: this.onEndReachedSuccess,
            noResultTipContent: "您暂时还没有课程专题哦",
            offsetTop: 45,   //列表跟顶部的距离【navbar高度】
            initialListSize: this.props.list.length != 0 ? this.props.list.length : undefined,
            onScroll: this.onScroll,
            ...this.props,
        };

        return(
            <div>
                <ZnNavBar className="app-bar">课程专题</ZnNavBar>
                <div style={{ paddingTop: "0.9rem" }}>
                    <ZnListView  {...znListViewProps} />
                </div>

            </div>
        );
    }
});

CourseSubjectContainer.contextTypes={
    router:React.PropTypes.object.isRequired,
}

//pageId:'SY0000642',
export default createContainer("courseSubject.main", actions, {
	list:[],
    ajaxParams:{
        pageId:'',
        isZip:0,
        umId:''
    },
    scrollTop:0
}).bind(CourseSubjectContainer);