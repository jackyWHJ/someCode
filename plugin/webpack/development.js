var _ = require('lodash');
var webpackConfig = require('./common');
var path = require('path');
var path = require('path');
var webpack = require('webpack');
var development = require('./project').development;

const port = 8001;

const plugins = [
	new webpack.HotModuleReplacementPlugin(),
	new webpack.DefinePlugin({
		__BASEURL__: JSON.stringify(development.baseUrl),
		__ISDEV__: true,
		__AUTHPARAMS__: JSON.stringify(development.getParams())
	})
]

// add for hot reload
for (var key in webpackConfig.entry) {
	if (!_.isArray(webpackConfig.entry[key])) {
		webpackConfig.entry[key] = [webpackConfig.entry[key]];
	}

	webpackConfig.entry[key].unshift("webpack-dev-server/client?http://localhost:" + port);
	webpackConfig.entry[key].unshift("webpack/hot/dev-server");
}

webpackConfig.output.publicPath = '/';

webpackConfig.devtool = development.debug ? "cheap-source-map" : "cheap-module-eval-source-map";
webpackConfig.devServer = {
	contentBase: path.resolve(__dirname, '../src'),
	inline: true,
	hot: true,
	port: port,
	progress: true,
	clientLogLevel: 'none'
};

const last = plugins.length - 1;

for (var i = last; i > -1; i--) {
	webpackConfig.plugins.unshift(plugins[i]);
}

module.exports = webpackConfig;