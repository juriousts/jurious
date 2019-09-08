import { ControllerConstructorMethodTemplate } from "./ControllerConstructorMethodTemplate";
import { ClassTemplate } from "@jurious/templates";

export class ControllerClassTemplate extends ClassTemplate {
	constructor(name: string = "") {
		super();
		this.preName = "export";
		this.parentClass = "Controller";
		this.name =
			name.indexOf("Controller") != -1 ? name : `${name}Controller`;
		this.methods = [new ControllerConstructorMethodTemplate()];
	}
}
