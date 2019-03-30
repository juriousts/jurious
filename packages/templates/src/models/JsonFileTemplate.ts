import { FileTemplate } from ".";

export class JsonFileTemplate extends FileTemplate {
    constructor(name: string, obj: object) {
        super(name);

        this.global = JSON.stringify(obj, null, "\t");
    }
}