import { FileTemplate, ImportTemplate } from '@jurious/templates';
import { ControllerClassTemplate } from './ControllerClassTemplate';

export class ControllerTemplate extends FileTemplate {
    constructor(name: string = "") {
        super(name);
        this.imports = [
            new ImportTemplate(['Controller'], '@jurious/core')
        ];

        this.classes = [
            new ControllerClassTemplate(name)
        ];
    }
}