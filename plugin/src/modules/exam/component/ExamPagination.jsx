import React from 'react';
import createContainer from 'zn-container';
import { Pagination,Icon} from 'antd-mobile';
import icon_previous2 from 'zn-image/examImg/icon_previous2.png';
import icon_previous from 'zn-image/examImg/icon_previous.png';
import icon_next2 from 'zn-image/examImg/icon_next2.png';
import icon_next from 'zn-image/examImg/icon_next.png';

const PropTypes = React.PropTypes;
const ExamPagination = React.createClass({
    propTypes: {
        current:PropTypes.number,
        total:PropTypes.number,
        prevText:PropTypes.object,
        nextText:PropTypes.object,
        //onChange:PropTypes.function,
    },
    getDefaultProps(){
        return {
            current:1,
            total:0,
        }
    },
    getInitialState(){
        return {
            current:this.props.current,
        }
    },
    componentWillReceiveProps(nextProps){
        if(this.props.current!=nextProps.current&&nextProps.current){
            this.setState({current:nextProps.current});
        }
    },
    onChange(e){
        if(this.props.onChange){
            this.props.onChange(e-1);
        }
        this.setState({current:e});
    },
    render(){
        const preDisabled = this.props.total>0&&this.state.current==1;
        const defaultLeft = (
            <div>
                <img src={preDisabled?icon_previous2:icon_previous}/>
                <span className={(preDisabled)?"pre-disabled":""}>上一步</span>
            </div>
        );
        const midDisabled = !this.props.total||this.props.total==0;
        const defaultMiddle = (
            <div className="middle-show">
                <span>{midDisabled?'000':(this.state.current<10?('0'+this.state.current):this.state.current)}</span>
                <span>/</span>
                <span>{midDisabled?'000':(this.props.total<10?('0'+this.props.total):this.props.total)}</span>
            </div>
        );
        const nextDisabled = this.props.total>0&&this.state.current==this.props.total;
        const defaultRight = (
            <div>
                <span className={nextDisabled?"next-disabled":""}>下一步</span>
                <img src={nextDisabled?icon_next2:icon_next}/>
            </div>
        );
        return (
            <div className="exam-pagination">
                <div className="left">
                    <div className={"left-show"+(preDisabled?' disabled':'')} onClick={preDisabled?null:this.onChange.bind(this,this.state.current-1)}>
                        {this.props.prevText?this.props.prevText:defaultLeft}
                    </div>
                </div>
                <div className="middle">
                    {defaultMiddle}
                </div>
                <div className="right">
                    <div className={"right-show"+(nextDisabled?' disabled':'')} onClick={nextDisabled?null:this.onChange.bind(this,this.state.current+1)}>
                        {this.props.nextText?this.props.nextText:defaultRight}
                    </div>
                </div>
            </div>
        );
    }
});

export default ExamPagination;