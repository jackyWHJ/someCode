import React from 'react';
import createContainer from 'zn-container';
import { Button, InputItem } from 'antd-mobile';
import ZnListView from 'zn-component/znListView/index';
import ZnListItem from '../../../common/components/znListItem';
import ZnNavBar from 'zn-component/znNavBar';
import {CONST} from 'zn-common/constants';
import { API } from '../dataConfig';
import {Link, browserHistory} from 'react-router';
import '../style/information.scss';

import * as actions from '../action';

/** 资讯页面 Container **/
const InfoContainer = React.createClass({
    _clickStop:false,
    getInitialState(){

        return {
            pageNo:1,
            pageSize:10
        }
    },
    componentDidMount() { 
        this._clickStop = false;
    },

    componentWillMount() {
    },
    componentWillUnmount() {
       
    },
    wrapColumns() {
    },
    contextTypes: {
        router: React.PropTypes.object
    },
    clickItem(rowData,rowId){
        if(!this._clickStop){
            let path = 'info/information/infoDetail';
            this._clickStop = true;
            console.log(this.content);
            this.context.router.push({
                pathname: path,
                query: { },
                state: { resourceLink:rowData.link }
            })
        }
    },
    row(rowData,sourceId,rowId){
        return (
            <div key={rowId} onClick={this.clickItem.bind(this,rowData,rowId)}>
                <ZnListItem
                    subTitle={rowData.title}
                    intro={<div className="comment-bottom">
                       <span>来源:{rowData.source}</span> &nbsp;<span>{rowData.publishDate}</span>
                    </div>}
                />
            </div>
         )
    },

    //下拉刷新成功回调
    onRefreshSuccess(data, ajaxParams){
        //用用list参数覆盖现在的this.propr.list
        this.props.actions.loadData(data.body.page.data, {
            ...ajaxParams,
            showedAllPages: data.body.page.pageQuantity<=1, showNoResultTip: data.body.page.pageQuantity==0, showListView: data.body.page.pageQuantity!=0
        });
    },

    //上拉加载更多成功回调
    onEndReachedSuccess(data, ajaxParams){
        //要在现有this.props.list数据上追加list
        let newList = [...this.props.list, ...data.body.page.data];
        this.props.actions.loadData(newList, {
            ...ajaxParams,
            showedAllPages:ajaxParams.pageNo == data.body.page.pageQuantity
        });
    },

    render() {
        let _self = this;

    const row = (rowData, sectionID, rowID) => {
      return <Link to={"questionnaire/questionnaireDetails/" + rowData.intgId + "/" + rowData.istested }><QuestionnaireListItem {...rowData} /></Link>
    };
        let znListViewProps = {
          url: API.initInfoMationList,
          row: this.row,
          list: this.props.list,
          className:'am-list m-info-list',
          ajaxParams: this.props.ajaxParams,
          onRefreshSuccess: this.onRefreshSuccess,
          onEndReachedSuccess: this.onEndReachedSuccess,
          noResultTipContent: "暂无资讯消息",
          offsetTop: CONST.NAVBAR_HEIGHT,
          ...this.props,
        };

       return (<div>
            <ZnNavBar >资讯</ZnNavBar>
            <ZnListView  {...znListViewProps} />
            
        </div>) 
    }
}); 

export default createContainer("info.main", actions, {
    list: [],
    ajaxParams: {curPageKey:'pageNo',pageSize:10,homeId:Util.storage.getHomeId()},
}).bind(InfoContainer);


//}).inject(["index.main"], function(state) {
// const indexMain = state["index.main"];
//   return {homeId: indexMain.extra.homeId};
//}).bind(InfoContainer);