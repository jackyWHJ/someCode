import React from 'react';
import createContainer from 'zn-container';
import CustomTopicList from '../component/CustomTopicList';
import ZnNavBar from 'zn-component/znNavBar';
import ZnMessage from 'zn-component/znMessage';

import * as actions from '../action/customTopicAction';
import { moduleMap } from '../dataConfig';

import "../style/customTopic.scss";

const CustomTopicContainer = React.createClass({
	componentDidMount() {
		this.props.actions.loadCustomTopicData(this.props.params.pageId);
	},
	goBackLink() {
    this.context.router.goBack();
  },
  functionInvalid() {
    ZnMessage.info("当前插件不支持该功能");
  },
  goToLink(data) {
      console.log('default');
    const detailPage = this.getRoute(data.type, data);
    if (detailPage.list) {
      this.context.router.push({ pathname: detailPage.list, state: data });
    } else {
      this.functionInvalid();
    }
  },
  getRoute(type, data) {
    console.log('default');
    if (moduleMap[type] && moduleMap[type].enable) {
      if (_.isFunction(moduleMap[type].getRouterUrl)) {
        return moduleMap[type].getRouterUrl(data);
      }
      return moduleMap[type];
    }
    return {};
  },
	render() {
		return (
			<div id="secondPage">
        <div className="has-bar">
        	<ZnNavBar className="app-bar" onLeftClick={this.goBackLink} >{this.props.params.pageTitle}</ZnNavBar>
        </div>
        <CustomTopicList goToLink={this.goToLink} iconColor={Util.storage.getNavBarColor()} secondArr={this.props.secondArr}/>
      </div>
		)
	}
});

export default createContainer("topic.custom", actions, {
	secondArr: []
}).bind(CustomTopicContainer);