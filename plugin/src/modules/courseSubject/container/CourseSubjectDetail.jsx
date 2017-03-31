import React from 'react'
import  ZnFullSubjectCell from "zn-component/znFullSubjectCell";
import ZnListView from 'zn-component/znListView';
import * as actions from '../action/CourseSubjectDetailAction.jsx'
import createContainer from 'zn-container';
import ZnListItem from 'zn-component/znListItem';
import ZnImage from 'zn-component/znImage'
import ZnNavBar from 'zn-component/znNavBar';
import courseObserve from 'zn-common/utils/courseObserve';

const CourseSubjectDetail = React.createClass({
    getInitialState(){
        let id = this.props.params.id;
        return{
            studyMotId:id
        }
    },

    componentWillMount(){
        this.props.actions.updataStudyMotld({...this.props.ajaxParams,studyMotId:this.state.studyMotId})
        this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    },

    routerWillLeave(next){
        let reg = /(\/courseDetail)/; //如果不是跳转到课程专题的详情页面，则清空list
        if (!reg.test(next.pathname)){
            this.props.containerActions.clearReducer();
            //进入的不是详情，清空观察者回调
            courseObserve.remove("courseSubject.CourseSubjectDetail");
        }else{
            //进入详情，注入观察者
            courseObserve.add("courseSubject.CourseSubjectDetail", this.coureseDetailsUpdate);
        }
    },

    coureseDetailsUpdate(dispatch, course){
        let list = this.props.list;
        let flag = false;   //标志是否改变
        list.forEach((item,index)=>{
            if(item.courseId==course.courseId){
                console.log(course.bowseNumber)
                //list[index].totalBrowse = course.bowseNumber;     //暂时先不处理
                list[index].score = course.averageScore.replace(/\.0$/,"");
                flag = true;
            }
        })

        dispatch({
            type:"courseSubject.CourseSubjectDetail",
            list: list//在this.props.list基础上，对回调回来的course进行对应课程处理
        })

       /* if(flag){
            let parent = this.props.parent_list;
            parent.forEach((item,index)=>{
                if(item.studyMotId==this.state.studyMotId){
                   // parent[index].totalBrowse = course.bowseNumber;//暂时先不处理
                }
            })
            dispatch({
                type:"courseSubject.main",
                parent_list:parent
            })
        }*/
    },

    componentDidMount()
    {

    },

    //下拉刷新成功回调
    onRefreshSuccess(data, ajaxParams){
        //用list参数覆盖现在的this.props.list
        this.props.actions.loadData(data, { ...ajaxParams},'refresh',null);
    },

    //上拉加载更多成功回调
    onEndReachedSuccess(data, ajaxParams){
        //要在现有this.props.list数据上追加list
        //let newList = [...this.props.list, ...data.body.courseArr];
        this.props.actions.loadData(data,{ ...ajaxParams},'add',this.props.list);
    },

    onScroll(scrollTop){
        this.props.actions.updateScrollTop(scrollTop);
    },

    showDetail(id){
        let path = "/classify/courseDetail/"+id;
        this.context.router.push({pathname: path});
    },

    render(){
        let smaImgUrl=this.props.smaImgUrl||"";
        // let imgSrc ='http://hrmsv3-mlearning-admin-dmzstg1.pingan.com.cn/learn/out/nasPicture.do?imgPath='+ smaImgUrl.substr(smaImgUrl.indexOf('/learn/app/')+11,smaImgUrl.length-1);
        let imgSrc = smaImgUrl;
        let row=(rowData, sectionID, rowID)=>{
            let obj = rowData;
            let producer = obj.producer?("讲师："+obj.producer):obj.producer;
            let rows = [];
            if(rowID==0){
                rows[rowID]=(
                        <div key={rowID}>
                            <ZnFullSubjectCell imgSrc={imgSrc} title={this.props.studyMotName} viewNum={""} view={{display:"none"}}/>
                            <a className="rank-list-item-link"  href="javascript:;" onClick={()=>this.showDetail(obj.courseId)}>
                                <ZnListItem
                                    leftContent={<div><ZnImage src={obj.courseImg}/> { obj.isCompleted=="1"?<i className="studied-icon"></i>:null } </div>}
                                    title={obj.courseName}
                                    subTitle={producer}
                                    intro={<div className="comment-bottom">
                                        <span className="course-view"><i></i>{obj.totalBrowse}</span>
                                        <span className="course-score"><i></i>{obj.score}</span>
                                        </div>}
                                />
                            </a>
                        </div>
                    )
            }else{
                rows[rowID]=(
                    <a className="rank-list-item-link" key={rowID} href="javascript:;" onClick={()=>this.showDetail(obj.courseId)}>
                        <ZnListItem
                            leftContent={<div><ZnImage src={obj.courseImg}/> { obj.isCompleted=="1"?<i className="studied-icon"></i>:null } </div>}
                            title={obj.courseName}
                            subTitle={producer}
                            intro={<div className="comment-bottom">
                                <span className="course-view"><i></i>{obj.totalBrowse}</span>
                                <span className="course-score"><i></i>{obj.score}</span>
                                </div>}
                            />
                    </a>
                )
            }
            return <div>{rows}</div>;
        }
        let listProps={
                url: actions.API.SubjectDetail,
                row: row,
                list: this.props.list,
                ajaxParams: this.props.ajaxParams,
                onRefreshSuccess: this.onRefreshSuccess,
                onEndReachedSuccess: this.onEndReachedSuccess,
                onScroll: this.onScroll,
                noResultTipContent: "本专题没有课程哦",
                offsetTop: 45 + 44,
                ...this.props,
        }
        return(
            <div>
                <ZnNavBar>{this.props.studyMotName}</ZnNavBar>
                <ZnListView ref="znListView" {...listProps} />
            </div>
        )
    }
})

//router配置
CourseSubjectDetail.contextTypes = {
    router: React.PropTypes.object.isRequired,
}

export default createContainer('courseSubject.CourseSubjectDetail',actions,{
    list:[],
    studyMotName:"",
    smaImgUrl:"",
    ajaxParams: {
        studyMotId:"",
        isZip: 0,
    },
    scrollTop: 0,
}).inject(["courseSubject.main"], function(state) {
    return {
        parent_list: state["courseSubject.main"] ? state["courseSubject.main"].list : []
    };
}).bind(CourseSubjectDetail);