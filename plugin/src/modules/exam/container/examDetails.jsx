import React from 'react';
import { history } from 'react-router';
import createContainer from 'zn-container';
import { Toast, Modal} from 'antd-mobile';
import ZnNavBar from 'zn-component/znNavBar';
import Countdown from '../component/Countdown';
import ExamQuestions from '../component/ExamQuestions';
import ExamQuestionsList from '../component/ExamQuestionsList';
import ExamPagination from '../component/ExamPagination';
import * as actions from '../action/ExamDetailsAction';
import {checkedAnswerList} from '../action/commonFunction';
import "../style/examDetails.scss";

const ExamDetails = React.createClass({
    getInitialState(){
        return {
            examType:'',
            errorType:'',
            questionType:'',
            examTime:0,
            paperNumber:'',
            examArr:[],
            isValidate:false,
            passScore:0,
            startTestTime:0,
            curIndex:0,
            answerList:[],
            remainTime:0,
        }
    },
    componentDidMount(){
        this.index = 0;
        this.sid = Util.storage.getSid();
        this.examId = this.props.params.examId;
        this.examType = this.props.params.examType;
        this.errorType = this.props.params.errorType;//'0':本次考试错题，'1':整个错题库
        this.errorType = this.errorType&&this.errorType!='null'?this.errorType:null;
        this.paperNo = this.props.params.paperNo;
        this.previous = this.props.params.previous;
        this.setState({examType:this.examType,errorType:this.errorType});
        if(this.props.examDetails&&this.previous=='main'){
            this.setState({answerList:this.props.examRecord[this.examId]?this.props.examRecord[this.examId]:[]});
            this.updateState(this.props.examDetails);
            this.props.actions.getTime({sid:this.sid, examId:this.examId,});
        }else{
            this.clear();
            if(this.errorType=='0'){
                this.props.actions.getExamDetails({sid:this.sid,paperNo:this.paperNo},0);
            }else if(this.errorType=='1'){
                this.props.actions.getExamDetails({sid:this.sid,examId:this.examId},1);
            }else{
                this.props.actions.getExamDetails({sid:this.sid,examId:this.examId},-1,this.examType);
                this.props.actions.getTime({sid:this.sid, examId:this.examId,});
            }
        }
        Util.storage.push('isHasNoSubmit',true);
    },
    componentWillReceiveProps(nextProps){
        if(this.props.examDetails!=nextProps.examDetails&&nextProps.examDetails&&nextProps.examDetails.examArr){
            this.updateState(nextProps.examDetails);
        }
        if(this.props.remainTime!=nextProps.remainTime&&nextProps.remainTime){
            this.setState({remainTime:nextProps.remainTime});
        }
        if(this.props.examResult!=nextProps.examResult&&nextProps.examResult){
            if(nextProps.examResult.attemptId){
                //Toast.info('提交成功！');
                //this.context.router.push("/examMain/examResult/"+this.state.paperNumber+"/"+nextProps.examResult.attemptId);
                this.context.router.replace("/examMain/examResult/"+this.state.paperNumber+"/"+nextProps.examResult.attemptId);
            }else{
                Toast.info(nextProps.examResult);
            }
            this.props.actions.setResult(null);
        }

    },
    clear(){
        this.props.actions.setRecord({});
        this.props.actions.updateData(null);
        this.props.actions.setTime(0);
        this.props.actions.setResult(null);
    },
    updateState(data){
        if(this.errorType=='0'){
            const examArr = data.examArr;
            const questionType = this.setQuestionType(data.examArr[0].questionType);
            this.setState({examArr,questionType,answerList:examArr});
        }else if(this.errorType=='1'){
            const examArr = data.examArr;
            const questionType = this.setQuestionType(data.examArr[0].questionType);
            this.setState({examArr,questionType,answerList:examArr});
        }else{
            const examTime = data.examTime;
            const examArr = data.examArr;
            const paperNumber = data.paperNo;
            const isValidate = data.isValidate;
            const passScore = data.passScore;
            const startTestTime = data.startTestTime;
            const questionType = this.setQuestionType(data.examArr[0].questionType);
            this.setState({examTime,examArr,paperNumber,isValidate,questionType,passScore,startTestTime});
        }
    },
    changePagination(e){
        const questionType = this.setQuestionType(this.state.examArr[e].questionType);
        this.setState({curIndex:e,questionType});
    },
    autoChangePagination(){
        const nextIndex = this.state.curIndex+1;
        if(nextIndex<this.state.examArr.length){
            const questionType = this.setQuestionType(this.state.examArr[nextIndex].questionType);
            this.setState({curIndex:nextIndex,questionType});
        }
    },
    stopChangePagination(from,to){
        if(!this.state.answerList[from] && from<to){
            Toast.info('第'+(from+1)+'题还未作答！');
        }
    },
    setQuestionType(type){
        switch(type){
            case 'S':return '单选题';
            case 'M':return '多选题';
            case 'T':return '判断题';
            default :return '';
        }
    },
    chooseAnswer(messages){
        let array = [].concat(this.state.answerList);
        array[this.state.curIndex] = messages;
        this.setState({answerList:array});
        this.props.examRecord[this.examId] = array;
        this.props.examRecord['curIndex'] = this.state.curIndex;
        this.props.actions.setRecord(this.props.examRecord);
    },
    submitExam(){
        const that = this;
        const ations = [{ text: '确定', onPress: () => that.sureSubmit(), style: {color: '#f9948a'} },{ text: '取消',style: {color: '#f9948a'}},];
        Modal.alert(' ', '您确定要提交吗?', ations);
    },
    sureSubmit(){
        const result = checkedAnswerList(this.state.answerList,this.state.examArr,this.state.passScore);
        if(result){
            this.props.actions.submitExamDetails({
                sid:this.sid,
                examId:this.examId,
                paperNo:this.state.paperNumber,
                startTestTime:this.state.startTestTime,
                //examArr:result,
                ...result,
            });
            this.clear();
        }
    },
    render(){
        const disabled = !!this.state.errorType;
        const right = disabled?null:(<span onClick={this.submitExam}>交卷</span>);
        return (
            <div className="exam-details">
                <ZnNavBar onLeftClick={!disabled?this.submitExam:null} rightContent={right}>{this.state.questionType}</ZnNavBar>
                {(this.state.examType=='F'&&!disabled)?<Countdown examTime={parseInt(this.state.remainTime)} sureSubmit={this.sureSubmit}/>:null}
                <ExamQuestionsList
                    examArr={this.state.examArr}
                    answerList={this.state.answerList}
                    chooseAnswer={this.chooseAnswer}
                    changePagination={this.changePagination}
                    autoChangePagination={this.autoChangePagination}
                    stopChangePagination={this.stopChangePagination}
                    current={this.state.curIndex}
                    disabled={disabled}
                    style={{top:this.state.examType=='F'?'1.7rem':'0.9rem'}}
                />
                <ExamPagination total={this.state.examArr.length} current={this.state.curIndex+1} onChange={this.changePagination}/>
            </div>
        );
    },
    componentWillUnmount(){
        if(this.errorType){
            this.errorType = null;
            this.clear();
        }
    }
});

ExamDetails.contextTypes = {
    router: React.PropTypes.object.isRequired,
};
export default createContainer("ExamDetails", actions, {
    examDetails:null,
    examResult:null,
    remainTime:0,
    examRecord:{},
}).bind(ExamDetails);