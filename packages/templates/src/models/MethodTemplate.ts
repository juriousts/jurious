import { ITemplate } from "../interfaces/ITemplate";

export class MethodTemplate implements ITemplate {
    protected name: string;
    protected params: string[];
    protected returnValue: string;
    protected preName: string;
    protected body: string;

    constructor() {
        this.name = "";
        this.params = [];
        this.returnValue = "";
        this.preName = "";
        this.body = "";
    }

    private get PreName(): string {
        return this.preName ? this.preName + ' ' : '';
    }

    private get Name(): string {
        return this.name;
    }

    private get Params(): string {
        return this.params.join(', ');
    }

    private get ReturnValue(): string { 
        return this.returnValue ? `: ${this.returnValue}` : '';
    }

    private get Body(): string { 
        return this.body;
    }
    
    public generate(): string {
        return `
    ${this.PreName}${this.Name}(${this.Params})${this.ReturnValue} {
        ${this.Body}
    }`;
    }
    
}