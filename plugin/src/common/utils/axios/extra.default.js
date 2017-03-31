export default {
	withDefParams: true,		// 为true时，默认在请求中增加sid和ver参数
	loading: true,				// 是否启用请求时自动展示loading
	loadingText: "加载中...",
	successText: "加载成功",
	failText: "加载失败",
	timeout: "连接超时",
	"404": "地址失效",
	
	alias: {
		sid: "sid",
		version: "ver"
	}
}