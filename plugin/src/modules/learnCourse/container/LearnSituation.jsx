import React from 'react';
import createContainer from 'zn-container';
import "../style/learn.scss";
import HavaLearn from './HaveLearn.jsx';
import NotLearn from './NotLearn.jsx';
import * as actions from '../action/LearnSituationAction.jsx';
import { Tabs } from 'antd-mobile';
import ZnNavBar from 'zn-component/znNavBar';

const TabPane = Tabs.TabPane;

const LearnSituation = React.createClass({

    componentDidMount(){
        this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    },

    /** 路由退出时的函数 **/
    routerWillLeave(route) {
        if (!_.startsWith(route.pathname.toUpperCase(),"/classify/courseDetail".toUpperCase())) {
            this.props.containerActions.clearReducer();
            if(this.refs.hasLearn){
                this.refs.hasLearn.mergedProps.actions.clearAll("hasLearn");
            }
            if(this.refs.notLearn){
                this.refs.notLearn.mergedProps.actions.clearAll("notLearn");
            }
        }
    },

    changeTab(key){
        this.props.actions.updataActive(key)
    },

    render(){
        let _prop = this.props.location;
        let title = _prop.state.name;
        let isObligatory = _prop.pathname.substring(_prop.pathname.lastIndexOf('/')+1);
        return(
            <div>
                <ZnNavBar>{`我的${title}课`}</ZnNavBar>
                <Tabs defaultActiveKey="1" swipeable={false} onChange={this.changeTab} activeKey={this.props.activeKey}>
                    <TabPane tab="已学" key="1">
                        <HavaLearn ref="hasLearn" isObligatory={isObligatory} {...this.props}/>
                    </TabPane>
                    <TabPane tab="未学" key="2">
                        <NotLearn ref="notLearn" isObligatory={isObligatory} {...this.props}/>
                    </TabPane>
                </Tabs>
            </div>
        )
    },
})

//router配置
LearnSituation.contextTypes = {
    router: React.PropTypes.object.isRequired,
}

export default createContainer("learnSituation.list", actions, {
    activeKey: "1",
}).bind(LearnSituation);
