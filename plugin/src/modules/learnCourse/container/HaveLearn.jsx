import React from 'react';
import createContainer from 'zn-container';
import "../style/learn.scss";
import * as actions from '../action/HaveLearnAction.jsx';

import ZnListItem from 'zn-component/znListItem';

import ZnImage from 'zn-component/znImage';

import ZnListView from 'zn-component/znListView/index';
import {API} from '../dataConfig.js'

const HaveLearn = React.createClass({
    //下拉刷新成功回调
    onRefreshSuccess(data, ajaxParams){
    //用list参数覆盖现在的this.props.list
        this.props.actions.loadData(data.body.courseArr,
            {
                ...ajaxParams
            }
        );
    },

    //上拉加载更多成功回调
    onEndReachedSuccess(data, ajaxParams){
        //要在现有this.props.list数据上追加list
        let newList = [...this.props.list, ...data.body.courseArr];
        this.props.actions.loadData(newList,
            {
                ...ajaxParams

            }
        );
    },

    componentDidMount(){
        let flag = "Y";
        if(this.props.isObligatory==14) {
            flag = "Y";
        }else if(this.props.isObligatory==29) {
            flag = "N";
        }else {
            console.log("无法判断必修选修");
        }
        this.props.actions.saveAjaxParams({...this.props.ajaxParams, isObligatory:flag});

        //this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    },

    /** 路由退出时的函数 **/
    routerWillLeave(route) {
        /*if (!_.startsWith(route.pathname.toUpperCase(),"/classify/courseDetail".toUpperCase())) {
            this.props.containerActions.clearReducer();
        };*/
    },

    componentWillMount(){
        this.test = "aaa";
    },

    onScroll(scrollTop){
        //console.log(scrollTop);
        //更新scrollTop值
        this.props.actions.updateScrollTop(scrollTop);
    },

    showDetail(id){
        let path = "/classify/courseDetail/"+id;
        this.context.router.push({pathname: path});
    },

    render(){
    const row = (rowData, sectionID, rowID) => {
        var rowDataProps = {
                leftContent: <div> <ZnImage src={rowData.courseImg}/> { rowData.isCompleted=="1"?<i className="studied-icon"></i>:null } </div>,
                title: <div>{rowData.courseName}</div>,
                intro: <div className="comment-bottom">
                        <span className="course-score"><i></i>{rowData.rating}</span>
                        <span className="course-heart"><i></i>{rowData.totalLike}</span>
                        <span className="course-comment"><i></i>{rowData.totalComments}</span>
                      </div>
            }
            return (<a key={rowID} href="javascript:;" onClick={()=>this.showDetail(rowData.courseId)}> <ZnListItem {...rowDataProps} /> </a>)
            };
        let znListViewProps = {
            url: API.requiredList,
            row: row,
            list: this.props.list,
            ajaxParams: this.props.ajaxParams,
            onRefreshSuccess: this.onRefreshSuccess,
            onEndReachedSuccess: this.onEndReachedSuccess,
            onScroll: this.onScroll,
            noResultTipContent: "您暂时还没有已学课程哦",
            offsetTop: 45 + 44,
            ...this.props,
        };
        return(
            <div>
                <ZnListView ref="znListView" {...znListViewProps} />
            </div>
        )
    },
});

//router配置
HaveLearn.contextTypes = {
    router: React.PropTypes.object.isRequired,
}
export default createContainer('learnSituation.havaLearn',actions,{
    list:[],
    ajaxParams: {
        courseType: "M",
        isCompleted: "1",
        isObligatory:"Y",   //必修"Y",选修"N"
    },
    scrollTop: 0,
}).bind(HaveLearn);