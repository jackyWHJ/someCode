import { Carousel, WhiteSpace,Toast } from 'antd-mobile';
import React from 'react'
import '../style/index.scss'

var selectedIndex = 0;
var sum = 0;
var inter = null;

const DynamicShow=React.createClass({
    startX:0,
    endX:0,
    moveX:0,
    startT:null,
    endT:null,
    martop:0,
    ps:0,
    getDefaultProps(){
        return{
            index: 0,
        }
    },
    getInitialState(){
        return{
            //selectedIndex:this.props.index,
            current:this.props.index,
            first:true,
            screenWidth:this.props.dyWidth||0,
            screenHeight:this.props.dyHeight||0,
            infinite:this.props.infinite||true,
        }
    },

    componentWillMount(){
        Toast.loading('加载中...',0);
        console.log(document.documentElement.clientWidth)
        selectedIndex = this.props.index;
        sum = 0;
        if(this.state.screenWidth==0){
            let screenWidth = document.documentElement.clientWidth;
            this.setState({screenWidth})
        }
        if(this.state.screenHeight==0){
            let screenHeight = document.documentElement.clientHeight;
            this.setState({screenHeight})
        }
    },

    set(){
        let index = selectedIndex;
        let dpr= Util.getDeviceDPR();

        /*if(this.props.primaryArr[index][0]>=this.props.primaryArr[index][1]){
            if(this.props.primaryArr[index][0]*dpr<this.state.screenWidth){
                this.refs["img"+index].style.width=this.props.primaryArr[index][0]*dpr+"px";
            }else{
                this.refs["img"+index].style.width=this.state.screenWidth+"px";
            }
        }else{
            if(this.props.primaryArr[index][1]*dpr<this.state.screenHeight){
                this.refs["img"+index].style.height=this.props.primaryArr[index][1]*dpr+"px";
            }else{
                this.refs["img"+index].style.height=this.state.screenHeight+"px";
            }
        }*/

        this.props.imgsSrc.map((item,index_1)=> {
            if(this.state.first){
                this.refs['img' + index_1].style.display = "none";
            }
            else{
                if(index==index_1)
                    this.refs['img'+index_1].style.display= "block";
                else
                    this.refs['img'+index_1].style.display= "none";
            }
            /*if(this.state.first) {
                if(this.props.primaryArr[index_1][0]>=this.props.primaryArr[index_1][1]){
                    if(this.props.primaryArr[index_1][0]*dpr<this.state.screenWidth){
                        this.refs["img"+index_1].style.width=this.props.primaryArr[index_1][0]*dpr+"px";
                    }else{
                        this.refs["img"+index_1].style.width=this.state.screenWidth+"px";
                    }
                    //this.refs["img"+index_1].style.height="auto";
                }else{
                    if(this.props.primaryArr[index_1][1]*dpr<this.state.screenHeight){
                        this.refs["img"+index_1].style.height=this.props.primaryArr[index_1][1]*dpr+"px";
                    }else{
                        this.refs["img"+index_1].style.height=this.state.screenHeight+"px";
                    }
                }//this.props.primaryArr[index_1][1] * dpr
                if (this.refs["img"+index_1].style.height!=0) {
                    this.refs["img" + index_1].style.marginTop = (this.martop - this.refs["img"+index_1].style.height / 2) + "px";
                }
                else {
                    if(this.martop - this.props.primaryArr[index_1][1] * dpr / 2<0)
                        this.refs["img" + index_1].style.marginTop =this.martop - parseInt(this.refs["img"+index_1].style.width) / 2 + "px";
                    else
                    this.refs["img" + index_1].style.marginTop = this.martop - this.props.primaryArr[index_1][1] * dpr / 2 + "px";
                }
                console.log(this.refs["img" + index_1].style.marginTop)
            }*/
        })

        //this.refs["img"+index].style.marginTop = this.state.screenHeight>(this.props.primaryArr[index][1]*dpr)?(this.state.screenHeight-this.props.primaryArr[index][1]*dpr)/dpr/2+"px":(this.props.primaryArr[index][1]*dpr-this.state.screenHeight)/dpr/2+"px";
        /*this.refs["img"+index].style.marginTop = this.state.screenHeight>(this.props.primaryArr[index][1]*dpr)?(this.state.screenHeight-this.getMaxHeight()*dpr)/dpr/2+"px":(this.getMaxHeight()*dpr-this.state.screenHeight)/dpr/2+"px";*/
        //this.refs["img"+index].style.marginTop = this.state.screenHeight/2+"px";

        this.refs.carousel.style.width = this.props.primaryArr[index][0]*dpr+"px";//+"px";this.getWrapWidth()
        this.refs.carousel.style.margin="0 auto";
        this.refs.wrap.style.marginTop = (this.props.primaryArr[index][1]*dpr/2)*-1+"px";
    },

    getMaxHeight(){
        let i = 0;
        let dpr= Util.getDeviceDPR();
        let arr = this.props.primaryArr;
        for(var j=1;j<arr.length-1;++j){
            if(arr[i][1]<=arr[j][1]){
                i=j;
            }
        }
        return this.props.primaryArr[i][1]*dpr;
    },

    getWrapWidth(){
        let i = 0;
        let dpr= Util.getDeviceDPR();
        let arr = this.props.primaryArr;
        for(var j=1;j<arr.length-1;++j){
            if(arr[i][0]<=arr[j][0]){
                i=j;
            }
        }
        if(arr[i][0]*dpr<this.state.screenWidth){
            return arr[i][0]*dpr;
        }else{
            return this.state.screenWidth;
        }
    },

    componentDidMount()
    {
        let index = selectedIndex;
        this.refs.img.style.width = this.props.showArr[index][0]+"px";
        let dpr= Util.getDeviceDPR();
        this.refs.img.style.marginTop = (this.state.screenHeight/2-this.props.showArr[index][1]/2*dpr)/dpr+"px";
        this.refs.img.style.marginLeft = (this.state.screenWidth-this.props.showArr[index][0]*dpr)/2+"px";
        this.martop = (this.props.showArr[index][1]*dpr/2) + parseInt(this.refs.img.style.marginTop);
        //console.log("this.martop：",this.martop)
        this.refs.img.style.marginLeft = (this.state.screenWidth-this.props.showArr[index][0]*dpr)/2+"px";

        this.refs.wrap.style.width = this.state.screenWidth+"px";
        this.refs.allWrap.style.height = this.state.screenHeight+"px";

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

    show(){
        if(selectedIndex<this.props.imgsSrc.length-1){
            selectedIndex = selectedIndex+1;
            this.setState({current:selectedIndex})
            this.set();
        }
    },

    start(e){
        this.startX = e.changedTouches[0].clientX;
        //console.log("starX：",this.startX)
        this.startT = e.timeStamp;
    },
    end(e){
        this.endX = e.changedTouches[0].clientX;
        this.endT = e.timeStamp;
        let isRun = false;
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

    move(e){
        this.moveX=e.changedTouches[0].clientX;
        //console.log("change：",this.moveX-this.startX)
        if(this.moveX>=0&&this.moveX<=this.state.screenWidth){
            let changeX = this.moveX-this.startX;
            let dpr= Util.getDeviceDPR();
            //let pp=this.state.screenWidth>this.props.primaryArr[selectedIndex][0]*dpr?(this.state.screenWidth-this.props.primaryArr[selectedIndex][0]*dpr):this.state.screenWidth;
            let ps = Math.abs(this.state.screenWidth-this.refs["img"+selectedIndex].width)/2;
            this.ps = ps;
            console.log("ps",ps)
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
            <div className="all-wrap" ref="allWrap" onClick={this.callback}>
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
