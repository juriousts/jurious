import { MethodTemplate } from "@jurious/templates";

export class MiddlewareHandleMethodTemplate extends MethodTemplate {
    constructor() {
        super();
        this.preName = "public";
        this.name = "handle";
        this.returnValue = "boolean | Promise<boolean>";
        this.body = "return true;"
    }   
}