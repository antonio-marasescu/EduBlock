import {exec} from "child_process";

import madge from "madge";

const childNames = ['npm run dev node-uni-1', 'npm run dev node-uni-2', 'npm run dev node-uni-3', 'npm run dev node-uni-4'];


export function initGulpEduNode(gulp, workingDir) {
    gulp.task('runNode:A', async (complete) => {
            const child = exec(childNames[0], {cwd: workingDir});
            if (!child) {
                complete();
                return;
            }
            child.stdout?.on('data', chunk =>
                process.stdout.write(chunk));
            // child.stdin?.pipe(process.stdin);
            // child.stdout?.pipe(process.stdout);
            complete();
        }
    );

    gulp.task('runNode:B', async (complete) => {
            const child = exec(childNames[1], {cwd: workingDir});
            if (!child) {
                complete();
                return;
            }
            child.stdin?.pipe(process.stdin);
            child.stdout?.pipe(process.stdout);
            complete();
        }
    );

    gulp.task('runNode:C', async (complete) => {
            const child = exec(childNames[2], {cwd: workingDir});
            if (!child) {
                complete();
                return;
            }
            child.stdin?.pipe(process.stdin);
            child.stdout?.pipe(process.stdout);
            complete();
        }
    );
    gulp.task('runNode:D', async (complete) => {
            const child = exec(childNames[3], {cwd: workingDir});
            if (!child) {
                complete();
                return;
            }
            child.stdin?.pipe(process.stdin);
            child.stdout?.pipe(process.stdout);
            complete();
        }
    );
    gulp.task('runNode:all', async (complete) => {
            childNames.forEach(name => {
                const child = exec(name, {cwd: workingDir}
                );
                if (!child) {
                    return;
                }
                child.stdin?.pipe(process.stdin);
                child.stdout?.pipe(process.stdout);
            });
            complete();
        }
    );
    gulp.task('generate:dependency-graph', async (complete) => {
            madge('app/app.ts')
                .then((res) => res.image('docs/images/dependency-graph/complete.svg'))
                .then((writtenImagePath) => {
                    console.log('Image written to ' + writtenImagePath);
                });
            const child = exec('npm run generate-dependency');
            if (!child) {
                return;
            }
            child.stdin?.pipe(process.stdin);
            child.stdout?.pipe(process.stdout);
            complete();
        }
    );


    gulp.task('check:circular-dependencies', async (complete) => {
            madge('app/app.ts')
                .then((res) => console.log(res.circular()));
            complete();
        }
    );
}
