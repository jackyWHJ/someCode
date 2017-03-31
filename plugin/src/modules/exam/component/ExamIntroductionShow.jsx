import React from 'react';
import {WhiteSpace,Card } from 'antd-mobile';
import ExamIntroductionCard from './ExamIntroductionCard';
import icon_01 from 'zn-image/examImg/icon_01.png';
import icon_02 from 'zn-image/examImg/icon_02.png';
import icon_03 from 'zn-image/examImg/icon_03.png';
import com_default from 'zn-image/examImg/com_default.png';
import default1 from 'zn-image/examImg/default1.png';
import default2 from 'zn-image/examImg/default2.png';
import * as actions from '../action/ExamIntroductionAction';

const ExamIntroductionShow = React.createClass({
    formatDate(str){
        const time = new Date(parseInt(str));
        let   year=time.getYear()+1900;
        let   month=time.getMonth()+1;
        month=month<10?'0'+month:month;
        let   date=time.getDate();
        date=date<10?'0'+date:date;
        let   hour=time.getHours();
        hour=hour<10?'0'+hour:hour;
        let   minute=time.getMinutes();
        minute=minute<10?'0'+minute:minute;
        let   second=time.getSeconds();
        second=second<10?'0'+second:second;
        return   year+"."+month+"."+date+"   "+hour+":"+minute;
    },
    render() {
        const one = {
            title:'考试内容',
            src:'../../../img/examImg/icon_01.png',
            messageArray:[
                {
                    label:'试题数量',
                    text:this.props.message.questionNum?this.props.message.questionNum:'',
                },
                {
                    label:'考试时间',
                    text:this.props.message.examTime?this.props.message.examTime+'分钟':'不限时',
                }
            ],
        };
        const two = {
            title:'合格标准',
            src:'../../../img/examImg/icon_02.png',
            messageArray:[
                {
                    label:this.props.message.totalScore?this.props.message.totalScore+'分满分':'分满分',
                    text:' '
                },
                {
                    label:(this.props.message.minScore && parseInt(this.props.message.minScore)!=0)?this.props.message.minScore+'分及格':'分及格',
                    text:' '
                }
            ],
        };
        const three = {
            title:'开放时间',
            src:'../../../img/examImg/icon_03.png',
            messageArray:[
                {
                    label:'开始时间',
                    text:this.props.message.startTime?this.formatDate(this.props.message.startTime):'',
                },
                {
                    label:'结束时间',
                    text:this.props.message.endTime?this.formatDate(this.props.message.endTime):'',
                }
            ],
        };
        let photo = this.props.userInfo&&this.props.userInfo.photo?this.props.userInfo.photo:'';
        photo = photo?(photo.indexOf('default1')!=-1?default1:(photo.indexOf('default2')!=-1?default2:photo)):com_default;
        return(
            <div className="exam-introduction-show">
                <div className="exam-introduction-top">
                    <p className="exam-introduction-text">{this.props.message.examName?this.props.message.examName:''}</p>
                    <p className="exam-introduction-tip">{this.props.message.examType=='F'?('您有'+this.props.message.remainNum+'次考试的机会'):''}</p>
                    <div className="exam-introduction-people">
                        <span className="exam-introduction-name">{this.props.userInfo.userName?this.props.userInfo.userName:''}</span>
                        <img className="exam-introduction-img" src={photo}/>
                    </div>
                </div>
                <div className="exam-introduction-message">
                    <ExamIntroductionCard {...one}/>
                    <ExamIntroductionCard {...two}/>
                    {this.props.message.examType=='F'?<ExamIntroductionCard {...three}/>:null}
                </div>
            </div>
        );
    }
});

export default ExamIntroductionShow;