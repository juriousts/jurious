import { FileTemplate, ImportTemplate } from "@jurious/templates";

export class IndexFileTemplate extends FileTemplate {
	constructor(name: string) {
		super(name);

		this.imports = [
			new ImportTemplate([], "./app/http/routes/api"),
			new ImportTemplate([], "./structure.json"),
			new ImportTemplate(["App"], "./App")
		];

		this.global = `const app = new App();
app.bootstrap();`;
	}
}
