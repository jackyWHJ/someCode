module.exports = {
	path: 'search',
	getIndexRoute(location, callback) {
		require.ensure([], function(require) {
			callback(null, { component: require("./container/SearchContainer") });
		}, "search")
	},

	childRoutes: [
		{
			path: 'course',
			getComponents(location, callback) {
				require.ensure([], function(require) {
					callback(null, require("./container/SearchCourseContainer"));
				}, "searchCourse")
			}
		}
	]
}