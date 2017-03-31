import { Carousel, WhiteSpace } from 'antd-mobile';
import React from 'react'
import '../style/index.scss'
import Dynamic from './DynamicShow.jsx'
import Static from './StaticShow.jsx'

const ZnPicture=React.createClass({
    getDefaultProps(){
        return{
            imgsSrc:[],     //图片源

            imgsName:[],    //与图片源对应的图片名称
            stClass:"",   //静态展示类名
            dyClass:"",     //动态展示类名
            dyWidth:0,          //动态显示的大小
            dyHeight:0,
            dyBackgroundColor:"#f1f1f1",    //动态显示图片时背景颜色
            stWidth:0,  //静态显示的大小
            stHeight:0,
            infinite:true, //是否循环播放图片
            columnNum:2,    //静态显示图片时每行显示的列数
            hasLine:false,   //静态显示图片时是否显示边线
            classTest:"",
        }
    },
    getInitialState(){
        return{
            showStatic: true,   //动态显示和静态显示之间切换
            showArr:[],
            primaryArr:[],
            index:0,        //显示第几个图片
            realPics:[],     //真正有效的图片（用于动态查看）
            realNames:[],
        }
    },

    stat_callback(index,show,primary,realPics,realNames){
        document.getElementsByTagName('html')[0].style.overflow='hidden';
        this.setState({showStatic: !this.state.showStatic,showArr:show,primaryArr:primary,index,realPics,realNames})//
    },

    dyn_callback(){
        document.getElementsByTagName('html')[0].style.overflow='auto';
        this.change();
    },

    componentDidMount()
    {

    },

    change(){
        this.setState({showStatic: !this.state.showStatic})
    },

    render(){
        const DyProps={
            imgsSrc:this.state.realPics,
            imgsName:this.state.realName,
        }
        return (
            <div>
                {this.state.showStatic?<Static {...this.props} callback={this.stat_callback} />:<Dynamic {...this.props} {...this.state} callback={this.dyn_callback} imgsSrc={this.state.realPics}/>}
            </div>
            )
        }
})

export default ZnPicture;
