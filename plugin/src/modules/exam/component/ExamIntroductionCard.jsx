import React from 'react';
import {Card } from 'antd-mobile';

const ExamIntroductionCard = React.createClass({
    render() {
        const array = this.props.messageArray?this.props.messageArray.map(function(item,index){
                return(
                    <p key={item.label+index} className="exam-number">
                        <span className="left">{item.label?item.label:''}</span>
                        <span className="right">{item.text?item.text:''}</span>
                    </p>
                );
        }):[];
        return(
            <div className="exam-introduction-message-card">
                <Card>
                    <Card.Header title={this.props.title?this.props.title:''} thumb={this.props.src?this.props.src:""} />
                    <Card.Body>
                        <div className="exam-introduction-message-text">
                            {array}
                        </div>
                    </Card.Body>
                </Card>
            </div>

        );
    }
});

export default ExamIntroductionCard;