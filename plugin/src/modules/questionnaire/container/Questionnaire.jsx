import React from 'react';
import { Link } from 'react-router';
import createContainer from 'zn-container';
import "../style/index.scss";
import * as actions from '../action';
import ZnNavBar from 'zn-component/znNavBar';
import ZnListView from 'zn-component/znListView/index';
import QuestionnaireListItem from '../component/QuestionnaireListItem';
import { API } from '../dataConfig';
const Questionnaire = React.createClass({

  componentWillMount(){
    this.context.router.setRouteLeaveHook(
      this.props.route,
      this.routerWillLeave
    );
  },

  routerWillLeave(next){
     let reg = /(\/questionnaireDetails)/; //如果不是跳转到课程详情页面，则清空list
     if (!reg.test(next.pathname)){
          this.props.containerActions.clearReducer();
     }
  },

  //下拉刷新成功回调
  onRefreshSuccess(data, ajaxParams){
    //用用list参数覆盖现在的this.propr.list
    this.props.actions.loadData(data.body.intgArr, ajaxParams);
  },

  //上拉加载更多成功回调
  onEndReachedSuccess(data, ajaxParams){
    //要在现有this.props.list数据上追加list
    let newList = [...this.props.list, ...data.body.intgArr];
    this.props.actions.loadData(newList, ajaxParams);
  },

  onScroll(scrollTop){
    //console.log(scrollTop);
    //更新scrollTop值
    this.props.actions.updateScrollTop(scrollTop);
  },

	render() {
    
    const row = (rowData, sectionID, rowID) => {
      return <Link to={"questionnaire/questionnaireDetails/" + rowData.intgId }><QuestionnaireListItem {...rowData} /></Link>
    };

    let znListViewProps = {
      url: API.getQuestionnaireList,
      row: row,
      list: this.props.list,
      ajaxParams: this.props.ajaxParams,
      onRefreshSuccess: this.onRefreshSuccess,
      onEndReachedSuccess: this.onEndReachedSuccess,
      noResultTipContent: "您暂时还没有问卷哦",
      offsetTop: 45,
      initialListSize: this.props.list.length!=0?this.props.list.length:undefined,
      ...this.props,
      onScroll: this.onScroll,
    };

		return (
			<div>
				
        <ZnNavBar className="app-bar">问卷</ZnNavBar>
        <div style={{paddingTop: "0.9rem"}}>
          <ZnListView  {...znListViewProps} />
        </div>
        
			</div>
		)
	}
});

export default createContainer("questionnaire.list", actions, {
	list: [],
  ajaxParams: {},
  scrollTop: 0,
}).bind(Questionnaire);