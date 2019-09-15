import {
	WriteStream,
	createWriteStream,
	readFileSync,
	writeFileSync,
	openSync
} from "fs";
import { sep, resolve, join } from "path";
import * as templates from "../Templates";
import { CommandAbstract } from "./CommandAbstract";
import { ProjectPathMiddleware } from "../Middlewares/ProjectPathMiddleware";
import { TemplateTypeMiddleware } from "../Middlewares/TemplateTypeMiddleware";
import { touchDir, findFile } from "../Common/FileSystem";

export class GenerateCommand extends CommandAbstract {
	constructor() {
		super();
		this.name = "generate";
		this.alias = "g";
		this.params = ["type", "filename"];
		this.description = "Generates a new component from given type";
		this.options = [
			{
				name: "path",
				char: "p",
				params: ["path"],
				description: "set file location."
			},
			{
				name: "strict",
				char: "s",
				params: [],
				description: "don't concat type name to class name."
			}
		];
	}

	private editApp(
		app_path: string,
		type: string,
		new_class: string,
		new_path: string
	): void {
		if (!app_path) {
			console.log("inlaid path to App.ts");
			return;
		}
		let delim = app_path[app_path.length - 1] === sep ? "" : sep;
		try {
			let app_path_final = `${app_path}${delim}App.ts`;
			let old: string = readFileSync(app_path_final, "ascii");
			let regex: RegExp = new RegExp(`${type}s\\s*:\\s*\\[`, "i");
			let found = old.match(regex);
			let index: number = found.index + found[0].length;
			let res = old.slice(index).match(/^\s*(\w+,?\s*)+]/);
			let separator = res ? "," : "\n\t";
			let new_app = `import { ${new_class} } from "${new_path}/${new_class}";\n${old.slice(
				0,
				index
			)}\n\t\t${new_class}${separator}${old.slice(index)}`;
			let data: WriteStream = createWriteStream(app_path_final);
			data.write(new_app);
			console.log("App.ts rewrite!");
		} catch (err) {
			console.log("failed to rewrite App.ts");
			console.log(err);
			return;
		}
	}

	@ProjectPathMiddleware()
	@TemplateTypeMiddleware()
	public handle(type: string, filename: string, options: any): void {
		const juriousProperties = JSON.parse(
			readFileSync(resolve(process.cwd(), "jurious.json")).toString()
		);
		let path: string = juriousProperties["defaultPaths"][type];

		if (options && options.path) {
			path = options.path;
		}

		// build the path if isn't exist
		touchDir(path);

		let fixedFilename = `${filename}${type[0].toUpperCase()}${type.slice(
			1
		)}`;

		let template = new templates[type](filename).generate();
		let absPath = resolve(path, `${fixedFilename}.ts`);
		writeFileSync(openSync(absPath, "w"), template);

		let regex = /import/g;
		let appFileContent = readFileSync(openSync("app.ts", "r")).toString();

		let match = null;
		let maxIndex = -1;
		while ((match = regex.exec(appFileContent)) != null) {
			maxIndex = match.index;
		}

		let inputPosition = appFileContent.indexOf(";", maxIndex) + 2;
		let targetString = `import { ${fixedFilename} } from "./${join(
			path,
			fixedFilename
		)}";\n`;

		let updatedFileContent = [
			appFileContent.slice(0, inputPosition),
			targetString,
			appFileContent.slice(inputPosition)
		].join("");

		writeFileSync(openSync("app.ts", "w"), updatedFileContent);
	}
}
