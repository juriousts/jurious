const webpack = require("webpack");

const CleanWebpackPlugin = require("clean-webpack-plugin");
var nodeExternals = require("webpack-node-externals");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
const WebpackBar = require("webpackbar");
const DeclarationFilesPlugin = require("@jurious/webpack-declaration-files");
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
				use: "ts-loader"
			}
		]
	},
	externals: [
		nodeExternals({
			modulesFromFile: true
		})
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				terserOptions: {
					keep_classnames: true,
					keep_fnames: false
				}
			})
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
		libraryTarget: "commonjs",
		library: "bundle"
	},
	target: "node",
	node: {
		__dirname: false,
		__filename: false
	},
	mode: "development",
	plugins: [
		new CleanWebpackPlugin(clean_paths, clean_options),
		// new UglifyJsPlugin(),
		new WebpackBar({
			name: "Jurious"
		}),
		new DeclarationFilesPlugin({
			merge: true,
			include: ["CommandAbstract", "IOption"]
		}),
		new webpack.BannerPlugin({
			banner: "#!/usr/bin/env node",
			raw: true
		})
	]
};
