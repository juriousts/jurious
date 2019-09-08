import { AppClassTemplate } from "./AppClassTemplate";
import { FileTemplate, ImportTemplate } from "@jurious/templates";

export class AppFileTemplate extends FileTemplate {
	constructor(name: string) {
		super(name);

		this.imports = [
			new ImportTemplate(["JuriousApp", "AppAbstract"], "@jurious/core")
		];

		this.classes = [new AppClassTemplate()];
	}
}
