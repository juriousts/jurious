const fs = require("fs");
const path = require("path");
const { chdir, cwd } = process;
const { execSync } = require("child_process");
const SourceMapConsumer = require("source-map").SourceMapConsumer;
const SourceMapGenerator = require("source-map").SourceMapGenerator;
const to = require("await-to-js").default;

const search = (arr, regex, index = [0, null]) => {
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
};

const start = (arr, index, lines) => {
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
};

const createSourceMaps = (mainDir) => {
	const pwd = cwd();

	if (!fs.existsSync(mainDir)) {
		// fs.mkdirSync(mainDir, { recursive: true });
		return;
	}

	chdir(path.resolve(mainDir));

	const cmd = `tsc -sourcemap --outDir ${path.resolve(".", distDir, srcDir)}`;

	// remove(mainDir, (fpath) => !path.basename(fpath).endsWith(".js.map"));
	execSync(cmd);

	chdir(pwd);
};

const create = async (
	jsFile,
	index,
	generator,
	rawSourceMap,
	jsmapAbsolutePath
) => {
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
				[startIndex, offsetGenerated, offsetOriginal] = start(
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
};

const ls = (dir = ".", filter = (path) => true) => {
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
};

const copy = (files = [], dest = ".") => {
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest);
	}

	for (let file of files) {
		const basename = path.basename(file);
		fs.copyFileSync(file, path.resolve(dest, basename));
	}
};

const remove = (dest = ".", filter = (fpath) => true) => {
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
};

const activate = async (jsFile, generator) => {
	const pwd = cwd();

	chdir(path.resolve(mainDir, distDir));

	let fileSearchResult = search(jsFile, fileRegex);
	let searchResult = search(jsFile, startModuleRegex, fileSearchResult);

	while (searchResult != null) {
		let [index2, result] = fileSearchResult;
		let [index] = searchResult;

		let jsmapAbsolutePath = path.resolve(
			".",
			result[2].trim().replace(".ts", ".js.map")
		);

		let jsmapFile = fs.readFileSync(jsmapAbsolutePath);

		const rawSourceMap = JSON.parse(jsmapFile);

		// const bu = cwd();
		// chdir(`./${srcDir}`);

		await to(
			create(jsFile, index, generator, rawSourceMap, jsmapAbsolutePath)
		);

		// chdir(bu);

		fileSearchResult = search(jsFile, fileRegex, [index2 + 1]);
		searchResult = search(jsFile, startModuleRegex, fileSearchResult);
	}

	chdir(pwd);
};

const relative = "../packages/core";
const fileRegex = /(!\*\*\*)(.*\.ts)(.*\*\*\*!)/i;
const startModuleRegex = /\(function\(module, exports, __webpack_require__\) {/;
const mainDir = "/Users/uriahahrak/Desktop/jurious/jurious/packages/core";
const distDir = "dist";
const srcDir = "src";
const targetGenerated = "core.js";

createSourceMaps(mainDir);

const generator = new SourceMapGenerator({
	file: `${mainDir}/${distDir}/${targetGenerated}`
});

// copy(sourceMapFiles, path.resolve(mainDir));

let jsFile = fs
	.readFileSync(path.resolve(relative, distDir, targetGenerated))
	.toString()
	.split("\n");

(async () => {
	await to(activate(jsFile, generator));

	fs.writeFileSync(
		path.resolve(relative, distDir, `${targetGenerated}.map`),
		generator.toString()
	);
})();
