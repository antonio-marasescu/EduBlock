import {exec} from "child_process";

const childNames = ['npm run dev node-worker-uni-1', 'npm run dev node-worker-uni-2',
    'npm run dev node-worker-uni-3', 'npm run dev node-worker-uni-4'];


export function initGulpEduNodeWorker(gulp, workingDir) {
    gulp.task('eduNode:runNodeWorker:A', async (complete) => {
            const child = exec(childNames[0], {cwd: workingDir});
            if (!child) {
                complete();
                return;
            }
            child.stdout?.on('data', chunk =>
                process.stdout.write(chunk));
            complete();
        }
    );

    gulp.task('eduNode:runNodeWorker:B', async (complete) => {
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

    gulp.task('eduNode:runNodeWorker:C', async (complete) => {
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
    gulp.task('eduNode:runNodeWorker:D', async (complete) => {
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
    gulp.task('eduNode:runNodeWorker:all', async (complete) => {
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
}
