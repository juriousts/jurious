import { MiddlewareConstructorMethodTemplate } from './MiddlewareConstructorMethodTemplate';
import { ClassTemplate } from "@jurious/templates";
import { MiddlewareHandleMethodTemplate } from './MiddlewareHandleMethodTemplate';

export class MiddlewareClassTemplate extends ClassTemplate {
    constructor(name: string = "") {
        super();
        this.preName = "export";
        this.parentClass = "Middleware";
        this.name = name.indexOf('Middleware') != -1 ? name : `${name}Middleware`;
        this.methods = [
            new MiddlewareConstructorMethodTemplate(),
            new MiddlewareHandleMethodTemplate()
        ];
    }   
}