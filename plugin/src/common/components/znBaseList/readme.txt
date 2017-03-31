
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


//  支持 下拉获取最新数据/（下拉刷新列表）
import ZnBaseList from 'zn-common/components/znBaseList';
    <ZnBaseList
        addClassName="m-info-list"
        ref="informationList"
        renderRow={this.rowItem}
        itemKey="infoId"
        onRefresh={this.onRefresh}
        onNextData={this.onEndReached}
    />

示例：
    //  渲染每行Item
    rowItem(rowData,sourceId,rowId){
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
    onRefresh(pageParam,success,fail){
        this.props.actions.loadInfoData(pageParam,success,fail,'init');
    },
    onEndReached(pageParam,success,fail){
        this.props.actions.loadInfoData(pageParam,success,fail,'next');
    },
    //  点击 item 的事件
     clickItem(rowData,rowId){
        if(!this._clickStop){
            let path = 'info/information/infoDetail';
            this._clickStop = true;
            console.log(this.content);
           // this.props.history.push(null,path,{query:{sourceLink:rowData.link}});
//            this.context.router.push(path);
            this.context.router.push({
                pathname: path,
                query: { },
                state: { resourceLink:rowData.link }
            })
        }
    },
    //  控制 clickItem时只触发一次
    _clickStop:false,