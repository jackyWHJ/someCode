module.exports = {
	path: 'requiredElective',
	getComponents(location, callback) {
		require.ensure([], function(require) {
			callback(null, require("./container/requiredElective"));
		}, "requiredElective");
	}
}