//目录
src\common\components\znListItem 


//引入方式如：
import ZnListItem from 'zn-component/znListItem’;

//参数如下
{
	className: "",//默认样式
	backgroundColor: "#fff",//背景颜色默认白色
	borderBottom: "1px solid #e9e9e9",//默认底部边框
	leftContent: "",//默认左边内容，支持string  element
	title: "",//默认主标题，支持string  element
	subTitle: "",//默认副标题，支持string  element
	intro:"",//默认右边最底部内容，支持string  element
	titleAlign:"left",//默认主标题对齐方式
	subTitleAlign:"left",//默认主标题对齐方式
	introAlign:"left",//默认主标题对齐方式
}

 //具体使用
<ZnListItem 
	leftContent={<div><img src="http://test-mlearning.pingan.com.cn:45080/learn/app/image/20161126/b3e025185afe4370a91d4d5bf9cf1211/7bff2443befc4801aa7de2ad9f9ca98c.jpg" alt=""/><i className="studied-icon"></i></div>}
	title={"大家这样玩知鸟"} 
	subTitle={"讲师：辛婷婷"} 
	intro={<div className="comment-bottom">
		<span className="course-score"><i></i>4.5</span>
		<span className="course-heart"><i></i>3</span>
		<span className="course-comment"><i></i>172</span>
	</div>}
/>



