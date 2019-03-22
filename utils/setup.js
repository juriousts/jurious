const { execSync } = require('child_process');
const { readdirSync, readFileSync, existsSync } = require('fs');
const { resolve } = require('path');

const setupFile = 'setup.json';
let files = [];

const packagesDir = resolve(__dirname, '..', 'packages');
const packages = readdirSync(packagesDir);
for (let package of packages) {
    const setupFilePath = resolve(packagesDir, package, setupFile);
    if (!existsSync(setupFilePath)) {
        continue;
    }

    let file = JSON.parse(readFileSync(setupFilePath).toString());

    file.path = resolve(packagesDir, package);
    files.push(file);
}

files.sort((f1, f2) => f1.id > f2.id ? 1 : -1);

for (file of files) {
    process.chdir(file.path);
    console.info(`------------------------------------------------`);
    console.info(`- Installing module: ${file.title}             -`);
    for (command of file.commands) {
        console.info(`- Running command: ${command}                  -`);
        console.info(`------------------------------------------------`);
        console.info(execSync(command).toString());
        console.info(`------------------------------------------------\n`);
    }
}