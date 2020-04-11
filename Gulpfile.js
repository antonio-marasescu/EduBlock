const {exec} = require('child_process');
const madge = require('madge');

const childNames = ['npm run dev node-uni-1', 'npm run dev node-uni-2', 'npm run dev node-uni-3', 'npm run dev node-uni-4'];

exports.runNodeA = function runNodeA(complete) {
    const child = exec(childNames[0]);
    child.stdin.pipe(process.stdin);
    child.stdout.pipe(process.stdout);
    complete();
};

exports.runNodeB = function runNodeB(complete) {
    const child = exec(childNames[1]);
    child.stdin.pipe(process.stdin);
    child.stdout.pipe(process.stdout);
    complete();
};

exports.runNodeC = function runNodeC(complete) {
    const child = exec(childNames[2]);
    child.stdin.pipe(process.stdin);
    child.stdout.pipe(process.stdout);
    complete();
};

exports.runNodeD = function runNodeD(complete) {
    const child = exec(childNames[3]);
    child.stdin.pipe(process.stdin);
    child.stdout.pipe(process.stdout);
    complete();
};

exports.runAllNodes = function runAllNodes(complete) {
    childNames.forEach(name => {
        const child = exec(name);
        child.stdin.pipe(process.stdin);
        child.stdout.pipe(process.stdout);
    });
    complete();
};


exports.generateDependencyGraph = function generateDependencyGraph(complete) {
    madge('app/app.ts')
        .then((res) => res.image('docs/images/dependency-graph.svg'))
        .then((writtenImagePath) => {
            console.log('Image written to ' + writtenImagePath);
        });
    complete();
};

exports.generateDependencyGraphAsDot = function generateDependencyGraphAsDot(complete) {
    madge('app/app.ts')
        .then((res) => res.dot())
        .then((output) => {
            console.log(output);
        });
    complete();
};

exports.checkCircularDependencies = function checkCircularDependencies(complete) {
    madge('app/app.ts')
        .then((res) => console.log(res.circular()));
    complete();
};
