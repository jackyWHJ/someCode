import React from 'react';
 import '../style.scss';
import ZnImage from 'zn-component/znImage'
//此组件主要用于课程专题列表的元组件，可用于其他业务模块
const ZnFullSubjectCell = React.createClass({
    getDefaultProps(){
        return{
            imgSrc: "",
            title:'',
            viewNum: 0
        }
    },//<img src={this.props.imgSrc}/>
    render(){
        return(
            <div className='subject-cell'  >
                <ZnImage src={this.props.imgSrc}/>
                <div className='subject-cell-info' >
                    <span className='cell-title'>{this.props.title}</span>
                    <span className='view-cell' style={this.props.view}><i></i>{this.props.viewNum}</span>
                </div>
            </div>
            
        );
    }
});

ZnFullSubjectCell.propTypes = {
    imgSrc: React.PropTypes.string,
    title: React.PropTypes.string,
    viewNum: React.PropTypes.string
};

export default ZnFullSubjectCell;