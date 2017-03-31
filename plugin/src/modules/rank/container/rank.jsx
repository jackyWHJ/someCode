import React from 'react';
import createContainer from 'zn-container';
import RankCourse from '../component/rankCourse.jsx'

import * as actions from '../action/rankAction.jsx';

const Rank = React.createClass({


    success(data){

    },

    componentDidMount() {
        this.props.actions.loadIndexData(this.success);
        //this.props.actions.getCateName();         //标题从用户在首页配置的名称获取，暂时不从接口获取
    },

    /** 路由离开时 **/
    routerWillLeave(route) {
        if (!_.startsWith(route.pathname.toUpperCase(),"/rank".toUpperCase())) {
            this.props.containerActions.clearReducer();
        };
        this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    },

    render() {

        return (
            <RankCourse {...this.props} num={this.props.chartArr.length}/>
        )
    }
});

//router
Rank.contextTypes = {
    router: React.PropTypes.object.isRequired,
}

export default createContainer("rank.course", actions, {
    style:"",
    homePageNum:"",
    chartArr:[],
    loading:true,
    cateName:"",
    scrollTop:0,
}).bind(Rank);