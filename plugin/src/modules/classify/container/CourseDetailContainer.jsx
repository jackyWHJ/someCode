import React from 'react';
import { SegmentedControl,WingBlank,WhiteSpace,Modal,Toast } from 'antd-mobile';
import createContainer from 'zn-container';
import ZnNavBar from 'zn-component/znNavBar';
import Iframe from 'zn-component/iframe';
import * as actions from '../action';
import { keysMap, keysObjMap } from '../dataConfig';
import CommentContainer from '../../comment/container/CommentContainer.jsx';
import defImg from 'zn-image/defaultImg.png';
import course_play0 from 'zn-image/bgImg/course_play0@2x.png';
import left_icon_1 from 'zn-image/bgImg/left_icon_1@2x.png';
import detail_nav_flower from 'zn-image/bgImg/detail_nav_flower@2x.png';
import detail_nav_flower_pressed from 'zn-image/bgImg/detail_nav_flower_pressed@2x.png';
import detail_star_pressed from 'zn-image/bgImg/detail_star_pressed@3x.png';
import detail_star_normal from 'zn-image/bgImg/detail_star_normal@3x.png';

import '../style/detail.scss'

const CourseDetailContainer = React.createClass({

	getInitialState() {
        return {
            segmValue: 0,
            visible: false,
            showPlay: false,
            showPlay2: false,
            playUrl:'',
            starValue: 0,
            isRated: 'N',
            isCompleted: 'N',
        };
    },

	componentDidMount() {
		this.props.actions.queryCourseDetail({courseId: this.props.params.courseId},(course)=>{
			this.setState({starValue: course.rating, isRated: course.isRated, isCompleted: course.isCompleted});
		});
	},

	componentWillUnmount() {
		this.props.actions.triggerCourseDetail(this.props.course);
	},
	// 组件销毁时清空redux
	clearWhenUmnount(){
		return true;
	},

	createObj(score){
		let floor = Math.floor(score);
		let ceil = Math.ceil(score);
		let obj = floor==ceil ? new Array(floor) : new Array(ceil) ;
		for(let i=0; i<ceil; i++){
			if(i != ceil-1){
				obj[i] = 'full';
			}else{
				obj[i] = 'half';
			}
		}
		return obj;
	},

	onChange(e){
		this.setState({segmValue: e.nativeEvent.selectedSegmentIndex});
	},

	onValueChange(value){

	},

	onClose(){
		this.setState({visible: !this.state.visible});
	},

	onShow(){
		this.updateCourseComment();
		// this.setState({visible: !this.state.visible});
		// 调试好后去掉注释
		if(this.state.isCompleted=='N'){
			// this.setState({starValue: 0});
			Toast.info('先学完再评分哦!', 2);
		}else{
			this.setState({visible: !this.state.visible});
		}
	},
	// 课程评分
	giveAMark(mark){
		if(this.state.starValue>0){
			this.onClose();
			setTimeout(()=>{this.setState({isRated: 'Y', isCompleted: 'Y'});}, 200);
			//调用评分接口
			this.props.actions.submitMark({courseId: this.props.params.courseId, rating: this.state.starValue}, ()=>{
				// 评分成功后更新redux中的课程对象
				let course = {...this.props.course, isRated: 'Y'};
				this.props.actions.updateCourseDetail(course);
				
			}, ()=>{});
		}
	},

	changeStar(e){
		e.stopPropagation();
		if(this.state.isRated=='N'){
			let score = e.target.getAttribute('value');
			if(this.state.starValue >= score){
				this.setState({starValue: --score});
			}else{
				this.setState({starValue: score});
			}
		}	
	},
	// 创建课件列表
	createLi(obj, i){
		let size = this.props.course.courseFileArr.length;
		let imgUrl = course_play0;
		let imgType = left_icon_1;
		let divclass = '';

		/**
			if (sType.equalsIgnoreCase("text/html")) {
			   ErrLog.saveInfo("", true, ErrLog.BUSINESS_START, "MyPage_025",
			        System.currentTimeMillis());
			} else if (sType.equalsIgnoreCase("3mv")
			      || sType.equalsIgnoreCase("mp4")
			      || sType.equalsIgnoreCase("audio/aac")) {
			   ErrLog.saveInfo("", true, ErrLog.BUSINESS_START, "MyPage_024",
			        System.currentTimeMillis());
			} else if (sType.equalsIgnoreCase("application/x-shockwave-flash")) {

			} else if (sType.equalsIgnoreCase("scorm")) {
			   ErrLog.saveInfo("", true, ErrLog.BUSINESS_START, "MyPage_026",
			        System.currentTimeMillis());
			} else {

			}
		*/

		// if(size > 1){
		// 	if(obj.type=='text/html'){
		// 		imgUrl = 'course_play1@2x.png';
		// 		imgType = 'image_course_icon@2x.png';
		// 	}else if(obj.type=='scorm'){
		// 		imgUrl = '';
		// 		imgType = '';
		// 	}else if(obj.type=='application/x-shockwave-flash'){
		// 		imgUrl = '';
		// 		imgType = '';
		// 	}else{
		// 		imgUrl = 'course_play0@2x.png';
		// 		imgType = 'left_icon_1@2x.png';
		// 	}
		// }

		if(i==size-1) divclass = 'nobtm';

		return <li key={`file${i}`} onClick={()=>{this.coursePlay(obj);}}><img src={`${imgUrl}`} /><div className={divclass} ><span>{obj.fileName}</span><span></span><img src={`${imgType}`} /></div></li>;
	},

	 /**
     * 根据课件的后缀名，判断用视频还是课件形式播放
     * @param coursefile
     */
    coursePlay(obj){
    	let playUrl = obj.playUrl;
        let type=0;
        if( /.mp4|.mp3|.ogg|.mpeg4|.webm/i.test(playUrl)){
            type=3;
        }else if( /.html|.htm/i.test(playUrl)){
            type=1;
        }else if( /.do/i.test(playUrl)){
            type=2;
        }
       
		// 提交后台改变学习完成状态
		if(this.props.course.isCompleted=='N'){
			this.props.actions.submitCompleted({courseId: obj.coursewareId}, ()=>{
				// 播放后更新redux中的课程对象
				let course = {...this.props.course, isCompleted: 'Y'};
				this.props.actions.updateCourseDetail(course);
				setTimeout(()=>{this.setState({isCompleted: 'Y'});}, 200);
			}, ()=>{});
		}

        // playUrl = playUrl.replace('http://test-mlearning.pingan.com.cn:45080/','http://hrmsv3-mlearning-dmzstg1.pingan.com.cn/'); 
        if(type==3) {
            let oVideo = document.getElementById('cs-video');
            oVideo && oVideo.play();
            this.setState({showPlay2: true, playUrl: playUrl});
        }
        else{

        	this.setState({showPlay: true, playUrl: playUrl});
       }
    },

    updateCourseComment(){
		// 评论后更新redux中的课程对象
		setTimeout(()=>{
			let course = {...this.props.course, totalComments: this.props.course.totalComments ? (parseInt(this.props.course.totalComments)+1)+'' : '1' };
			this.props.actions.updateCourseDetail(course);
		},0);
    },

	render() {
		let arry = this.state.isRated=='Y' ? [{text:'确定', onPress: ()=>{this.onClose();}}] : [{text:'暂不评分', onPress: ()=>{this.setState({starValue: 0}); this.onClose();}}, {text:'提交评分', onPress: ()=>{this.giveAMark();}}];

		let courseImg = this.props.course.imgUrl || '';
		//替换图片地址，开发用，上生产时去掉
		// courseImg = courseImg.replace('http://test-mlearning.pingan.com.cn:45080/','http://hrmsv3-mlearning-dmzstg1.pingan.com.cn/'); 
		return (
			<div className="zn-course-detail">
				<ZnNavBar className="app-bar" rightContent={[<img src={`${this.state.isRated=='N' ? detail_nav_flower : detail_nav_flower_pressed}`} key='flower' className="flower" onClick={this.onShow} />]}></ZnNavBar>
				<div className="banner">
					<div className="son-layout">
						<img src={courseImg} onError={(e)=>{ e.target.src = `${defImg}`}} />
						<ul className="left-ul">
							<li>{this.props.course.courseName}</li>
							<li>
								<ul>
									{ this.createObj(this.props.course.averageScore || 0).map((obj, i)=>{
										return <li className="rate-star" key={`star${i}`}></li>;
									})}
								</ul>
								<span>{this.props.course.averageScore || 0}分</span></li>
							<li>{this.props.course.devolopPersonName ? `作者：${this.props.course.devolopPersonName}` : ''}</li>
						</ul>
					</div>
				</div>
				<WhiteSpace size="md" />
				<WingBlank>
					<SegmentedControl values={['详情', '评论']} tintColor={'#848484'} onChange={this.onChange} onValueChange={this.onValueChange} selectedIndex={this.state.segmValue} />
					<WhiteSpace size="md" />
					<div style={{display: `${this.state.segmValue==0 ? '' : 'none'}`}}>
						<div className="introduction">
							<p>简介</p>
							<p>{this.props.course.introduction}</p>
						</div>
						<WhiteSpace size="md" />
						<ul className="cs-files">
							{this.props.course.courseFileArr ? this.props.course.courseFileArr.map(this.createLi) : ''}
						</ul>
					</div>
					<div style={{display: `${this.state.segmValue==0 ? 'none' : ''}`}}>
						<CommentContainer courseId={this.props.params.courseId} offsetTop={300} updateCourseDetail={this.updateCourseComment} />
					</div>
				</WingBlank>

				<Modal className="cs-modal"
					transparent
					closable = {false}
					visible = {this.state.visible}
					footer = {arry}>

					<ul className="cs-mark">
						<li><img src={this.state.starValue >= 1 ? `${detail_star_pressed}` : `${detail_star_normal}`} onClick={this.changeStar} value={1} /></li>
						<li><img src={this.state.starValue >= 2 ? `${detail_star_pressed}` : `${detail_star_normal}`} onClick={this.changeStar} value={2} /></li>
						<li><img src={this.state.starValue >= 3 ? `${detail_star_pressed}` : `${detail_star_normal}`} onClick={this.changeStar} value={3} /></li>
						<li><img src={this.state.starValue >= 4 ? `${detail_star_pressed}` : `${detail_star_normal}`} onClick={this.changeStar} value={4} /></li>
						<li><img src={this.state.starValue >= 5 ? `${detail_star_pressed}` : `${detail_star_normal}`} onClick={this.changeStar} value={5} /></li>
					</ul>
					<p className="cs-tip">{`${this.state.starValue==5 ? '非常棒，收益匪浅' : this.state.starValue==1 ? '很差，一分都嫌多' : this.state.starValue==2 ? '一般，不太喜欢' : this.state.starValue==3 ? '还不错' : this.state.starValue==4 ? '很好，有收获' : '请点选星星评分'}`}</p>
				</Modal>

				<Modal visible={this.state.showPlay} onClose={()=>{this.setState({showPlay: false, playUrl: ''})}} className="cs-modal-ht">
					<div className="cs-play">
						 <Iframe className="cs-iframe" src={this.state.playUrl} >
      					</Iframe>
					</div>
				</Modal>
				<Modal visible={this.state.showPlay2} onClose={()=>{
					let oVideo = document.getElementById('cs-video');
            		oVideo && oVideo.pause(); 
            		this.setState({showPlay2: false, playUrl: ''})}}>
					<div className="cs-play">
					<video className="cs-video" id="cs-video" poster="" autoPlay>
				        <source src={this.state.playUrl}/>
				    </video>
				    </div>
			    </Modal>
			</div>
		)
	}
});

export default createContainer("classify.courseDetail", actions, {
	course: {},
}).bind(CourseDetailContainer);