import React from 'react';
import { Toast,Carousel } from 'antd-mobile';
import ExamQuestions from './ExamQuestions';

const ExamQuestionsList = React.createClass({
    beforeChange(from,to){
        if(this.props.stopChangePagination){
            this.props.stopChangePagination(from,to);
        }
    },
    afterChange(index){
        if(this.props.changePagination){
            this.props.changePagination(index);
        }
    },
    render(){
        const that = this;
        return (
            <div className="exam-question-carousel" style={this.props.style}>
                <Carousel
                    className="my-carousel"
                    selectedIndex={this.props.current}
                    dots={false}
                    autoplay={false}
                    beforeChange={this.beforeChange}
                    afterChange={this.afterChange}
                >
                    {
                        that.props.examArr.map(function(item,index){
                            return (
                                <ExamQuestions
                                    key={index+'-'+item.questionId}
                                    {...item}
                                    disabled={that.props.disabled}
                                    answers={that.props.answerList[index]?that.props.answerList[index].selectedSectionId:[]}
                                    chooseAnswer={that.props.chooseAnswer}
                                    autoChangePagination={that.props.autoChangePagination}
                                />
                            );
                        })
                    }
                </Carousel>
            </div>
        );
    }
});

export default ExamQuestionsList;