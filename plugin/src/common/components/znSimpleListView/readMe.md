//目录
src\common\components\znSimpleListView


//引入方式如：
import ZnSimpleListItem from 'zn-component/znSimpleListView’;

//必填参数如下
{
	row: React.PropTypes.func.isRequired,//单个元素处理函数，形参(rowData, sectionID, rowID)
    list: React.PropTypes.array.isRequired,//列表数据源
    onRefresh: React.PropTypes.func.isRequired, //下拉刷新
    onEndReached: React.PropTypes.func.isRequired, //加载更多
    refreshing: React.PropTypes.bool.isRequired, //是否刷新中状态
    isLoading: React.PropTypes.bool.isRequired, //是否加载更多状态
}






