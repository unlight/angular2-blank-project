## Angular 2 - Seed Project
Light-weight and easy to use seed project for Angular 2 apps

### Stack
- [Gulp 4](http://gulpjs.com/)
- [Angular 2](https://angular.io/)
- [TypeScript](http://www.typescriptlang.org/)
- [SystemJS](https://github.com/systemjs/systemjs)
- [Typings](https://github.com/typings/typings)
- [Karma](http://karma-runner.github.io/)

### Features
- Gulp 4 incremental builds (since, lastRun)
- Unit tests coverage (with remap to TypeScript source)
- Merged pipeline of SASS, LESS and CSS + PostCSS

### Global Dependencies

| Dependency | Install                               |
| ---------- | ------------------------------------- |
| NodeJS     | [nodejs.org](http://nodejs.org/)        |
| Gulp CLI   | `npm install gulpjs/gulp-cli#4.0 -g`  |
| Typings    | `npm install typings -g`              |

### Install
```
git clone https://github.com/unlight/angular2-blank-project.git && cd angular2-blank-project
npm install && typings install
```

### Usage
```
gulp build serve
```
Note: the `serve` task won't automatically launch the browser for you.
To view the app please open a new tab and go to `http://localhost:8080/`.

### Tasks
- `build` Create distribution package
- `test`  Build and run unit tests
- `serve` Start web-server and live-reload
- `clean` Remove generated folders

**Additional arguments:**

* ##### debug
  Tasks will be more versbosed informiong about processing files, etc. You can specify namespace of debug messages.  
  For example, show debug messages from typescript task only:
  ```
  gulp build serve --debug=typescript
  ```
  Debug all:
  ```
  gulp build serve --debug
  gulp build serve --debug=*
  ```

* ##### tests
  Run additional task unit tests. On every change of source or test, unit test will re-run.
  ```
  gulp build serve --tests
  gulp build serve --tests --debug 
  ```

* ##### production
  In production mode all javascript and css files will be combined and minified.
  ```
  gulp build --production
  ```

### RESOURCES
* TypeScript Compiler Options - http://www.typescriptlang.org/docs/handbook/compiler-options.html
* Angular2 Changelog - https://github.com/angular/angular/blob/master/CHANGELOG.md

### TODO

* Import lodash-es from TS
* If changed _bootstrap.scss reset time and reload all
* Fix when changing html reload corresponding component
* Styling
* Combine `typescript` and `typescript-karma` tasks
* Production is broken - https://github.com/ghpabs/angular2-seed-project/issues/56
* When Node6 be ready rewrite gulpfile
* Karma reporter plugin (remove absolute path)
* Check gulp-typescript for reading d.ts files
* Beep on error
* HTTP/2 - https://github.com/systemjs/systemjs/blob/master/docs/production-workflows.md#depcache
* Make more fast cache for typescript task (without gulp.src)
`gulp.src(conf.typings, { since: g.memoryCache.lastMtime("typings") })
  .pipe(g.memoryCache("typings"))`