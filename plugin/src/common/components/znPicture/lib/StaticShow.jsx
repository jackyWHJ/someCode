import React from 'react';
import { Grid } from 'antd-mobile';
import "../style/index.scss"
import _ from 'lodash'

let show={}

let primary={}

const StaticShow=React.createClass({
    index:0,
    realPics:[],
    realNames:[],
    getInitialState(){
        return{
            width:0,
            //realPics:[],
        }
    },
    componentWillMount(){
        let width = document.documentElement.clientWidth;
        this.setState({width})
    },

    show(index,flag,load){
        let name="img"+index;
        if(flag=="show"){
            show[index] = []
            show[index][0] = this.refs.grid.refs[name].width;
            show[index][1] = this.refs.grid.refs[name].height;
            this.realPics[index]=this.props.imgsSrc[index];
            this.realNames[index]=this.props.imgsName[index];
        }else if(flag=="primary"){
            if(load=="s") {
                primary[index] = []
                primary[index][0] = this.refs[name].width;
                primary[index][1] = this.refs[name].height;
            }
            else if(load=="e"){
                this.realPics.splice(index,1)
            }
        }
    },

    callBack(dataItem,index){
        let i = 0;
        if(this.realPics[index] &&this.realPics[index]==dataItem.img){
            i = index;
        }else{
            let length = this.realPics.length;
            for(let j=0;j<length;++j){
                if(this.realPics[j]==dataItem.img){
                    i = j;
                }
            }
        }
        this.props.callback(i,show,primary,this.realPics,this.realNames)
    },

    componentDidMount(){
        let _this = this;

        this.props.imgsSrc.forEach((item,index)=>{
            let name="img"+index;
            _this.refs[name].onload=function(){
                _this.refs[name].onload =null;
                _this.show(index,"primary","s")
            }
            _this.refs[name].onerror=function(){
                _this.show(index,"primary","e")
                //console.log(item+"不存在");
                return;
            }
            _this.refs.grid.refs[name].onerror=function(){
                //console.error(item+"不存在");
                //_this.show(index,"show","e")
                return;
            }
            _this.refs.grid.refs[name].onload=function(){
                _this.refs.grid.refs[name].onload =null;
                _this.show(index,"show")
            }
        })
        if(this.props.stWidth!=0){
            this.refs.static.style.width=parseInt(this.props.stWidth)+"px";
        }
        if(this.props.stHeight!=0){
            this.refs.static.style.height=parseInt(this.props.stHeight)+"px";
        }
    },

    render(){
        let data1 =this.props.imgsSrc.map((item,index)=>({
                img:item,
                text:this.props.imgsName[index]
            }))
        let textEle = (dataItem)=>{
               return (this.props.imgsName.length!=0)?<div style={{ background: 'rgba(0, 0, 0, 0.1)', padding: '0.08rem' }}><span>{dataItem.text}</span></div>:null;
            }
        let imgs = this.props.imgsSrc.map((item,index)=>{   //处理Grid包装之后获取到的图片无法得到原始大小
                return(
                <div key={index} style={{display:"none"}}>
                    <img ref={"img"+index} src={item}/>
                </div>)
            })
        //console.log(this.props.columnNum)
        return(
                <div ref="static" className={this.props.stClass}>
                    <Grid ref="grid" data={data1} columnNum={this.props.columnNum} hasLine={this.props.hasLine}
                        renderItem={(dataItem, index) => (
                            <div style={{ margin: '0.16rem', background: '#f7f7f7', textAlign: 'center' }} onClick={()=>this.callBack(dataItem,index)}>
                                <img src={dataItem.img} ref={"img"+index} style={{ width: '80%', margin: '0.12rem' }}/>
                                {textEle(dataItem)}
                            </div>
                        )}
                    />
                    {imgs}
                </div>
            )
        }
    })
export default StaticShow;

/*<div style={{ margin: '0.16rem', background: '#f7f7f7', textAlign: 'center' }}>
 <div style={{ background: 'rgba(0, 0, 0, 0.1)', padding: '0.08rem' }}>
 <span>{index + 1}.{dataItem.text}</span>
 </div>
 <img src={dataItem.img} style={{ width: '80%', margin: '0.12rem' }} />
 </div>*/