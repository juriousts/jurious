import { FileTemplate, ImportTemplate } from "@jurious/templates";

export class ApiFileTemplate extends FileTemplate {
    constructor(name: string) {
        super(name);

        this.imports = [
            new ImportTemplate(['Router'], '@jurious/router')
        ];
    }   
}


