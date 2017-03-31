var webpackConfig = require('./common');
var path = require('path');
var webpack = require('webpack');
var cleanPlugin = require('clean-webpack-plugin');
var production = require('./project').production;
var argv = require('yargs').argv;

const plugins = [
	new cleanPlugin(['build'], {
		root: path.resolve()
	}),
	// new webpack.DllReferencePlugin({
	// 	context: process.cwd(),
	// 	manifest: require('../manifest.json')
	// }),	
	new webpack.DefinePlugin({
		__BASEURL__: JSON.stringify(production.baseUrl),
		__ISDEV__: false,
		"process.env.NODE_ENV" : JSON.stringify(process.env.NODE_ENV || "production")
	}),
	new webpack.optimize.UglifyJsPlugin({
		compress: { warnings: false }
	}),
	new webpack.optimize.OccurrenceOrderPlugin(true),
	new webpack.optimize.DedupePlugin()
];

const prefix = argv.te == 1 ? '/zhiniao/znplugin/' : '/zhiniao/static/';
webpackConfig.output.publicPath = prefix + 'lib/';

const last = plugins.length - 1;
for (var i = last; i > -1; i--) {
	webpackConfig.plugins.unshift(plugins[i]);
}

module.exports = webpackConfig;