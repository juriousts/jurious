import { JuriousAppDecoratorTemplate } from "./JuriousAppDecoratorTemplate";
import { ClassTemplate } from "@jurious/templates";
import { AppConstructorMethodTemplate } from "./AppConstructorMethodTemplate";

export class AppClassTemplate extends ClassTemplate {
	constructor() {
		super();

		this.preName = "export";
		this.parentClass = "AppAbstract";
		this.name = "App";

		this.methods = [new AppConstructorMethodTemplate()];

		this.decorators = [new JuriousAppDecoratorTemplate()];
	}
}
