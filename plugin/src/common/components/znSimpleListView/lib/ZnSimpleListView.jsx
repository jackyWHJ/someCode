import React from 'react';
import { RefreshControl, ListView, Toast } from 'antd-mobile';
import ZnNoResultTip from 'zn-component/znNoResultTip';
import _ from 'lodash';

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      {props.children}
    </div>
  );
}

const ZnSimpleListView = React.createClass({
  _scrollListeners: [],

  propTypes: {

    row: React.PropTypes.func.isRequired,//单个元素处理函数，形参(rowData, sectionID, rowID)
    list: React.PropTypes.array.isRequired,//列表数据源
    onRefresh: React.PropTypes.func, //下拉刷新
    onEndReached: React.PropTypes.func, //加载更多
    refreshing: React.PropTypes.bool, //是否刷新中状态
    isLoading: React.PropTypes.bool, //是否加载更多状态
    scrollTop: React.PropTypes.number,//滚动轴要滚动的距离，例如当从第5页点击一个课程进去，返回时候要记录当前滚轴移动距离
    onScroll: React.PropTypes.func, //触发滚动回调，参数是滚动的scrollTop值
    renderFooter: React.PropTypes.func,  //自定义加载界面
  },

  // 允许子组件去注册Scroll事件
  getChildContext(){
    return {
      registScrollEventListener: this.registScrollEventListener
    }
  },

  goScrollTop(){
    //置顶
    this.refs.listViewContainer.refs.listview.scrollTo(0, 0);
  },

  getDefaultProps() {
      return {
          scrollTop: 0,//记录滚轴距离
          showNoResultTip: false,//是否显示没有结果提示
          showListView: false,//是否显示ListView组件
          className: "", //listview容器添加自定义样式，
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
          dataSource: this.state.dataSource.cloneWithRows(nextProps.list),
        })
      }

      
  },

  getInitialState() {

    this.scrollTop = this.props.scrollTop;//用来保存scrollTop值
   
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    return {
      list: this.props.list,//数据源
      dataSource: dataSource.cloneWithRows(this.props.list),//展示在row函数里的数据
      refreshing: false,//是否处于刷新状态
      isLoading: false,//是否处于加载更多状态
    };

  },

// 允许子组件注册scroll事件
  registScrollEventListener(listener) {
    this._scrollListeners.push(listener);

    return () => {
      const len = this._scrollListeners.length;
      let index = 0;
      while(index < len) {
        if (this._scrollListeners[index] == listener) {
          this._scrollListeners = this._scrollListeners.slice(0, index).concat(this._scrollListeners.slice(index+1));

          return false;
        }

        index++;
      }
    }
  },

  onRefresh() {
    
    this.props.onRefresh && this.props.onRefresh();

  },
  onEndReached(event) {
    this.props.onEndReached && this.props.onEndReached(event);
  },
  onScroll(event) {


     let _this = this, nowScrollTop = (event.target && event.target.scrollTop) || (event.scroller && event.scroller.getValues && event.scroller.getValues().top);
    //return;

    //滚动差距必须和上次位置要大于15才触发，防止频繁触发回调
    if(Math.abs( _this.scrollTop-nowScrollTop)<15){
      return;
    }else{
      _this.scrollTop = nowScrollTop;
      if(_this.props.onScroll){
        _this.props.onScroll(nowScrollTop)
      }
    }

    this._scrollListeners.map(listener => {
      listener(nowScrollTop, event);
    });
  },

  componentDidMount() {
      if(this.props.scrollTop && this.props.scrollTop!=0){
        this.refs.listViewContainer.refs.listview.scrollTo(0, this.props.scrollTop);
        //避免从详情返回列表图片不渲染
        this._scrollListeners.map(listener => {
          listener(this.props.scrollTop, event);
        });
      }
  },

  render() {

    var dpr = Util.getDeviceDPR();
    const footer = () => <div style={{ padding: 6*dpr, textAlign: 'center' }}>
              {this.props.isLoading ? '加载中...' : '加载完毕'}
            </div>

    return (
      <div>
        {!this.props.showNoResultTip && !this.props.showListView ? null : 
          this.props.showNoResultTip ? <ZnNoResultTip content={this.props.noResultTipContent} /> :
          <ListView ref="listViewContainer"
            {...this.props}
            className={"zn-list " + this.props.className}
            dataSource={this.state.dataSource}
            renderFooter={ this.props.renderFooter || footer }
            renderBodyComponent={this.props.useBodyScroll?null:() => <MyBody />}
            renderRow={this.props.row}
            renderSeparator={this.props.renderSeparator}
            initialListSize={this.props.initialListSize}
            pageSize={this.props.pageSize}
            scrollRenderAheadDistance={this.props.scrollRenderAheadDistance}
            scrollEventThrottle={this.props.scrollEventThrottle}
            style={{
              height: document.documentElement.clientHeight - this.props.offsetTop*dpr,
            }}
            scrollerOptions={{ scrollbars: true }}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={this.props.onEndReachedThreshold}
            refreshControl={(this.props.noRefresh||this.props.useBodyScroll)?null:<RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.onRefresh}
              distanceToRefresh={56 / 2 * (dpr)}
            />}
            onScroll={this.onScroll}
          />
        }
      </div>
    );
  },
});


ZnSimpleListView.childContextTypes = {
  registScrollEventListener: React.PropTypes.func
};

export default ZnSimpleListView;