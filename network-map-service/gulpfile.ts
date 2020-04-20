import {exec} from "child_process";

const childNames = ['npm run dev nms'];


export function initGulpNMS(gulp, workingDir) {
    gulp.task('nms:runNode', async (complete) => {
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
}
