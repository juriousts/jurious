import { ImportTemplate } from "./ImportTemplate";
import { ITemplate } from "../interfaces/ITemplate";
import { ClassTemplate } from "./ClassTemplate";

export class FileTemplate implements ITemplate {
    protected global: string;
    protected imports: ImportTemplate[];
    protected classes: ClassTemplate[];
    
    constructor(private name: string) {
        this.imports = [];
        this.classes = [];
        this.global = "";
    }

    public get Name(): string { 
        return this.name;
    }

    private get Imports(): string {
        return this.imports
                    .map(imp => imp.generate())
                    .join('\n');
    }

    private get Classes(): string {
        return this.classes
                .map(c => c.generate())
                .join('\n\n');
    }
    
    public generate(): string {
        return `${this.Imports}\n\n${this.Classes}\n\n${this.global}`;
    }
    
}