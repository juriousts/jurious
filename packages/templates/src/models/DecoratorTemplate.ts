import { ITemplate } from "../interfaces/ITemplate";

export class DecoratorTemplate implements ITemplate {   
    protected params: object;

    constructor(private name: string) {}

    private get Params(): string {
        return JSON.stringify(this.params, null, "\t");
    }

    private get Name(): string {
        return this.name;
    }
    
    public generate(): string {
        return `@${this.Name}(${this.Params})`;
    }
    
}