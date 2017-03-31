import React from 'react';
import createContainer from 'zn-container';
import { Radio,Checkbox} from 'antd-mobile';
import trueIcon from 'zn-image/examImg/trueIcon.png';

const PropTypes = React.PropTypes;
const ExamQuestions = React.createClass({
    propTypes: {
        question:PropTypes.string,
        questionId:PropTypes.string,
        questionType:PropTypes.string,
        score:PropTypes.number,
        sectionArr:PropTypes.array,
        answers:PropTypes.array,
    },
    getDefaultProps(){
        return {
            question:'',
            questionId:'',
            questionType:'',
            score:0,
            sectionArr:[],
            answers:[],
        }
    },
    getInitialState(){
        return {
            questionTile:this.props.question,
            questionId:this.props.questionId,
            questionType:this.props.questionType,
            score:this.props.score,
            sectionArr:this.props.sectionArr,
            //curValue:[],
            answers:this.props.answers,//[],
        }
    },
    componentWillReceiveProps(nextProps){
        if(this.props.answers!=nextProps.answers&&nextProps.answers){
            this.setState({answers:nextProps.answers});
        }
    },
    getSection(array,type){
        const that = this;
        const list = array.map(function(item,index){
            const disabled = that.props.disabled;
            const checked = disabled?item.isSelected=='Y':that.state.answers.indexOf(item.sectionId)>-1;
            return type!='M'?(
                <div className="exam-checked" key={item.sectionId}>
                    {disabled&&item.isCorrect=='Y'?<img className="is-correct" src={trueIcon}/>:null}
                    <Radio className={"my-radio"+(checked?' checked':'')} disabled={disabled} checked={checked} value={item.sectionId} onChange={(e)=>that.onChange(e,item.sectionId,index)}>{item.sectionText}</Radio>
                </div>
            ):(
                <div className="exam-checked" key={item.sectionId}>
                    {disabled&&item.isCorrect=='Y'?<img className="is-correct" src={trueIcon}/>:null}
                    <Checkbox className={"my-radio"+(checked?' checked':'')} disabled={disabled} value={item.sectionId} checked={checked} onChange={(e)=>that.onChange(e,item.sectionId,index)}>{item.sectionText}</Checkbox>
                </div>
            );
        });
        return list;
    },
    onChange(e,sectionId,index,isCorrect){
        let array = [];
        if(e.target.checked){
            if(this.state.questionType!='M'){
                //array = [sectionId];
                array[index] = sectionId;
                //this.props.autoChangePagination();//自动切换题目
            }else{
                array = [].concat(this.state.answers);
                //array.push(sectionId);
                array[index] = sectionId;
            }
        }else{
            const curIndex = this.state.answers.indexOf(sectionId);
            //this.state.answers.splice(curIndex,1);
            this.state.answers[curIndex] = undefined;
            array = [].concat(this.state.answers);
        }
        //this.setState({answers:array});
        if(this.props.chooseAnswer){
            this.props.chooseAnswer({
                questionId:this.state.questionId,
                selectedSectionId:array
            });
        }
    },
    render(){
        return (
            <div className="exam-question">
                <div className="exam-question-title">{this.state.questionTile}</div>
                <div className="exam-question-content">
                    {this.getSection(this.state.sectionArr,this.state.questionType)}
                </div>
            </div>
        );
    }
});

export default ExamQuestions;