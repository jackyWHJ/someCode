import React from 'react'
import createContainer from 'zn-container';
import ZnListItem from 'zn-component/znListItem';
import * as actions from '../action/ExamHistoryAction.jsx';
import ZnNavBar from 'zn-component/znNavBar'
import '../style/examHistory.scss'

const ExamHistory = React.createClass({
    componentWillMount(){

    },
    componentDidMount()
    {
        let _this=this;
        this.refs.img.onerror=function(){
            _this.refs.img.src=require('zn-image/default_user.png');//"../../../img/default_user.png";
        }
        this.props.actions.loadUserInfo();
        this.props.actions.loadExamInfo(this.props.params.id);
    },

    render(){
        const item=(
                <ZnListItem className="exam-list-item"
                    borderBottom={".03rem dashed #999"}
                    leftContent={<img src={this.props.photo} ref="img"  alt=""/>}
                    title={this.props.userName}
                    subTitle={this.props.examName}
                />
        )
        let arrs= (this.props.examArr.length!=0)&&this.props.examArr.map((item,index,arr)=>{

                return (
                    <li key={index} className={"item "+(item.status=="Y"?"":"fail")}>
                        <span className="time">{item.completeDate}</span>
                        <span className="score"><span className="value">{item.score}</span>分</span>
                        <span className="status">{item.status=="Y"?"已通过":"未通过"}</span>
                    </li>
                )
        })
        var dpr = Util.getDeviceDPR();
        let height=  document.documentElement.clientHeight - 166*dpr
        return(
            <div className="exam-history" style={{height:document.documentElement.clientHeight,overflow:'hidden'}}>
                <ZnNavBar>历史成绩</ZnNavBar>
                {item}
                <div style={{height:height,overflowY:'auto'}} className="content">
                    <ul >
                        {arrs}
                    </ul>
                </div>
            </div>
        )
    }
})

export default createContainer('exam.examHistory',actions,{
    examName:"",
    examArr:[],
    userName:"",
    photo:"",
}).bind(ExamHistory);