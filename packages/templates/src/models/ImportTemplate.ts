import { ITemplate } from "../interfaces/ITemplate";

export class ImportTemplate implements ITemplate {
    protected modules: string[];
    protected library: string;   
    
    constructor(modules: string[], library: string) {
        this.modules = modules;
        this.library = library;
    }

    private get Modules(): string {
        return this.modules.join(', ');
    }

    public generate(): string {
        let modules = this.Modules;

        let template = "";
        if (!modules) {
            template = `import '${this.library}';`
        } else {
            template = `import { ${modules} } from '${this.library}';`;
        }
        
        return template;
    }

    
}