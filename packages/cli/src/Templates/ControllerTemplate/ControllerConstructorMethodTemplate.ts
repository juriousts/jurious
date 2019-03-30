import { MethodTemplate } from "@jurious/templates";

export class ControllerConstructorMethodTemplate extends MethodTemplate {
    constructor() {
        super();
        this.name = "constructor";
        this.params = [];
        this.body = "super();";
    }
}