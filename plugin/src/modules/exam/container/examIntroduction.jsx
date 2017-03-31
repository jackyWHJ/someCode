import React from 'react';
import {Link} from 'react-router';
import createContainer from 'zn-container';
import {WhiteSpace,Button,Toast} from 'antd-mobile';
import ZnNavBar from 'zn-component/znNavBar';
import ExamIntroductionShow from '../component/ExamIntroductionShow';
import * as actions from '../action/ExamIntroductionAction';
import '../style/examIntroduction.scss';

const ExamIntroduction = React.createClass({
    componentWillMount(){
        this.examId = this.props.params.examId;
        this.examType = this.props.params.examType;
        this.sid=Util.storage.getSid();
    },
    componentDidMount(){
        this.props.actions.getExamIntroduction({sid:this.sid,examId:this.examId});
        this.props.actions.getUserInfo({sid:this.sid});
    },
    onClick(url,type){
        if(this.props.examIntroduction.isValidate=='N'&&type=='start'){
            Toast.info("抱歉，【"+this.props.examIntroduction.examName+"】还未开放");
            return;
        }
        this.context.router.push(url);
        //this.context.router.replace(url);
    },
    goBack(){
        //this.context.router.push('/examMain');
        this.context.router.replace('/examMain');
    },
    render() {
        const {remainNum,hasErrorBank,hisRecord,examType,...other} = this.props.examIntroduction;
        const startExamDisabled = (parseInt(remainNum)==0);
        const startExamUrl = '/examMain/examDetails/'+this.examId+'/'+examType;
        const errorExamDisabled = hasErrorBank=='N';//(hisRecord=='Y' && hasErrorBank=='N');
        const errorExamUrl = '/examMain/examDetails/'+this.examId+'/null/1/null';
        const historyDisabled = (hisRecord=='N');
        const historyUrl = '/examMain/examHistory/'+this.examId;
        const style = {backgroundColor: Util.storage.getNavBarColor()};
        return(
            <div className="exam-introduction-div">
                <ZnNavBar >{examType=='F'?'正式考试':'模拟考试'}</ZnNavBar>
                <ExamIntroductionShow message={this.props.examIntroduction} userInfo={this.props.userInfo}/>
                <div className="exam-introduction-bottom">
                    <Button type="primary" className={"own-button"+(startExamDisabled?' own-button-disabled':'')} style={startExamDisabled?null:style} disabled={startExamDisabled} onClick={this.onClick.bind(this,startExamUrl,'start')}>进入考试</Button>
                    {!errorExamDisabled?<Button type="primary" className={"own-button"+(errorExamDisabled?' own-button-disabled':'')} style={errorExamDisabled?null:style} disabled={errorExamDisabled} onClick={this.onClick.bind(this,errorExamUrl)}>错题库</Button>:null}
                    {!historyDisabled?<Button type="primary" className={"own-button"+(historyDisabled?' own-button-disabled':'')} style={historyDisabled?null:style} disabled={historyDisabled} onClick={this.onClick.bind(this,historyUrl)}>历史成绩</Button>:null}
                </div>
            </div>
        );
    },
    componentWillUnmount(){
        this.props.actions.updateData({remainNum:0, hasErrorBank:'', hisRecord:'', examType:''});
        this.props.actions.updateUserInfo({});
    }
});
ExamIntroduction.contextTypes = {
    router: React.PropTypes.object.isRequired,
};
export default createContainer("ExamIntroduction", actions, {
    examIntroduction:{
        remainNum:0,
        hasErrorBank:'',
        hisRecord:'',
        examType:''
    },
    userInfo:{}
}).bind(ExamIntroduction);