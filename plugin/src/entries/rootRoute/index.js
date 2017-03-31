const rootRoutes = {
	path: '/',

	// 登陆页面
	getIndexRoute(location, callback) {
		require.ensure([], function(require) {
			callback(null, { component: require("../auth/container/AuthContainer") });
		}, "auth")
	}
};

// 获取路由配置的key, 暂时没用
// const resolveModuleKey = function resolveModuleKey( key ) {
// 	let temp = '';
// 	if (key.startsWith("./")) {
// 		temp = key.substring(2);
// 	} else if (key.startsWith("/")) {
// 		temp = key.substring(1);
// 	} else {
// 		temp = key;
// 	}

// 	const endIndex = temp.indexOf('/');
// 	return temp.substring(0, endIndex);
// }

// 解析路由配置
const resolveRoutes = function resolveRoutes() {
	// 改变require的上下文环境，查找modules目录下的所有route.js的路由配置文件
	const requireCtx = require.context("../../modules", true, /route\.js$/);
	const modules = requireCtx.keys();

	const routers = [];

	// 遍历所有找到的路径，并获取相应的路由配置
	modules.map((route) => {
		routers.push(requireCtx(route));
	});

	// 把查找到的路由配置，配置为rootRoute的子路由
	rootRoutes.childRoutes = routers;

	return [rootRoutes];
};

export default resolveRoutes;