import React from 'react';
import { ListView, RefreshControl } from 'antd-mobile';
import ZNHeader from './../../znHeader/znHeader';
import {CONST} from 'zn-common/constants';

/**
        this.props.znHeader    null/undefined    /obj{title:'',cancel:function(){}}   配置导航条
        height                 document.documentElement.clientHeight-53               配置容器高度
        renderFooterTxt        null/undefined    /obj{loading:'加载中',finish:'加载完成'}   配置加载下一页渲染的文本
        addClassName           null/undefined    /''(默认'am-list ')                  在基础样式上增加样式
        onRefresh              必填   下拉刷新
        onNextData             必填   加载下一页
        initData               默认[]   只生效一次
        itemKey                必填       使用属性 pullRefreshStatus=true 时可不填  按照数据条数(常规，绑定数据Item对应的'ID'字段)
        pageSize               默认   每页显示10条数据
        pullRefreshStatus      默认 false  下拉只获取最新的数据。    true  下拉刷新整个listView数据
        gapHtml                null/undefined      li间隔渲染器
        listItem               null/undefined    /function(data,rowID){return <div></div>}  listItem每项的渲染
        //footHid                null/undefined    /true/false        // footer部分文本是否隐藏
**/

/**
    描述：不用传递数据，WillMount默认执行一次下拉刷新的数据请求

**/

/***基础列表容器***/
const ZnBaseList = React.createClass({
    _dataIndex : 0,    //   用于data的渲染 索引
    _firstData:[],     //   第一页数据
    _totalData:[],     //   总数据
    _lastData:[],      //   最后一次数据请求的数据
    _getNextData: false,
    _pageParam:{
        pageNo : 0,   //   当前第几页数
        sumPage : 0,   //   总共页数
        pageSize : 10,  //   每页显示条数
        total : 0,     //   后台返回列表数据总条数
        lastNum : 0
        //  已加载总数据条数listData.length
        //  lastNum  最后一次数据请求返回条数
    },
    rData:{},
    _initData:[],      //记录历史记录的渲染
    getInitialState() {
        let _self = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => {
                return row1 !== row2;
            },
        });
        _self._pageParam.pageSize = _self.props.pageSize || 10;

        this.rData = this.genData([]);
        return {
            dataSource: dataSource.cloneWithRows(this.rData),
            isLoading:true,
            refreshing:false,
        };
    },
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitLength(){
        let len = 0;
        let ttdata = this.rData;
        for( var a in ttdata){
            if(ttdata.hasOwnProperty(a)){
                len++;
            }
        }
        return len;
    },
    genData(data=[]){
        const dataBlob = {};
        let defKey = '';
        let len = data.length;
        for (let i = 0; i < len; i++) {
            if(this.props.itemKey){
                dataBlob[`${data[i][this.props.itemKey]}`] = data[i];
            }else{
                const _pageNo = this._pageParam.pageNo - 1;
                const ii = (_pageNo * this._pageParam.pageSize) + i;
                dataBlob[`${ii}`] = data[i];
            }
        }
        return dataBlob;
    },
    //  页面激活时触发
   componentDidMount() {
       let _self = this;
       // listView跳转到指定位置
       // this.refs.lv.refs.listview.scrollTo(0, 200);

        //  渲染旧数据
        _self.initData(this.props);

        //  渲染第一页数据/获取拉取最新数据
        _self.onRefresh('init');
   },
   componentWillMount(){
        let _self = this;
   },
   componentWillReceiveProps(nextProps){
        this.initData(nextProps);
   },

   initData(props){
        let _self = this;
        let initData = props.initData || [];
        if(initData && initData.length > 0 && _self._initData.length == 0 ){
            _self._initData = initData;
            this.rData = { ..._self.rData, ..._self.genData(initData) };
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
            });
            _self._getNextData = false;
            if(data.length < _self.getPageParamObj().pageSize){
                _self._getNextData = true;
            }
        }
   },
   setPageParamObj(obj={}){
        this._pageParam={
            ...this._pageParam,
            ...obj
        }
   },
   getPageParamObj(){
        return this._pageParam;
   },
    //  请求数据时返回的参数 pageNo 加载指定页数据
    //  status='init'   加载第一页数据
    getDataParamObj(status = ''){
        return {
            ...this._pageParam,
            pageNo:status == 'init' ?  1:this._pageParam.pageNo + 1
        };
    },
    setStateObj(Obj){
        this.setState(Obj);
    },
    //  处理下拉刷新的数据
    getPullRefreshStatus(data){
        const _self = this;
        if(_self.props.pullRefreshStatus){
            //  下拉刷新，重置列表数据
            _self.setPageParamObj({
                sumPage:1,                  //  请求成功后，总页数重置为1
                pageNo:1                   //  当前请求的第一页
            });

            return _self.genData(data);
        }else{
            //  下拉刷新，只获取最新数据
            return { ..._self.genData(data), ..._self.rData };
        }
    },
    //  下拉刷新
    //  status='init' 时作为第一次进入页面的数据请求
   onRefresh(status = ''){
        let _self = this;
        if(_self.props.pullRefreshStatus){
            _self._getNextData = false;
        }
        if(_self.props.onRefresh){
            if(status != 'init'){
                _self.setState({refreshing:true});
            }
            //  处理成功
            let success = (data) => {

                _self.rData = _self.getPullRefreshStatus(data);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(_self.rData)
                });
                if(status == 'init'){
                    _self.setState({isLoading:false});
                }else{
                    _self.setState({refreshing:false});
                }
            }
            //  处理失败
            let fail = (msg) => {
                if(status == 'init'){
                    _self.setState({isLoading:false});
                }else{
                    _self.setState({refreshing:false});
                }
            }
            _self.props.onRefresh(_self.getDataParamObj('init'),success,fail,status);
        }
    },
  //    加载下一页
  onEndReached(event) {
    let _self = this;
    console.log('加载下一页');
    if(_self.props.onNextData){
        if(_self._getNextData){
            return;
        }
        _self._getNextData = true;
        this.setState({
            isLoading: true,
        });
        //  处理成功
        let success = (data) => {
            _self.setPageParamObj({
                sumPage:_self.getPageParamObj().sumPage + 1,
                pageNo:_self.getPageParamObj().pageNo + 1
            });

            this.rData = { ..._self.rData, ..._self.genData(data) };
            console.log(this.rData);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
            });
            _self._getNextData = false;
            if(data.length < _self.getPageParamObj().pageSize){
                _self._getNextData = true;
            }
        }
        //  处理失败
        let fail = (msg) => {
            _self._getNextData = false;
            this.setState({
                isLoading: false,
            });
        }
        _self.props.onNextData(_self.getDataParamObj(),success,fail);
    }

    /****

    // load new data
    this.setState({ isLoading: true });
    setTimeout(() => {
        this.rData = { ...this.rData, ...this.genData(++sumNum) };
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false,
        });
    }, 1000);

    ****/
  },

  render() {
    let _self = this;
        //  li 间隔分离器
    const separator = (sectionID, rowID) => {
        if(_self.props.gapHtml){
            return _self.props.gapHtml
        }
        return (
            <div key={`${sectionID}-${rowID}`} style={{
                 backgroundColor: '#F5F5F9',
            height: 8,
            borderTop: '1px solid #ECECED',
            borderBottom: '1px solid #ECECED',
            }}
            />
        );
    };
    const row = (rowData, sectionID, rowID) => {
        const obj = {};

      //    listItem 渲染
      if(_self.props.listItem){
        return listItem(rowData,rowID);
      }

      return (
        <div key={rowID}
          style={{
            padding: '0.08rem 0.16rem',
            backgroundColor: 'white',

          }}
        >
            <div>每行的数据<br/>每行的数据<br/>每行的数据<br/>每行的数据<br/>每行的数据<br/></div>
        </div>
      );
    };

   /******************************  props 参数处理  **************************************/
    let domFontSize = parseFloat(document.documentElement.style.fontSize);      //  根节点font-size
    let eleRate = domFontSize/100;                                              //  高度倍数

    //  是否配置导航条
    let headerEle = _self.props.znHeader ? <ZNHeader {..._self.props.znHeader} /> : null;

    //   新增部分props配置 start
    let customProps = {}

    //  style样式处理
    let style = _self.props.style ? _self.props.style : _self.props.height ? {height:_self.props.height} : {height:document.documentElement.clientHeight};
    if(_self.props.style || _self.props.height){
        customProps['style'] = style;
    }

    //  加载下一页显示文本配置  start
    if(_self.props.renderFooterTxt){
        let footTxtLoading = '加载中...';
        let footTxtFinish = '加载完毕';
        footTxtLoading = _self.props.renderFooterTxt.loading || footTxtLoading;
        footTxtFinish = _self.props.renderFooterTxt.finish || footTxtFinish;

        customProps['renderFooter'] = () => <div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? footTxtLoading : footTxtFinish}
        </div>
    }
    //  加载下一页显示文本配置  stop

    //  增加className  start
    if(_self.props.addClassName){
        customProps['className'] = 'am-list ' + _self.props.addClassName
    }
    //  增加className  stop


    let tProps = {
        ref:"lv",
        dataSource:this.state.dataSource,
        renderHeader:() => <span></span>,
        renderFooter:() => <div style={{ textAlign: 'center' }}>
            {this.state.isLoading ? '加载中...' : '加载完毕'}
        </div>,
        renderRow:row,
        renderSeparator:separator,
        className:"am-list",
        scrollRenderAheadDistance:100,
        scrollEventThrottle:1000,
        initialListSize:10,
        pageSize:8,
        onScroll:() => { },
        style:{ height: document.documentElement.clientHeight-CONST.NAVBAR_HEIGHT*eleRate},
        onEndReached:this.onEndReached,
        onEndReachedThreshold:10000,
        scrollerOptions:{ scrollbars: true },
        refreshControl:<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
        />,
        ...this.props,
        ...customProps
    }

    return (<div >
           {headerEle}
           <ListView {...tProps}
          />
    </div>);
  },
});

export default ZnBaseList;

