import { existsSync, mkdirSync, openSync, writeFileSync, closeSync } from 'fs';
import { FileTemplate } from './FileTemplate';
import { chdir } from 'process';

export class FolderTemplate {
    private files: Map<string, FileTemplate>;
    private folders: Map<string, FolderTemplate>;

    constructor(private name: string) {
        this.files = new Map<string, FileTemplate>();
        this.folders = new Map<string, FolderTemplate>();
    }

    public addFolder(name: string): FolderTemplate {
        let folders: string[] = name.split('/');

        let iter: FolderTemplate = this;
        while (folders.length > 0) {
            const folder: any = folders.shift();
            let next = iter.addFolderHelper(folder, new FolderTemplate(folder));
            if (!next) {
                break;
            }

            iter = next;
        }
        
        return iter;
    }

    public addFile(file: FileTemplate): FolderTemplate {
        const name = file.Name;
        
        if (!this.files.has(name)) {
            this.files.set(name, file);
        }
        
        return this;
    }

    private addFolderHelper(name: string, folder: FolderTemplate): FolderTemplate | undefined {
        if (!this.validateName(name)) {
            return undefined;
        }

        if (this.folders.has(name)) {
            return this.folders.get(name);
        }

        this.folders.set(name, folder);

        return folder;
    }

    public hasFolder(name: string): boolean {
        return this.folders.has(name);
    }

    public hasFile(name: string): boolean {
        return this.files.has(name);
    }

    private validateName(name) {
        if (name === undefined) {
            return false;
        }

        if (name.trim() === '' || name.indexOf('/') !== -1) {
            return false;
        }

        return true;
    }

    private create(): void {
        if (existsSync(`./${this.name}`)) {
            return;
        }

        // Create the folder
        mkdirSync(this.name);

        // Move into it
        chdir(this.name);

        // Create files
        for (let file of this.files.values()) {
            let fileDescriptor = openSync(file.Name, 'w');
            writeFileSync(fileDescriptor, file.generate());           
            closeSync(fileDescriptor);
        }
    }

    public generate(): void {
        this.create();
        // Create sub-directories
        for (let folder of this.folders.values()) {
            folder.generate();
            chdir('..');
        }
    }
    
}