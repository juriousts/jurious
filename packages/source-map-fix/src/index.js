const fs = require("fs");
const path = require("path");
const { chdir, cwd } = process;
const { execSync } = require("child_process");
const SourceMapConsumer = require("source-map").SourceMapConsumer;
const SourceMapGenerator = require("source-map").SourceMapGenerator;
const to = require("await-to-js").default;

const mainDir = "/Users/uriahahrak/Desktop/jurious/jurious/packages/core";
const distDir = "dist";
const srcDir = "src";
const targetGenerated = "core.js";

class SourceMapFixPlugin {
	constructor(options = {}) {
		const defaults = {
			fileRegex: /(!\*\*\*)(.*\.ts)(.*\*\*\*!)/i,
			startModuleRegex: /\(function\(module, exports, __webpack_require__\) {/,
			srcDir: "src"
		};
		this.options = Object.assign(defaults, options);
	}

	apply(compiler) {
		compiler.hooks.done.tap("SourceMapFixPlugin", async (a) => {
			this.extendOptions(a);

			const { mainDir, distDir, targetGenerated } = this.options;

			this.createSourceMaps(mainDir);

			const generator = new SourceMapGenerator({
				file: `${distDir}/${targetGenerated}`
			});

			let jsFile = fs
				.readFileSync(path.resolve(distDir, targetGenerated))
				.toString()
				.split("\n");

			await to(this.activate(jsFile, generator));

			fs.writeFileSync(
				path.resolve(distDir, `${targetGenerated}.map`),
				generator.toString()
			);
		});
	}

	extendOptions(a) {
		const { context } = a.compilation.compiler.options;
		const { path, filename } = a.compilation.compiler.options.output;

		this.options = Object.assign(this.options, {
			mainDir: context,
			distDir: path,
			targetGenerated: filename
		});
	}

	search(arr, regex, index = [0, null]) {
		if (index === null) {
			return null;
		}

		index = index[0];

		for (let i = index; i < arr.length; i++) {
			let line = arr[i];

			let result = line.match(regex);
			if (!result) {
				continue;
			}

			return [i + 1, result];
		}

		return null;
	}

	start(arr, index, lines) {
		let offsetOriginal = lines;
		let i = index;
		while (lines >= 0) {
			i++;

			if (arr[i] == "\n") {
				continue;
			}

			lines--;
		}

		return [index, i - index + 1, offsetOriginal];
	}

	createSourceMaps() {
		const { mainDir, distDir, srcDir } = this.options;

		const pwd = cwd();

		if (!fs.existsSync(mainDir)) {
			// fs.mkdirSync(mainDir, { recursive: true });
			return;
		}

		chdir(path.resolve(mainDir));

		const cmd = `tsc -sourcemap --outDir ${path.resolve(distDir, srcDir)}`;

		// remove(mainDir, (fpath) => !path.basename(fpath).endsWith(".js.map"));
		try {
			execSync(cmd);
		} catch (err) {
			console.log(err.stdout.toString());
		}

		chdir(pwd);
	}

	async create(jsFile, index, generator, rawSourceMap, jsmapAbsolutePath) {
		const [err, consumer] = await to(new SourceMapConsumer(rawSourceMap));

		let startIndex = null,
			offsetGenerated = null,
			offsetOriginal = null;

		let bool = false;
		consumer.eachMapping(
			(m) => {
				const {
					originalLine,
					originalColumn,
					generatedLine,
					generatedColumn,
					source,
					name
				} = m;

				if (!bool) {
					[startIndex, offsetGenerated, offsetOriginal] = this.start(
						jsFile,
						index,
						generatedLine
					);
					bool = true;
				}

				generator.addMapping({
					source: path.resolve(jsmapAbsolutePath, "..", source),
					original: { line: originalLine, column: originalColumn },
					generated: {
						line:
							startIndex +
							offsetGenerated +
							(generatedLine - offsetOriginal),
						column: generatedColumn
					},
					name: name
				});
			},
			global,
			SourceMapConsumer.ORIGINAL_ORDER
		);

		consumer.destroy();

		return Promise.resolve(true);
	}

	ls(dir = ".", filter = (path) => true) {
		let result = [];
		const contents = fs.readdirSync(dir);

		for (let name of contents) {
			const fullPath = path.resolve(dir, name);

			if (filter(fullPath)) {
				result.push(fullPath);
			}

			if (fs.statSync(fullPath).isDirectory()) {
				result = result.concat(ls(fullPath, filter));
			}
		}

		return result;
	}

	remove(dest = ".", filter = (fpath) => true) {
		const contents = fs.readdirSync(dest);

		for (let name of contents) {
			const fullPath = path.resolve(dest, name);

			if (!filter(fullPath)) {
				continue;
			}

			const stats = fs.statSync(fullPath);

			if (stats.isDirectory()) {
				remove(fullPath);

				if (ls(fullPath).length <= 0) {
					fs.rmdirSync(fullPath);
				}
			} else if (stats.isFile()) {
				fs.unlinkSync(fullPath);
			}
		}
	}

	async activate(jsFile, generator) {
		const { fileRegex, startModuleRegex, distDir } = this.options;

		const pwd = cwd();

		chdir(distDir);

		let fileSearchResult = this.search(jsFile, fileRegex);
		let searchResult = this.search(
			jsFile,
			startModuleRegex,
			fileSearchResult
		);

		while (searchResult != null) {
			let [index2, result] = fileSearchResult;
			let [index] = searchResult;

			let jsmapAbsolutePath = path.resolve(
				".",
				result[2].trim().replace(".ts", ".js.map")
			);

			let jsmapFile = fs.readFileSync(jsmapAbsolutePath);

			const rawSourceMap = JSON.parse(jsmapFile);

			await to(
				this.create(
					jsFile,
					index,
					generator,
					rawSourceMap,
					jsmapAbsolutePath
				)
			);

			fileSearchResult = this.search(jsFile, fileRegex, [index2 + 1]);
			searchResult = this.search(
				jsFile,
				startModuleRegex,
				fileSearchResult
			);
		}

		chdir(pwd);
	}
}

module.exports = SourceMapFixPlugin;
