import { FileTemplate, ImportTemplate } from '@jurious/templates';
import { MiddlewareClassTemplate } from './MiddlewareClassTemplate';

export class MiddlewareTemplate extends FileTemplate {
    constructor(name: string = "") {
        super(name);
        this.imports = [
            new ImportTemplate(['Middleware'], '@jurious/core')
        ];

        this.classes = [
            new MiddlewareClassTemplate(name)
        ];
    }
}