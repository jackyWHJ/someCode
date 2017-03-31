module.exports = {
	path: 'comment',
	getComponents(location, callback) {
		require.ensure([], function(require) {
			callback(null, require("./container/CommentContainer"));
		}, "comment");
	}
};