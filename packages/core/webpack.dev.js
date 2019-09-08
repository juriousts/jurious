const CleanWebpackPlugin = require("clean-webpack-plugin");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
const DeclarationFilesPlugin = require("@jurious/webpack-declaration-files");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const SourceMapFixPlugin = require("@jurious/source-map-fix");

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
				test: /\.js$/,
				use: ["source-map-loader"],
				enforce: "pre"
			},
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
		// minimizer: [
		// 	new TerserPlugin({
		// 		cache: false,
		// 		parallel: true,
		// 		sourceMap: true,
		// 		terserOptions: {
		// 			keep_classnames: true,
		// 			keep_fnames: false
		// 		}
		// 	})
		// ],
		minimize: false
	},
	output: {
		library: "core",
		libraryTarget: "umd",
		filename: "core.js",
		path: path.resolve(__dirname, "dist"),
		devtoolModuleFilenameTemplate: "[absolute-resource-path]"
	},
	target: "node",
	mode: "development",
	devtool: "source-map",
	plugins: [
		new CleanWebpackPlugin(clean_paths, clean_options),
		new SourceMapFixPlugin(),
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
