import React from 'react';


import { Icon } from 'antd-mobile';

import ZnImage from 'zn-component/znImage';




const QuestionnaireListItem = React.createClass({


  getDefaultProps() {
    return {
      backgroundColor: "#fff",//背景颜色默认白色
      borderBottom: "0.02rem solid #e9e9e9",//默认底部边框
    };
  },


  render(){
    return (
      <div className="questionnaire-list-item" style={{
        borderBottom: this.props.borderBottom,
        backgroundColor: this.props.backgroundColor,
      }}>
        <div className="questionnaire-list-pic">{/*<img src={this.props.img} alt={this.props.intgName}/>*/}<ZnImage src={this.props.img}/></div>
        <div className="questionnaire-list-item-title">{this.props.intgName}</div>
        <div className="questionnaire-list-item-icon"><p className={this.props.istested==1?"":"unfinish"}></p><p>{this.props.istested==1?"已完成":"去作答"}</p></div>
      </div>
    )
  }
});





export default QuestionnaireListItem;