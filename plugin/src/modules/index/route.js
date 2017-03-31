module.exports = {
	path: 'index',
	getComponents(location, callback) {
		require.ensure([], function(require) {
			callback(null, require("./container/IndexContainer"));
		}, "indexContainer");
	}
}