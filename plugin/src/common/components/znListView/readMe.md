//目录
src\common\components\znListView


//引入方式如：
import ZnListItem from 'zn-component/znListView’;

//必填参数如下
{
	url: React.PropTypes.string.isRequired,//请求地址
    row: React.PropTypes.func.isRequired,//单个元素处理函数，形参(rowData, sectionID, rowID)
    list: React.PropTypes.array.isRequired,//列表数据源
    ajaxParams: React.PropTypes.object.isRequired,//请求参数，如果没有特殊参数，则传个空对象即可，组件内部已封装基本页码等请求参数，组件必修对改参数进行存储，无论是state存储还是redux存储
    onRefreshSuccess: React.PropTypes.func.isRequired, //下拉刷新成功回调，形参(data, ajaxParams)
    onEndReachedSuccess: React.PropTypes.func.isRequired, //加载更多成功回调，形参(data, ajaxParams)
}


//初始化ajaxParams参数
this.defaultAjaxParams = {
  [this.props.ajaxParams.curPageKey]: 1,//默认请求第一页
  numPerPage: 10,//默认每页请求10条数据
  sid: Util.storage.getSid(),//请求参数sid
  initRequest: true,//默认是需要初始化请求的，只有当已经存有数据时候不需要做初始化请求
  showedAllPages: false,//是否已经显示完所有页内容
  showNoResultTip: false,//默认是否显示没能搜索到结果提示
  showListView: false,//默认是否显示ListView组件
  nonGzip: 1,//不压缩
  pageType: "plugin",
};


//非必填参数
{
	className: "", //listview容器添加自定义样式，
	curPageKey: "curPage",//默认请求分页变量名属性是curPage，防止有时候后台接受参数变成pageNO之类的
	offsetTop: 0, //ListView距离顶部的位置，实际px高度，组件内部会处理dpr
	noRefresh: false,//是否需要下拉刷新，默认需要
	//以下参数皆属于原始ListView组件参数，一般无需配置
	renderSeparator: null,//分割符
	initialListSize:10,//初始化显示数据条数, 重点注意如果有被缓存数据，则需要传入这个参数会缓存数组长度，方便处理高度跳转
	pageSize:10,//每次加载缓存中多少条数据，缓存不足则触发加载onEndReached函数
	scrollRenderAheadDistance:100,//多少距离触发加载更多
	scrollEventThrottle: 15,//到达位置后多少触发,当为0的时候，必须放开拖拽才启动触发加载更多事件
	onEndReachedThreshold: 10,//触发加载更多虚拟阀值
	noResultTipContent: "", //当无数据时候，知鸟图片下面文字内容，默认是 ZnNoResultTip 组件里默认提示文字"暂无数据哦"
}


//组件对外提供的公共方法restart()
//用于在请求参数动态时候，当设置完动态后在调用ZnListView组件的容器里执行this.refs.znListView.restart()方法，



//具体使用，参考问卷(modules/questionnaire)，或者课程必修选修(modules/questionnaire)
render() {
    
	const row = (rowData, sectionID, rowID) => {
		return <Link to={"questionnaire/questionnaireDetails/" + rowData.intgId + "/" + rowData.istested }><QuestionnaireListItem {...rowData} /></Link>
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
		...this.props,
	};

	return (
		<div>
			<NavBar className="app-bar">问卷</NavBar>
			<div style={{paddingTop: "0.9rem"}}>
				<ZnListView  {...znListViewProps} />
			</div>
		</div>
	)
}



