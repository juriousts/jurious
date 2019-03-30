const { execSync } = require('child_process');
const { readdirSync, readFileSync, existsSync } = require('fs');
const { resolve } = require('path');
const { Graph, alg } = require("@dagrejs/graphlib");

const setupFile = 'setup.json';
let filesGraph = new Graph();

const packagesDir = resolve(__dirname, '..', 'packages');
const packages = readdirSync(packagesDir);
for (let package of packages) {
    const setupFilePath = resolve(packagesDir, package, setupFile);
    if (!existsSync(setupFilePath)) {
        continue;
    }

    let file = JSON.parse(readFileSync(setupFilePath).toString());

    file.path = resolve(packagesDir, package);
    filesGraph.setNode(file.id, file);
}

for (let node of filesGraph.nodes()) {
    let file = filesGraph.node(node);
    for (let dep of file.dependancies) {
        filesGraph.setEdge(node, dep);
    }
}

let nodes = alg.topsort(filesGraph).reverse();

for (node of nodes) {
    let file = filesGraph.node(node);

    // process.chdir(file.path);
    console.info(`------------------------------------------------`);
    console.info(`- Installing module: ${file.title}             -`);
    for (command of file.commands) {
        console.info(`- Running command: ${command}                  -`);
        console.info(`------------------------------------------------`);
        console.info(execSync(command).toString());
        console.info(`------------------------------------------------\n`);
    }
}