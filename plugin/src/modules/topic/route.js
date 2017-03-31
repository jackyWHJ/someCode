module.exports = {
	path: 'customTopic(/:pageId/:pageTitle)',
	getComponents(location, callback) {
		require.ensure([], function(require) {
			callback(null, require("./container/CustomTopicContainer"));
		}, "customTopicContainer");
	}
}