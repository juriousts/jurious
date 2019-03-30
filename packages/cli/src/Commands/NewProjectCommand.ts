import { AppFileTemplate } from './../Templates/NewProjectTemplate/AppTemplate/AppFileTemplate';
import { ApiFileTemplate } from './../Templates/NewProjectTemplate/ApiTemplate/ApiFileTemplate';
import { FolderTemplate, JsonFileTemplate } from '@jurious/templates';
import {execSync} from 'child_process';
import {CommandAbstract} from './CommandAbstract';
import { IndexFileTemplate } from '../Templates/NewProjectTemplate/IndexTemplate/IndexFileTemplate';
import { Command } from 'commander';

const juriousJsonFile = {
    defaultPaths: {
        app: ".",
        controller: "./app/http/controllers",
        middleware: "./app/http/middlewares"
    },
    metadata: {}
};

const structureJsonFile = {
    connections: [
        {
            name: "",
            protocol: "HTTP",
            host: "127.0.0.1",
            port: 8400
        }
    ],
    microservices: []
};

const tsconfigJsonFile = {
    compilerOptions: {
        target: "es6", /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */
        module: "commonjs", /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
        declaration: false, /* Generates corresponding '.d.ts' file. */
        strict: true, /* Enable all strict type-checking options. */
        noImplicitAny: false, /* Raise error on expressions and declarations with an implied 'any' type. */
        strictPropertyInitialization: false, /* Enable strict checking of property initialization in classes. */
        moduleResolution: "node", /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
        esModuleInterop: true, /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
        experimentalDecorators: true, /* Enables experimental support for ES7 decorators. */
    },
    include: [
        "**/*"
    ]
};

export class NewProjectCommand extends CommandAbstract {
    constructor() {
        super();
        this.alias = 'nw';
        this.name = 'new';
        this.description = "Create a new Jurious project app";
        this.params = ['projectName'];
        this.options = [
            {
                name: "empty",
                char: "e",
                params: [],
                description: "Do not install dependancies, only start npm project"
            }
        ];
    }

    public handle(name: string, command: Command) {
        let projFolder = 
            new FolderTemplate(name)
                .addFile(new JsonFileTemplate("jurious.json", juriousJsonFile))
                .addFile(new JsonFileTemplate("structure.json", structureJsonFile))
                .addFile(new JsonFileTemplate("tsconfig.json", tsconfigJsonFile))
                .addFile(new IndexFileTemplate("index.ts"))
                .addFile(new AppFileTemplate("app.ts"));

        projFolder.addFolder("App/Http/Routes")
            .addFile(new ApiFileTemplate("api.ts"));

        projFolder.generate();

        execSync('npm init -y', { encoding:'ascii' });

        if (!command.empty) {
            execSync('npm install @jurious/core', { encoding:'ascii' });
        }
    }
}