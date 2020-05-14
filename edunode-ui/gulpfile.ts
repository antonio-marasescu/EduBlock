import {exec} from 'child_process';

const childNames = [
  'ng serve --port 4201 --proxy-config src/proxies/proxy-ui-1.conf.json',
  'ng serve --port 4202 --proxy-config src/proxies/proxy-ui-2.conf.json',
  'ng serve --port 4203--proxy-config src/proxies/proxy-ui-3.conf.json',
  'ng serve --port 4204 --proxy-config src/proxies/proxy-ui-4.conf.json',
];


export function initGulpEduNodeUI(gulp, workingDir) {
  gulp.task('eduNode:runNodeUI:A', async (complete) => {
      const child = exec(childNames[0], {cwd: workingDir});
      if (!child) {
        complete();
        return;
      }
      child.stdin?.pipe(process.stdin);
      child.stdout?.pipe(process.stdout);
      child.stderr?.pipe(process.stderr);
      complete();
    }
  );

  gulp.task('eduNode:runNodeUI:B', async (complete) => {
      const child = exec(childNames[1], {cwd: workingDir});
      if (!child) {
        complete();
        return;
      }
      child.stdin?.pipe(process.stdin);
      child.stdout?.pipe(process.stdout);
      child.stderr?.pipe(process.stderr);
      complete();
    }
  );

  gulp.task('eduNode:runNodeUI:C', async (complete) => {
      const child = exec(childNames[2], {cwd: workingDir});
      if (!child) {
        complete();
        return;
      }
      child.stdin?.pipe(process.stdin);
      child.stdout?.pipe(process.stdout);
      child.stderr?.pipe(process.stderr);
      complete();
    }
  );
  gulp.task('eduNode:runNodeUI:D', async (complete) => {
      const child = exec(childNames[3], {cwd: workingDir});
      if (!child) {
        complete();
        return;
      }
      child.stdin?.pipe(process.stdin);
      child.stdout?.pipe(process.stdout);
      child.stderr?.pipe(process.stderr);
      complete();
    }
  );
  gulp.task('eduNode:runNodeUI:all', async (complete) => {
      childNames.forEach(name => {
        const child = exec(name, {cwd: workingDir}
        );
        if (!child) {
          return;
        }
        child.stdin?.pipe(process.stdin);
        child.stdout?.pipe(process.stdout);
        child.stderr?.pipe(process.stderr);
      });
      complete();
    }
  );
}
