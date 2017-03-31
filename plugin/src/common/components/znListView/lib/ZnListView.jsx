import React from 'react';
import { RefreshControl, ListView, Toast } from 'antd-mobile';
import ZnNoResultTip from 'zn-component/znNoResultTip';
import ZnSimpleListView from 'zn-component/znSimpleListView';
import _ from 'lodash';


const ZnListView = React.createClass({

  propTypes: {

    url: React.PropTypes.string.isRequired,//请求地址
    row: React.PropTypes.func.isRequired,//单个元素处理函数，形参(rowData, sectionID, rowID)
    list: React.PropTypes.array.isRequired,//列表数据源
    ajaxParams: React.PropTypes.object.isRequired,//请求参数，如果没有特殊参数，则传个空对象即可，组件内部已封装基本页码等请求参数，组件必修对改参数进行存储，无论是state存储还是redux存储
    onRefreshSuccess: React.PropTypes.func.isRequired, //下拉刷新成功回调，形参(data, ajaxParams)
    onEndReachedSuccess: React.PropTypes.func.isRequired, //加载更多成功回调，形参(data, ajaxParams)

  },

  getDefaultProps() {
      return {
          className: "", //listview容器添加自定义样式，
          curPageKey: "curPage",//默认请求分页变量名属性是curPage
          offsetTop: 0, //ListView距离顶部的位置，实际px高度，组件内部会处理dpr
          noRefresh: false,//是否需要下拉刷新，默认需要
          //以下参数皆属于原始ListView组件参数，一般无需配置
          renderSeparator: null,//分割符
          initialListSize:15,//初始化显示数据条数, 重点注意如果有被缓存数据，则需要传入这个参数会缓存数组长度，方便处理高度跳转
          pageSize:15,//每次加载缓存中多少条数据，缓存不足则触发加载onEndReached函数
          scrollRenderAheadDistance:100,//多少距离触发加载更多
          scrollEventThrottle: 15,//到达位置后多少触发,当为0的时候，必须放开拖拽才启动触发加载更多事件
          onEndReachedThreshold: 10,//触发加载更多虚拟阀值
      };
  },

  componentWillReceiveProps(nextProps) {

      //检测数据源变化
      if(!_.isEqual(nextProps.list, this.state.list)){
        this.setState({
          list: nextProps.list,
        })
      }

      //检测请求参数params变化
      if(!_.isEqual(nextProps.ajaxParams, this.state.ajaxParams)){
        this.setState({
          ajaxParams: _.extend({}, this.defaultAjaxParams, nextProps.ajaxParams)
        })
      }
  },

  getInitialState() {

    //初始化ajaxParams参数
    this.defaultAjaxParams = {
      curPageKey: this.props.ajaxParams.curPageKey||this.props.curPageKey, //设置curpageKey
      [this.props.ajaxParams.curPageKey||this.props.curPageKey]: 1,//默认请求第一页
      numPerPage: this.props.ajaxParams.numPerPage||15,//默认每页请求10条数据
      sid: Util.storage.getSid(),//请求参数sid
      initRequest: true,//默认是需要初始化请求的，只有当已经存有数据时候不需要做初始化请求
      showedAllPages: false,//是否已经显示完所有页内容
      showNoResultTip: false,//默认是否显示没能搜索到结果提示
      showListView: false,//默认是否显示ListView组件
      nonGzip: 1,//不压缩
      pageType: "plugin",
    };


    return {
      list: this.props.list,//数据源
      ajaxParams: _.extend({}, this.defaultAjaxParams, this.props.ajaxParams),//请求参数
      refreshing: false,//是否处于刷新状态
      isLoading: false,//是否处于加载更多状态
    };
  },

  componentDidMount() {
      //判断是否需要初始化请求
      setTimeout(()=>{
        if(this.state.ajaxParams.initRequest){
          this.onRefresh();
        }
      }, 0)
  },

  restart(){
    //用于在请求参数动态时候，当设置完动态后在调用ZnListView组件的容器里执行this.refs.znListView.restart()方法，
    //重新启动
    this.ajaxTimer && this.ajaxTimer.abort();
    var resetObj = {
      initRequest: true,//默认是需要初始化请求的，只有当已经存有数据时候不需要做初始化请求
      showedAllPages: false,//是否已经显示完所有页内容
      showNoResultTip: false,//默认是否显示没能搜索到结果提示
      showListView: false,//默认是否显示ListView组件
    }
    this.setState({...this.state.ajaxParams, ...resetObj});
    //为了给予事件确认setState数据，添加一个setTimeout定时器
    setTimeout(()=>this.onRefresh(),0)
  },

  componentWillUnmount() {
    //检测如果还有请求未结束，则直接手动触发结束
    this.ajaxTimer && this.ajaxTimer.abort();  
  },

  onRefresh() {
    if(this.state.refreshing){
      return;
    }
    var _this = this;
    //如果是通过拖动则执行refreshing设置
    !_this.state.ajaxParams.initRequest && this.setState({
      refreshing: true,
    });
    //如果是初始化数据,提示ajax加载
    this.state.ajaxParams.initRequest && Toast.loading('加载中...', 0);
    this.ajaxRequest({[_this.props.ajaxParams.curPageKey]:1}).then(function(data){
      var body = data.body;
      
      //成功回调
      !_this.state.ajaxParams.initRequest && _this.setState({
        refreshing: false,
      });
      //隐藏初始化加载提示
      _this.state.ajaxParams.initRequest && Toast.hide();
      if( data && (data.code == 0||data.code == 200) ){
        var totalPage = (data.totalPage!==undefined?data.totalPage:data.body&&data.body.totalPage!=undefined?data.body.totalPage:0);
        if(_this.props.onRefreshSuccess){
          //initRequest:表示已请求完初始数据,showedAllPages:表示是否已请求完所有页数据
          _this.props.onRefreshSuccess(data, {..._this.state.ajaxParams, [_this.props.ajaxParams.curPageKey]: 1, initRequest: false, showedAllPages: totalPage<=1, showNoResultTip: totalPage==0, showListView: totalPage!=0,});
        }
      }else{
        //提示错误提示
        Toast.fail(data.message, 1);
      }
      
    }, function(data, message){
      //失败回调
      !_this.state.ajaxParams.initRequest && _this.setState({
        refreshing: false,
      });
      //隐藏初始化加载提示
      _this.state.ajaxParams.initRequest && Toast.hide();
      if(message == "abort"){
        //如果是手动abort，则直接返回
        return;
      }
      //提示请求失败
      Toast.fail("请求数据失败", 1);
    })

  },
  onEndReached(event) {
    if(this.state.isLoading || this.state.ajaxParams.showedAllPages){
      //如果是当前正在loading更多数据，或者是已经是最后一页了
      return;
    }
    //请求下一页
    var _this = this;
    let curPage = this.state.ajaxParams[_this.props.ajaxParams.curPageKey] + 1;
    _this.setState({
      isLoading: true,
    });
    _this.ajaxRequest({[_this.props.ajaxParams.curPageKey]: curPage}).then(function(data){
      //成功回调
      _this.setState({
        isLoading: false,
      });
      if( data && (data.code == 0||data.code == 200) ){


        if(_this.props.onEndReachedSuccess){
          var totalPage = (data.totalPage!==undefined?data.totalPage:data.body&&data.body.totalPage!=undefined?data.body.totalPage:0);
          _this.props.onEndReachedSuccess(data, {..._this.state.ajaxParams, [_this.props.ajaxParams.curPageKey]: curPage, showedAllPages: totalPage==curPage});
        }
      }else{
        //提示错误提示
        Toast.fail(data.message, 1);
      }
      
    }, function(data, message){
      //失败回调
      _this.setState({
        isLoading: false,
      });
      if(message == "abort"){
        //如果是手动abort，则直接返回
        return;
      }
      //提示请求失败
      Toast.fail("请求数据失败", 1);
    })

    
  },
  ajaxRequest(ajaxParams){
    //请求ajax
    this.ajaxTimer = Ajax({ 
      url: this.props.url, 
      data: {...this.state.ajaxParams, ...ajaxParams},
      type: /json$/ig.test(this.props.url)?"get":"post",//兼容模拟json请求
    });

    return this.ajaxTimer;

  },
  goScrollTop(){
    //置顶
    this.refs.ZnSimpleListView.refs.listViewContainer.refs.listview.scrollTo(0, 0);
  },
  render() {

    return (
      <div>

        <ZnSimpleListView
          {...this.props}
          ref="ZnSimpleListView"
          {...this.state.ajaxParams}
          renderRow={this.props.row}
          onEndReached={this.onEndReached}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
          isLoading={this.state.isLoading}
        />
      </div>
    );
  },
});

export default ZnListView;