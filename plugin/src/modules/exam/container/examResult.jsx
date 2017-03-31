import React from 'react';
import createContainer from 'zn-container';
import { Button} from 'antd-mobile';
import ZnNavBar from 'zn-component/znNavBar';
import passJpg from 'zn-image/examImg/pass.jpg';
import passNJpg from 'zn-image/examImg/pass-n.jpg';
import * as actions from '../action/ExamResultAction';
import "../style/examResult.scss";

const ExamResult = React.createClass({
    getInitialState(){
        return {
            examName:'',
            examType:'',
            score:0,
            isPass:'N',
            examId:'',
            isHidenErrQuestion:'',
            hasErrorBank:'',
            remainNum:-1,
        }
    },
    componentDidMount(){
        this.sid = Util.storage.getSid();
        this.paperNo = this.props.params.paperNo;
        this.attemptId = this.props.params.attemptId;
        if(this.paperNo){
            this.props.actions.getExamResult({paperNo:this.paperNo,sid:this.sid,attemptId:this.attemptId});
        }
        Util.storage.push('isHasNoSubmit',false);
    },
    componentWillReceiveProps(nextProps){
        if(this.props.examResult!=nextProps.examResult&&nextProps.examResult){
            const examName = nextProps.examResult.examName;
            const examType = nextProps.examResult.examType;
            const score = nextProps.examResult.score;
            const isPass = nextProps.examResult.isPass;
            const examId = nextProps.examResult.examId;
            const isHidenErrQuestion = nextProps.examResult.isHidenErrQuestion;
            const hasErrorBank = nextProps.examResult.hasErrorBank;
            const remainNum = nextProps.examResult.remainNum;
            this.setState({examName,examType,score,isPass,examId,isHidenErrQuestion,hasErrorBank,remainNum});
        }
    },
    onClick(url){
        //this.context.router.push(url);
        this.context.router.replace(url);
    },
    goBack(){
        //this.context.router.push('/examMain/examIntroduction/'+this.state.examId);
        this.context.router.replace('/examMain/examIntroduction/'+this.state.examId);
    },
    render(){
        const errorUrl = '/examMain/examDetails/'+this.state.examId+'/null/0/'+this.paperNo+'/'+this.attemptId;
        const examUrl = '/examMain/examDetails/'+this.state.examId+'/'+this.state.examType;
        return (
        <div>
            <ZnNavBar >{this.state.examType=='F'?'正式考试':'模拟考试'}</ZnNavBar>
            <div className="exam-result">
                <div className="exam-result-top">
                    <img className="exam-result-img" src={this.state.isPass=='Y'?passJpg:passNJpg}/>
                </div>
                <div className={"exam-result-middle"+(this.state.isPass=='Y'?' pass':' no-pass')}>
                    <p className="exam-name">{this.state.examName}</p>
                        {this.state.examType=='F'?(<p className="exam-number">{'您还剩下'+this.state.remainNum+'次考试机会'}</p>):null}
                    <p className="exam-score">{this.state.score}<span>分</span></p>
                    <p className="exam-tip">{this.state.isPass=='Y'?'恭喜您，考试通过了！':'您没有通过考试哦！'}</p>
                </div>
                <div className="exam-result-bottom">
                    {
                        this.state.isHidenErrQuestion=='Y'?null:(
                            <div className="exam-result-bottom-left">
                                <Button className={"exam-result-own-button"+(this.state.hasErrorBank!='N'?" exam-result-own-button-left":"")} disabled={this.state.hasErrorBank=='N'} onClick={this.onClick.bind(this,errorUrl)}>错题查看</Button>
                            </div>
                        )
                    }
                    <div className="exam-result-bottom-right">
                        <Button className={"exam-result-own-button"+(this.state.remainNum!=0?" exam-result-own-button-right":"")} disabled={this.state.remainNum==0} onClick={this.onClick.bind(this,examUrl)}>再考一次</Button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
ExamResult.contextTypes = {
    router: React.PropTypes.object.isRequired,
};
export default createContainer("ExamResult",actions, {
    examResult:null
}).bind(ExamResult);