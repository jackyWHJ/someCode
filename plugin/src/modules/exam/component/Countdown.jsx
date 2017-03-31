import React from 'react';
import createContainer from 'zn-container';
import { Toast, Modal} from 'antd-mobile';

const Countdown = React.createClass({
    getInitialState(){
        return {
            hours:'00',
            minutes:'00',
            seconds:'00'
        }
    },
    componentWillReceiveProps(nextProps){
        if(this.props.examTime!=nextProps.examTime&&nextProps.examTime){
            //this.startTime = Date.parse(new Date());
            //this.endTime = Date.parse(new Date())+parseInt(nextProps.examTime*60*1000);
            this.remainderTime(nextProps.examTime);
        }
    },
    remainderTime(time){
        const that = this;
        this.setInterval=setInterval(() => {
            //const now =  Date.parse(new Date());
            if(time==0){ //that.endTime <= now
                if(that.props.sureSubmit){
                    Toast.info('考试时间到！',1);
                    that.props.sureSubmit();
                    clearInterval(that.setInterval);
                }
                return;
            }
            let remainderTime = time;//(that.endTime - now)/1000;
            let hours = parseInt(remainderTime/(60*60));
            remainderTime = remainderTime-hours*60*60;
            hours = hours<10?('0'+hours):hours;
            let minutes = parseInt(remainderTime/60);
            remainderTime = remainderTime-minutes*60;
            minutes = minutes<10?('0'+minutes):minutes;
            let seconds = remainderTime;
            seconds = seconds<10?('0'+seconds):seconds;
            this.setState({hours,minutes,minutes,seconds});
            time = time-1;
        }, 999);
    },
    render(){
        return (
            <div className="remainder-time">
                <span className="time-span">{this.state.hours}</span>
                <span className="parting-span">:</span>
                <span className="time-span">{this.state.minutes}</span>
                <span className="parting-span">:</span>
                <span className="time-span">{this.state.seconds}</span>
            </div>
        );
    },
    componentWillUnmount(){
        clearInterval(this.setInterval);
    }
});

export default Countdown;