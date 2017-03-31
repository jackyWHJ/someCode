import React from 'react';
import {Link} from 'react-router';
import createContainer from 'zn-container';
import { Tabs, WhiteSpace,Toast,Modal } from 'antd-mobile';
import ZnNavBar from 'zn-component/znNavBar';
import ZnListView from 'zn-component/znListView/index';
import icon_next2 from 'zn-image/examImg/icon_next2.png';
import examListIcon from 'zn-image/examImg/examList-icon.png';
import * as mainActions from '../action/ExamMainAction';
import * as detailsActions from '../action/ExamDetailsAction';
import {ExamListUrl as URL} from '../action/ActionType';
import {checkedAnswerList} from '../action/commonFunction';
import '../style/examList.scss';

const actions = {...mainActions,...detailsActions};
const TabPane = Tabs.TabPane;
const ExamMain = React.createClass({
    componentDidMount(){
        this.context.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        );
        if(this.props.examDetails&&this.props.examDetails.examArr&&Util.storage.get('isHasNoSubmit')){
            this.submitExam();
        }
        this.setColor(this.props.showTab);
    },
    componentWillReceiveProps(nextProps){
        if(this.props.examResult!=nextProps.examResult&&nextProps.examResult){
            if(nextProps.examResult.attemptId){
                //Toast.info('提交成功！');
                this.context.router.push('/examMain/examIntroduction/'+this.props.examDetails.examId);
                this.context.router.push("/examMain/examResult/"+this.props.examDetails.paperNo+"/"+nextProps.examResult.attemptId);
                //this.context.router.replace("/examMain/examResult/"+this.props.examDetails.paperNo+"/"+nextProps.examResult.attemptId);
            }else{
                Toast.info(nextProps.examResult);
            }
            this.props.actions.setResultMain(null);
        }
    },
    routerWillLeave(next){
        let reg = /((\/examIntroduction)|(\/examDetails)|(\/examResult))/;
        if (!reg.test(next.pathname)){
            this.props.containerActions.clearReducer();
        }
    },
    setColor(key){
        let tabTop = [];
        tabTop = this.refs.examTabs.childNodes[1].childNodes[0];
        tabTop.childNodes[0].style.backgroundColor = Util.storage.getNavBarColor();
        let elments = [];
        elments = tabTop.getElementsByTagName('div');
        if(key=='F'){
            elments[1].style.color = Util.storage.getNavBarColor();
            elments[2].style.color = '#000';
        }else{
            elments[2].style.color = Util.storage.getNavBarColor();
            elments[1].style.color = '#000';
        }
    },
    onChange(key){
        this.setColor(key);
        this.props.actions.setShowTab(key);
    },
    submitExam(){
        const that = this;
        const ations = [{ text: '继续考试', onPress: () => that.continueExam(), style: {color: '#f9948a'} },{ text: '直接提交',onPress: () => that.sureSubmit(), style: {color: '#f9948a'}},];
        Modal.alert(' ', '您存在考试名称为【'+this.props.examDetails.examName+'】的考试未提交', ations);
    },
    continueExam(){
        if(this.props.examDetails){
            this.context.router.push('/examMain/examIntroduction/'+this.props.examDetails.examId);
            this.context.router.push('/examMain/examDetails/'+this.props.examDetails.examId+'/'+this.props.examDetails.examType+'/null/null/null/'+'main');
            //this.context.router.replace('/examMain/examDetails/'+this.props.examDetails.examId+'/'+this.props.examDetails.examType+'/null/null/null/'+'main');
        }
    },
    sureSubmit(){
        const examArr = this.props.examDetails.examArr;
        const examId = this.props.examDetails.examId;
        const paperNumber = this.props.examDetails.paperNo;
        const passScore = this.props.examDetails.passScore;
        const startTestTime = this.props.examDetails.startTestTime;
        const result = checkedAnswerList(this.props.examRecord[examId] || [],examArr,passScore);
        this.props.actions.submitExamDetailsMain({
            sid:Util.storage.getSid(),
            examId:examId,
            paperNo:paperNumber,
            startTestTime:startTestTime,
            ...result,
        });
        this.props.actions.setRecord({});
        this.props.actions.updateData(null);
    },
    onRefreshSuccess(data, ajaxParams){
        if(this.props.showTab=='F'){
            this.props.actions.loadFormalData(data.body.examArr, ajaxParams);
        }else if(this.props.showTab=='S'){
            this.props.actions.loadSimulationData(data.body.examArr, ajaxParams);
        }
    },
    onEndReachedSuccess(data, ajaxParams){
        if(this.props.showTab=='F'){
            let newList = [...this.props.formalExamList, ...data.body.examArr];
            this.props.actions.loadFormalData(newList, ajaxParams);
        }else if(this.props.showTab=='S'){
            let newList = [...this.props.simulationExamList, ...data.body.examArr];
            this.props.actions.loadSimulationData(newList, ajaxParams);
        }
    },
    onScroll(scrollTop){
        //更新scrollTop值
        if(this.props.showTab=='F'){
            this.props.actions.updateFormalScrollTop(scrollTop);
        }else if(this.props.showTab=='S'){
            this.props.actions.updateSimulationScrollTop(scrollTop);
        }
    },
    row(rowData, sectionID, rowID){
        const isPassedText = rowData.examStatus=='2'?'已通过':(rowData.examStatus=='1'?'未通过':'');
        const isPassedClass = rowData.examStatus=='2'?' passed':(rowData.examStatus=='1'?' no-pass':'');
        return (
            <Link className="row-text-link" to={'/examMain/examIntroduction/'+rowData.examId}>
                <div key={rowData.examId} className="row-div" onClick={(e)=>{e.stopPropagation();return false;}}>
                    <div className="row-flex">
                        <div className={"row-img"+isPassedClass}></div>
                        <div className="row-text">
                            <p className="row-text-p" >{rowData.examName}<br/><span className={isPassedClass}>{isPassedText}</span></p>
                            <img className="row-text-img" src={icon_next2} />
                        </div>
                    </div>
                </div>
            </Link>
        );
    },
    render() {
        const formal = {
            url: URL.getFormalExamList,
            row: this.row,
            renderSeparator:(sectionID, rowID)=><div key={`${sectionID}-${rowID}`} style={{height:'0.18rem',backgroundColor:"rgba(255,255,255,0)"}} />,
            list: this.props.formalExamList,
            ajaxParams: this.props.formalAjaxParams,
            onRefreshSuccess: this.onRefreshSuccess,
            onEndReachedSuccess: this.onEndReachedSuccess,
            noResultTipContent: "您暂时还没有正式考试哦",
            offsetTop: 0,
            scrollTop:this.props.formalScrollTop,
            initialListSize: this.props.formalExamList.length!=0?this.props.formalExamList.length:undefined,
            onScroll: this.onScroll,
        };
        const simulation = {
            url: URL.getSimulationExamList,
            row: this.row,
            renderSeparator:(sectionID, rowID)=><div key={`${sectionID}-${rowID}`} style={{height:'0.18rem',backgroundColor:"rgba(255,255,255,0)"}} />,
            list: this.props.simulationExamList,
            ajaxParams: this.props.simulationAjaxParams,
            onRefreshSuccess: this.onRefreshSuccess,
            onEndReachedSuccess: this.onEndReachedSuccess,
            noResultTipContent: "您暂时还没有模拟考试哦",
            offsetTop: 0,
            scrollTop:this.props.simulationScrollTop,
            initialListSize: this.props.simulationExamList.length!=0?this.props.simulationExamList.length:undefined,
            onScroll: this.onScroll,
        };
        return(
            <div className="exam-tabs" ref="examTabs">
                <ZnNavBar>考试</ZnNavBar>
                <Tabs defaultActiveKey="F" activeKey={this.props.showTab} swipeable={false} onChange={this.onChange}>
                    <TabPane tab="正式考试" key="F">
                        <ZnListView {...formal}/>
                    </TabPane>
                   <TabPane tab="模拟考试" key="S">
                        <ZnListView {...simulation}/>
                    </TabPane>
                </Tabs>
            </div>
        );
    },
    componentWillUnmount(){

    }
});
ExamMain.contextTypes = {
    router: React.PropTypes.object.isRequired,
};
export default createContainer("ExamMain", actions, {
    showTab:'F',
    formalExamList:[],
    simulationExamList:[],
    formalAjaxParams: {},
    simulationAjaxParams: {},
    formalScrollTop: 0,
    simulationScrollTop: 0,
    examResult:null,
}).inject(["ExamDetails"], function(state) {
    return {
        examDetails: state["ExamDetails"] ? state["ExamDetails"].examDetails : {},
        examRecord: state["ExamDetails"] ? state["ExamDetails"].examRecord : {},
    }
}).bind(ExamMain);