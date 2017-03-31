import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import {CONST} from '../../constants';


const ZNHeader = React.createClass({

    //  默认返回
    onLeftClick(){
        if(this.props.onLeftClick){
            this.props.onLeftClick(function(num = -1){
                window.history.go(-1);
            });
        }else{
            window.history.go(-1);
        }
    },

    render(){
        const { onLeftClick, navBar, actions, containerActions, children ,leftContent , ..._props } = this.props;

        let domFontSize = parseFloat(document.documentElement.style.fontSize);      //  根节点font-size
        let eleRate = domFontSize/100;                                              //  高度倍数

        //  控制显示的标题
        let title = this.props.title || <div><span style={{color:"red"}}>知鸟</span></div>;
        let rightContent = this.props.rightMenu || [];


        return (
            <NavBar leftContent="" style={{height:CONST.NAVBAR_HEIGHT*0.01*eleRate+'rem'}} mode="light" onLeftClick={this.onLeftClick}
                rightContent={rightContent} {..._props}
                >{title}</NavBar>
        );
    }
});

export default ZNHeader;