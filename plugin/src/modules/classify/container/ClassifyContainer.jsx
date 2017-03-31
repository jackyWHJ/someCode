import React from 'react';
import { Link } from 'react-router';
import ZnNavBar from 'zn-component/znNavBar';
import createContainer from 'zn-container';
import * as actions from '../action';
import '../style/classify.scss'

const ClassifyContainer = React.createClass({

	contextTypes: {
	  router: React.PropTypes.object.isRequired,
	},

	getInitialState() {
        return {
        	moduleId: '',
        	moduleTagArr: [],
        };
    },

	componentWillMount() {
		this.props.actions.requestTypeModuleList({urlFrom: 0});
	},

	componentDidMount() {
		let _this = this;
		setTimeout(function(){
			let module = _this.props.body.moduleArr && _this.props.body.moduleArr.length>0 ? _this.props.body.moduleArr[0] : {};
			_this.setState({moduleId: module.moduleId || '', moduleTagArr: module.moduleTagArr || []});	
		},500);
		
	},

	clickLiOfLeft(moduleId){
		let moduleArr = this.props.body.moduleArr || [];
		for(let i=0;i<moduleArr.length;i++){
			let obj = moduleArr[i];
			if(obj && obj.moduleId && obj.moduleId==moduleId){
				this.setState({moduleId: moduleId, moduleTagArr: obj.moduleTagArr ? obj.moduleTagArr : {}});
				break;
			}
		}
	},

	createLiOfLeft(obj, i){
		return <li key={`keyMd${i}`} onClick={()=> {this.clickLiOfLeft(obj.moduleId)}} className={obj.moduleId==this.state.moduleId ? 'selected' : ''} style={obj.moduleId==this.state.moduleId ? {'borderLeftColor': `${Util.storage.getNavBarColor()}`} : {}} ><span>{obj.moduleName}</span></li>
	},

	createLiOfRight(obj, i){
		return <li key={`keyMdTg${i}`} onClick={()=>{this.clickLiOfRight(`${obj.moduleTagId}`)}} ><span>{obj.moduleTagName}</span></li>
	},

	clickLiOfRight(moduleTagId){
		this.context.router.push(`/classify/courselist/${moduleTagId}/${this.state.moduleId}`);
	},

	gotoList(moduleTagId,moduleId){
    	this.context.router.push(`/classify/courselist/${moduleTagId}/${moduleId}`);
    },

	render() {

		return (
			<div className="zn-classify-main-face">
				<ZnNavBar className="app-bar" >课程分类</ZnNavBar>
				<div className="cf-out">
					<div className="cf-left-div">
						<ul className="cf-left-ul">
							{this.props.body.moduleArr && this.props.body.moduleArr.length>0 ? this.props.body.moduleArr.map(this.createLiOfLeft) : ''}
						</ul>
					</div>
					<div className="cf-right-div">
						<ul className="cf-right-ul">
							{this.state.moduleTagArr && this.state.moduleTagArr.length>0 ? this.state.moduleTagArr.map(this.createLiOfRight) : ''}
						</ul>
					</div>
				</div>
			</div>
		)
	}
});

export default createContainer("classify.mainface", actions, {
	body: {}
}).bind(ClassifyContainer);