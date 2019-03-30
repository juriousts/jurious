import { MethodTemplate } from "@jurious/templates";

export class MiddlewareConstructorMethodTemplate extends MethodTemplate {
    constructor() {
        super();
        this.name = "constructor";
        this.params = [];
        this.body = "super();";
    }
}