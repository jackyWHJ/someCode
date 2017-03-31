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

const StudyDetail = React.createClass({


    componentWillMount(){

        let isObligatory;
        if(this.props.params.isObligatory==14){
            isObligatory="Y"
        }else if(this.props.params.isObligatory==29){
            isObligatory="N"
        }else{
            console.log("无法判断必修选修");
        }
        let has = {...this.props.ajaxParamsHas,isObligatory}
        let not = {...this.props.ajaxParamsNot,isObligatory}
        this.props.actions.saveAjaxParamsHasLearn(has);
        this.props.actions.saveAjaxParamsNotLearn(not);

        this.context.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        );
    },

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
    },

    componentDidUpdate(nextProps, nextState) {
        // console.log(nextState);
    },

    routerWillLeave(next){
        let reg = /(\/courseDetail)/; //如果不是跳转到课程详情页面，则清空list
        if (!reg.test(next.pathname)){
            //进入的不是详情，则清空redux
            this.props.containerActions.clearReducer();
            //进入的不是详情，清空观察者回调
            courseObserve.remove("studyDetail.list");

        }else{
            //进入详情，注入观察者
            courseObserve.add("studyDetail.list", this.coureseDetailsUpdate);
        }
    },

    getPosition(course){    //得到在未学数组的位置,如果-1则不属于未学数组
        let index = -1;
        let list = this.props.listNot;
        for(let i=0;i<list.length;++i){
            if(list[i].courseId==course.courseId){
                index = i;
            }
        }
        return index;
    },

    coureseDetailsUpdate(dispatch, course){
        let listHas = this.props.listHas,listNot = this.props.listNot;
        let ajaxParamsHas = this.props.ajaxParamsHas;
        let ajaxParamsNot = this.props.ajaxParamsNot;
        if(course.isCompleted=="Y"){    //按照已学和未学来区分
            let index = this.getPosition(course);
            if(index!=-1){  //原本位于未学中
                //将它插入到已学数组头部,并修改评论数和平均分
                let newCourse;
                for(var item of listNot){
                    if(item.courseId==course.courseId){
                        newCourse = item;
                        break;
                    }
                }
                newCourse.isCompleted = "1";
                //平均分
                newCourse.totalComments = course.totalComments;
                //评论数
                newCourse.rating = course.averageScore;
                listHas.unshift(newCourse);
                if(listHas.length==1){

                    ajaxParamsHas = {...this.props.ajaxParamsHas, showNoResultTip: false, showListView: true}
                    //this.props.ajaxParamsHas.showNoResultTip = false;
                    //this.props.ajaxParamsHas.showListView = true;
                }

                listNot.splice(index,1);
                if(listNot.length==0){
                    ajaxParamsNot = {...this.props.ajaxParamsNot, showNoResultTip: true, showListView: false};
                    //this.props.ajaxParamsHas.showNoResultTip = true;
                    //this.props.ajaxParamsHas.showListView = false;
                }
            }else{  //已经位于已学中
                listHas = this.props.listHas.map(function(item, index){
                    if(item.courseId === course.courseId){
                        //平均分
                        item.totalComments = course.totalComments;
                        //评论数
                        item.rating = course.averageScore;
                    }
                    return item;
                });
            }
        }else{  //该课程是未完成的情况
            listNot = this.props.listNot.map(function(item, index){
                if(item.courseId === course.courseId){
                    //平均分
                    item.totalComments = course.totalComments;
                    //评论数
                    item.rating = course.averageScore;
                }
                return item;
            });
        }


        dispatch({
            type:"studyDetail.list",
            listHas,
            listNot,
            ajaxParamsHas,
            ajaxParamsNot
        });
    },

    changeTab(key){
        this.props.actions.changeTab(key);
    },


    //下拉刷新成功回调
    onRefreshSuccess(data, ajaxParams){
        //用用list参数覆盖现在的this.propr.list
        this.props.actions[this.props.activeKey=="1"?"loadDataHasLearn":"loadDataNotLearn"](data.body.courseArr,
            {
                ...ajaxParams
            }
        );
    },

    //上拉加载更多成功回调
    onEndReachedSuccess(data, ajaxParams){
        //要在现有this.props.list数据上追加list
        let newList;
        if(this.props.activeKey=="1"){
            newList = [...this.props.listHas, ...data.body.courseArr];
        }else{
            newList = [...this.props.listNot, ...data.body.courseArr];
        }
        this.props.actions[this.props.activeKey=="1"?"loadDataHasLearn":"loadDataNotLearn"](newList,
            {
                ...ajaxParams
            }
        );
    },

    onScroll(scrollTop){
        //console.log(scrollTop);
        //更新scrollTop值
        this.props.actions[this.props.activeKey=="1"?"updateScrollTopHasLearn":"updateScrollTopNotLearn"](scrollTop);
    },

    componentDidMount() {
        //this.props.actions.loadIndexData();

    },

    render() {

        let _prop = this.props.location;
        let title = _prop.state&&_prop.state.name||"";


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

        var hasLearnListProps = {
                ...this.props,
                url: API.requiredList,
                row: row,
                list: this.props.listHas,
                ajaxParams: this.props.ajaxParamsHas,
                onRefreshSuccess: this.onRefreshSuccess,
                onEndReachedSuccess: this.onEndReachedSuccess,
                noResultTipContent: "您暂时还没有已学课程哦",
                initialListSize: this.props.listHas.length!=0?this.props.listHas.length:undefined,
                offsetTop: 45 + 44,
                scrollTop: this.props.scrollTopHas,
                onScroll: this.onScroll,
        }


        var notLearnListProps = {
            url: API.requiredList,
            row: row,
            list: this.props.listNot,
            ...this.props,
            ajaxParams: this.props.ajaxParamsNot,
            onRefreshSuccess: this.onRefreshSuccess,
            onEndReachedSuccess: this.onEndReachedSuccess,
            noResultTipContent: "您暂时还没有未学课程哦",
            initialListSize: this.props.listNot.length!=0?this.props.listNot.length:undefined,
            offsetTop: 45 + 44,
            scrollTop: this.props.scrollTopNot,
            onScroll: this.onScroll,
            //showNoResultTip:this.props.listNot.length==0
        }

return (
    <div>

        <ZnNavBar className="app-bar">我的{title}课</ZnNavBar>

        <Tabs defaultActiveKey={this.props.activeKey} swipeable={false} onChange={this.changeTab} style={{paddingTop: "0.9rem"}}>
            <TabPane tab="已学" key="1">
                <ZnListView  {...hasLearnListProps} />
            </TabPane>
            <TabPane tab="未学" key="2">
                <ZnListView  {...notLearnListProps} />
            </TabPane>
        </Tabs>

    </div>
)
}
});

export default createContainer("studyDetail.list", actions, {
    activeKey: "1",
    listHas:[],
    ajaxParamsHas:{
        courseType: "M",
        isCompleted: "1",
        isObligatory:"Y",
    },
    scrollTopHas: 0,

    listNot:[],
    ajaxParamsNot:{
        courseType: "M",
        isCompleted: "0",
        isObligatory:"Y",
    },
    scrollTopNot: 0,
}).bind(StudyDetail);