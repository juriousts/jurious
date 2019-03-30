import { DecoratorTemplate } from './DecoratorTemplate';
import { ITemplate } from "../interfaces/ITemplate";
import { MethodTemplate } from "./MethodTemplate";

export class ClassTemplate implements ITemplate {
    // protected decorators: DecoratorTemplate[];
    protected props: string;
    protected methods: MethodTemplate[];
    protected decorators: DecoratorTemplate[];
    
    protected name: string;
    protected preName: string;
    protected parentClass: string;
    protected interfaces: string[];

    constructor() {
        this.name = "";
        this.preName = "";
        this.parentClass = "";
        this.interfaces = [];
        this.methods = [];
        this.props = "";
    }

    private get ParentClass(): string {
        return this.parentClass ? ` extends ${this.parentClass}` : '';
    }

    private get Interfaces(): string {
        return this.interfaces.length > 0 ? ` implements ${this.interfaces.join(', ')}` : '';
    }

    private get PreName(): string {
        return this.preName ? this.preName + ' ' : '';
    }

    private get Name(): string {
        return this.name;
    }

    private get Props(): string {
        return this.props;
    }

    private get Methods(): string { 
        return this.methods
                .map(method => method.generate())
                .join('\n');
    }

    private get Decorators(): string {
        return this.decorators
                    .map(decorator => decorator.generate())
                    .join('\n');
    }
    
    public generate(): string {
        return `${this.Decorators}\n${this.PreName}class ${this.Name}${this.ParentClass}${this.Interfaces} {
    ${this.Props}${this.Methods}
}`;
    }
}