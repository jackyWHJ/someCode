import { ListView,Result,NavBar,Toast} from 'antd-mobile';
import {znHeader} from '../../../common/components/znHeader/znHeader.jsx'
import React from 'react'
import '../style/rank.scss'
import ZnListItem from 'zn-component/znListItem';
import ZnNavBar from 'zn-component/znNavBar'
import ZnNoResultTip from 'zn-component/znNoResultTip';
import ZnSimpleListView from 'zn-component/znSimpleListView'
import courseObserve from 'zn-common/utils/courseObserve';

import rank_1 from 'zn-image/rank_1@2x.png'


//const NUM_ROWS = this.props.chartArr.length;
const RankCourse = React.createClass({
    getInitialState() {
    this.scrollTop = 0
        const dataSource = new ListView.DataSource({
                            rowHasChanged: (row1, row2) => row1 !== row2,
                        });

        return {
            dataSource: dataSource.cloneWithRows({}),
            isLoading: false,
        };
    },
    genData(nextProps,pIndex=0){
        const dataBlob = {};
        let NUM_ROWS=nextProps.chartArr.length;
        for (let i = 0; i < NUM_ROWS; i++) {
            const ii = (pIndex * NUM_ROWS) + i;
            dataBlob[`${ii}`] = `row - ${ii}`;
        }
        return dataBlob;
    },

    componentWillMount(){
        this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    },

    componentWillReceiveProps(nextProps)
    {
        if(this.props.chartArr!=nextProps.chartArr){
            this.rData = this.genData(nextProps);
            this.setState({dataSource: this.state.dataSource.cloneWithRows(this.rData)})
        }
    },

    componentDidMount()
    {
        if(this.props.scrollTop && this.props.scrollTop!=0){
            window.scrollTo(0,this.props.scrollTop);

            //this.refs.lv.refs.listview.scrollTo(0, this.props.scrollTop);
        }
        //this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    },

    /** 路由退出时的函数 **/
    routerWillLeave(route) {
        if (!_.startsWith(route.pathname.toUpperCase(),"/classify/courseDetail".toUpperCase())) {
            this.props.containerActions.clearReducer();
            //进入的不是详情，清空观察者回调
            courseObserve.remove("rank.course");
        }else{
            //进入详情，注入观察者
            courseObserve.add("rank.course", this.coureseDetailsUpdate);
        }
    },

    coureseDetailsUpdate(dispatch, course){
        let list = this.props.chartArr;
        console.log(course);
        list.forEach((item,index)=>{
            if(item.courseId==course.courseId){
                list[index].rating=course.averageScore.replace(/\.0$/,"");     //暂时不处理,处理5.0的情况
                list[index].commentNum=course.totalComments;
            }
        })
        dispatch({
            type:"rank.course",
            chartArr: list //在this.props.list基础上，对回调回来的course进行对应课程处理
        })
    },

    showDetail(flag,id){
        if(flag!=1){
            Toast.fail("您没有权限浏览此课程",1);
            return;
        }
        let path = "/classify/courseDetail/"+id;
        this.context.router.push({pathname: path});
    },

    onScroll(scrollTop){
        this.props.actions.updateScrollTop(scrollTop);
    },

    render() {
        let ds = this.state.dataSource;
        let dpr=    Util.getDeviceDPR();
        let ItemWidth =  document.documentElement.clientWidth;
        let title = this.props.location.state&&this.props.location.state.name||"排行榜";

        const separator = (sectionID, rowID) => {
            return <div key={`${sectionID}-${rowID}`} style={{ backgroundColor: '#eee', height: rowID==9?0:rowID==2?(4*dpr):(1*dpr) } }></div>
        }

        //let index = 0;
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;//this.props.chartArr[index++];
            let rowCon=[];
            if(rowID==0){
                rowCon[rowID]=(
                    <a className="rank-list-item-link first-row" key={rowID} href="javascript:;" onClick={()=>this.showDetail(obj.learnable,obj.courseId)} style={{width:ItemWidth}}>
                        <div className="trunk" >
                            <img src={obj.courseImg} className="rank-01-img"/>
                            <ZnListItem key={rowID} className="rank-list-item"
                                    borderBottom={"none"}
                                    leftContent={<img src={rank_1}  alt=""/>}
                                    title={obj.courseTitle}
                                    intro={<div className="comment-bottom">
                                        <span className="course-score"><i></i>{obj.rating}</span>
                                        <span className="course-comment"><i></i>{obj.commentNum}</span>
                                        </div>}
                            />
                        </div>
                    </a>);
            }else{
                let id = rowID*1+1;
                let img_src = require(`zn-image/rank_public_channel_${id}@2x.png`);//"../../../img/rank_public_channel_"+id+"@2x.png";
                rowCon[rowID]=
                    <a className="rank-list-item-link" key={rowID} href="javascript:;" onClick={()=>this.showDetail(obj.learnable,obj.courseId)} style={{width:ItemWidth}}>
                        <ZnListItem
                            leftContent={<img src={obj.courseImg}  alt=""/>}
                            borderBottom={"none"}
                            title={<div><img src={img_src} style={{margin:"0 10px 0 0", height:"20px"}}/>{obj.courseTitle}</div>}
                            intro={<div className="comment-bottom">
                            <span className="course-score"><i></i>{obj.rating}</span>
                            <span className="course-comment"><i></i>{obj.commentNum}</span>
                        </div>}
                        />
                    </a>
            }
            return (
                    <div>
                        {rowCon}
                    </div>
                );
            };// onEndReached={this.onEndReached}
            let znListViewProps = {
                    row: row,//单个元素处理函数，形参(rowData, sectionID, rowID)
                    list: this.props.chartArr,//列表数据源
                    scrollTop: this.props.scrollTop,//滚动轴要滚动的距离，例如当从第5页点击一个课程进去，返回时候要记录当前滚轴移动距离
                    onScroll: this.onScroll, //触发滚动回调，参数是滚动的scrollTop值,
                    noResultTipContent: "暂时还没有获取到排行榜数据~",
                    showNoResultTip: this.props.loading==false&&this.props.chartArr.length==0,
                    showListView: {true},
                    noRefresh: true,
                    renderFooter: null,
                    offsetTop:45,
                    renderSeparator:separator
                };



        return (
            <div>
                <ZnNavBar>{title}</ZnNavBar>
                <ZnSimpleListView {...znListViewProps} />
            </div>
        );
    },
})

//router配置
RankCourse.contextTypes = {
    router: React.PropTypes.object.isRequired,
}

export default RankCourse;
