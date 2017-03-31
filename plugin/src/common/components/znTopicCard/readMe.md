//目录
src\common\components\znTopicCard 


//引入方式如：
import ZnListItem from 'zn-component/znTopicCard’;

//参数如下
{
	iconColor: React.PropTypes.string,//主题颜色
	recomTitle: React.PropTypes.string,//卡片标题
	recomWords: React.PropTypes.string,//卡片内容
	recomImg: React.PropTypes.string,//卡片图片
}

 //具体使用
<ZnTopicCard key={item.sourceId} iconColor={this.props.iconColor} recomTitle={item.recomTitle} recomWords={item.recomWords} recomImg={item.recomImg}/>



