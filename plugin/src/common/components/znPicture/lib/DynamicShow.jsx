import { Carousel, WhiteSpace,Toast } from 'antd-mobile';
import React from 'react'
import '../style/index.scss'

var selectedIndex = 0;
var sum = 0;
var inter = null;

const DynamicShow=React.createClass({
    //记录滑动数据
    startX:0,
    endX:0,
    moveX:0,
    startT:null,
    endT:null,
    //记录滑动开始时
    ps:0,
    index:0,
    getDefaultProps(){
        return{
            index: 0,
        }
    },
    getInitialState(){
        return{
            //selectedIndex:this.props.index,
            current:this.props.index,
            first:true,     //是否第一次设置
            screenWidth:parseInt(this.props.dyWidth)||0,  //屏幕宽度和高度
            screenHeight:parseInt(this.props.dyHeight)||0,
            infinite:this.props.infinite||true, //是否循环
        }
    },

    componentWillMount(){
        Toast.loading('加载中...',0);
        console.log(document.documentElement.clientWidth)
        selectedIndex = this.props.index;
        /*let keys = this.props.imgsSrc.keys();
        for(let i=0;i<keys.length;++i){
            if(keys[i]==selectedIndex){
                this.index=i;
            }
        }*/
        sum = 0;
        //设置屏幕宽度和高度
        if(this.state.screenWidth==0){
            let screenWidth = document.documentElement.clientWidth;
            this.setState({screenWidth})
        }
        if(this.state.screenHeight==0){
            let screenHeight = document.documentElement.clientHeight;
            this.setState({screenHeight})
        }
    },
    //设置每次图片显示的参数
    set(){
        let index = selectedIndex;
        let dpr= Util.getDeviceDPR();
        this.props.imgsSrc.map((item,index_1)=> {
            //如果刚进去就所有大图都不显示，否则轮询显示
            if(this.state.first)
            {
                this.refs['img' + index_1].style.display = "none";
            }
            else
            {
                if (index == index_1)
                    this.refs['img' + index_1].style.display = "block";
                else
                    this.refs['img' + index_1].style.display = "none";
            }
        })
        this.refs.carousel.style.width = this.props.primaryArr[ Object.keys(this.props.primaryArr)[index] ][0]*dpr+"px";
        console.log(this.props.primaryArr[ Object.keys(this.props.primaryArr)[index] ][0])
        this.refs.carousel.style.margin="0 auto";
        this.refs.wrap.style.marginTop = (this.props.primaryArr[ Object.keys(this.props.primaryArr)[index] ][1]*dpr/2)*-1+"px";
        //this.refs.wrap.style.marginTop = (this.props.primaryArr[ Object.keys(this.props.primaryArr)[index] ][1]/2)*-1+"px";
    },

    componentDidMount()
    {
        let index = selectedIndex;
        this.refs.img.style.width = this.props.showArr[ Object.keys(this.props.showArr)[index] ][0]+"px";
        //let dpr= Util.getDeviceDPR();
        //设置压缩图的位置
        //this.refs.img.style.marginTop = (this.state.screenHeight/2-this.props.showArr[ Object.keys(this.props.showArr)[index] ][1]/2*dpr)/dpr+"px";
        //this.refs.img.style.marginLeft = (this.state.screenWidth-this.props.showArr[ Object.keys(this.props.showArr)[index] ][0]*dpr)/2+"px";
        this.refs.img.style.marginTop = (this.state.screenHeight/2-this.props.showArr[ Object.keys(this.props.showArr)[index] ][1]/2)+"px";
        this.refs.img.style.marginLeft = (this.state.screenWidth-this.props.showArr[ Object.keys(this.props.showArr)[index] ][0])/2+"px";

        this.refs.wrap.style.width = this.state.screenWidth+"px";
        /*this.refs.allWrap.style.height = this.state.screenHeight+"px";
        this.refs.allWrap.style.width = this.state.screenWidth+"px";*/
        //计算图片加载完全数目
        this.props.imgsSrc.map((item,index_1)=>{
            if(!this.refs['img'+index_1].complete){
                this.refs['img'+index_1].onload=function(){
                    sum+=1;
                }
            }else{
                sum+=1;
            }
        })

        this.set();
        let _this = this;
        //在所有图片加载完全之后显示大图，并且清楚加载状态和计时器
        inter=setInterval(function(){
            if(sum==_this.props.imgsSrc.length){
                _this.refs.img.style.display="none";
                _this.refs['img'+selectedIndex].style.display= "block";
                if(inter){
                    clearInterval(inter);
                    inter=null;
                    _this.setState({first:false})
                }
                Toast.hide();
            }
        },200)
    },
    //开始触摸屏幕
    start(e){
        this.startX = e.changedTouches[0].clientX;
        this.startT = e.timeStamp;
    },
    //结束拖动屏幕
    end(e){
        this.endX = e.changedTouches[0].clientX;
        this.endT = e.timeStamp;
        let isRun = false;
        //判断是否切换图片
        if(Math.abs(this.endX-this.startX)>this.state.screenWidth/3 ){
            isRun = true;
        }else if(this.endT-this.startT<1000){
            isRun = true;
        }else{
            this.refs.carousel.style.marginLeft = this.ps+"px";
        }
        if(isRun) {
            if (this.endX - this.startX < 0) {
                if (!this.state.infinite) {
                    if (selectedIndex < this.props.imgsSrc.length - 1) {
                        selectedIndex = selectedIndex + 1;
                    }
                } else {
                    if (selectedIndex == this.props.imgsSrc.length - 1) {
                        selectedIndex = 0;
                    } else {
                        selectedIndex = selectedIndex + 1;
                    }
                }
                this.setState({current: selectedIndex})
                this.set();
            } else if (this.endX - this.startX > 0) {
                if (!this.state.infinite) {
                    if (selectedIndex > 0) {
                        selectedIndex = selectedIndex - 1;
                    }
                } else {
                    if (selectedIndex == 0) {
                        selectedIndex = this.props.imgsSrc.length - 1;
                    } else {
                        selectedIndex = selectedIndex - 1;
                    }
                }
                this.setState({current: selectedIndex})
                this.set();
            }
        }
        this.endX=this.startX=this.moveX=0;
        this.startT=this.endT=null;
    },
    //拖动屏幕过程
    move(e){
        this.moveX=e.changedTouches[0].clientX;
        //console.log("change：",this.moveX-this.startX)
        if(this.moveX>=0&&this.moveX<=this.state.screenWidth){
            let changeX = this.moveX-this.startX;
            let dpr= Util.getDeviceDPR();
            let ps = Math.abs(this.state.screenWidth-this.refs["img"+selectedIndex].width)/2;
            this.ps = ps;
            //console.log("ps",ps)
            if((ps+changeX) <= -this.refs["img"+selectedIndex].width/2){
                return;
            }
            this.refs.carousel.style.marginLeft = ps+changeX+"px";
        }
    },

    callback(){
        this.props.callback();
    },

    render(){
        let indexDf = selectedIndex;
        return(
            <div className={"all-wrap "+this.props.dyClass} ref="allWrap" onClick={this.callback}>
                <div className="wrap" ref="wrap" onTouchStart={this.start} onTouchEnd={this.end} onTouchMove={this.move}>
                    <div className="carousel" ref="carousel" style={{position:"relative"}}>
                        {
                            this.props.imgsSrc.map((item,index) => {
                                return (
                                <div key={index}>
                                    <img src={item} ref={"img"+index}/>
                                </div>)
                            })
                        }
                    </div>
                    <div className="swiper-pagenation">
                        {
                            this.props.imgsSrc.map((item,index) => {
                                return (
                                    <a key={index} href="javascript:;" className={index==indexDf?"active":""}></a>
                                )
                            })
                        }
                    </div>
                </div>
                <img className="cs-modal-content" src={this.props.imgsSrc[indexDf]} ref="img"/>
            </div>
        )
    } 
})

export default DynamicShow;

/*
<Carousel className="my-carousel cs-modal-content" ref="car" autoplay={false} selectedIndex={index}
beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
afterChange={index => console.log('slide to', index)}>
{this.props.imgsSrc.map((item,index) => (
<div key={index}>
    <a href="javascript:;"><img ref={"img"+index} src={`${item}`} /></a>
<div>{this.props.imgsName?this.props.imgsName[index]:""}</div>
</div>
))}
</Carousel>*/
