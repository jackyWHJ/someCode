const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssExtractPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const packageJson = require('../package.json');
const pxtorem = require('postcss-pxtorem');
// const glob = require('glob');

// const svgDirs = [];
// glob.sync('node_modules/**/*antd-mobile/lib', {dot: true}).forEach( p => {
// 	svgDirs.push(new RegExp(p));
// })

module.exports = {
	entry: packageJson.entry,

	output: {
		filename: '[name].[hash].js',
		path: 'build/lib',
		chunkFilename: '[name].js'
	},

	module: {
		loaders: [
			{
				test: /\.(jsx|js)$/,
				include: [path.resolve('src')],
				loader: "babel?presets[]=es2015&presets[]=react&presets[]=stage-1&plugins[]=add-module-exports",
				exclude: function(path) {
					// 路径中含有 node_modules 的就不去解析。
					var isNpmModule = !!path.match(/node_modules/);
					return isNpmModule;
				},
			},
			{
		        test: /\.css$/,
		        include: /node_modules/,
		        loader: CssExtractPlugin.extract("style-loader", "css-loader!postcss")
		    },
		    {
		    	test: /\.scss$/,
		    	include: [path.resolve('src')],
		    	loader: CssExtractPlugin.extract("style-loader", "css-loader!sass!postcss")
		    },
		    {
		    	test: /\.(png|jpg|gif)$/,
		    	include: [path.resolve('src/img')],
		    	// loader: 'url?limit=8192&name=../img/[hash:8].[name].[ext]'
		    	loader: 'url',
		    	query: {
		    		limit: 8192,
		    		name: '../img/[hash:8].[name].[ext]'
		    	}
		    }, 
		    {
		    	test: /\.svg$/,
		    	exclude: function(path) {
		    		var isAntd = !!path.match(/antd-mobile/);
		    		return !isAntd;
		    	},
		    	loader: 'svg-sprite'
		    }
		]
	},

	postcss: [
	    pxtorem({
	      rootValue: 100,
	      propWhiteList: []
	    }),
	    require('postcss-font-magician')()
	],

	resolve: {
		root: path.resolve(),
		modulesDirectories: ["src", "node_modules"],
		extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx", ".json", ".html", ".css", ".scss"],
		alias: {
			"zn-common": path.resolve('src/common'),
			"zn-container": path.resolve('src/common/lib/react-redux-container'),
			"zn-component": path.resolve('src/common/components'),
			"zn-image": path.resolve('src/img')
		}
	},

	plugins: [
		new webpack.DefinePlugin({
			__VER__: JSON.stringify(packageJson.version)
		}),
		new webpack.ProvidePlugin({
			Util: "zn-common/utils/util.js",
			Ajax: "zn-common/utils/ajax"
		}),
		new HtmlWebpackPlugin({
			template: "src/templates/index.html",
			filename: "../index.html",
			hash: true
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: ["vendor"],
			filename: "common.js"
		}),
		new CssExtractPlugin('../style/style.css')
	]
}