const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
const DeclarationFilesPlugin = require("@jurious/webpack-declaration-files");
const webpack = require("webpack");

// Clean configurations
const clean_paths = ["dist"];

const clean_options = {
	watch: true
};

module.exports = {
	entry: "./src/index.ts",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				uglifyOptions: {
					keep_classnames: true
				}
			})
		]
	},
	output: {
		library: "core",
		libraryTarget: "umd",
		filename: "core.js",
		path: path.resolve(__dirname, "dist")
	},
	target: "node",
	mode: "production",
	devtool: false,
	plugins: [
		new CleanWebpackPlugin(clean_paths, clean_options),
		new DeclarationFilesPlugin({
			merge: true,
			include: [
				"Request",
				"Response",
				"Router",
				"AppAbstract",
				"JuriousApp",
				"Controller",
				"Middleware",
				"Route",
				"Method",
				"RouteInstance",
				"RouteOptions",
				"Params",
				"Map",
				"RouteTargetParser",
				"RouteDefaultParser",
				"NetworkAdapter",
				"NetworkAdapterParser"
			]
		})
	]
};
