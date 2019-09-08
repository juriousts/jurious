const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
const DeclarationFilesPlugin = require("@jurious/webpack-declaration-files");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

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
			},
			{
				test: /\.js$/,
				use: ["source-map-loader"],
				enforce: "pre"
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				sourceMap: true,
				terserOptions: {
					keep_classnames: true,
					keep_fnames: false
				}
			})
		]
		// minimize: false
	},
	output: {
		library: "templates",
		libraryTarget: "umd",
		filename: "templates.js",
		path: path.resolve(__dirname, "dist"),
		devtoolModuleFilenameTemplate: "[absolute-resource-path]"
	},
	target: "node",
	mode: "production",
	devtool: "source-map",
	plugins: [
		new CleanWebpackPlugin(clean_paths, clean_options),
		new DeclarationFilesPlugin({
			merge: true,
			include: [
				"ITemplate",
				"ClassTemplate",
				"FileTemplate",
				"ImportTemplate",
				"MethodTemplate",
				"FolderTemplate",
				"JsonFileTemplate",
				"DecoratorTemplate"
			]
		})
	]
};
