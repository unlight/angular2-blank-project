## Angular 2 - Seed Project

### Stack
- [Gulp 4](http://gulpjs.com/)
- [Angular 2](https://angular.io/)
- [TypeScript](http://www.typescriptlang.org/)
- [SystemJS](https://github.com/systemjs/systemjs)
- [Typings](https://github.com/typings/typings)
- [Karma](http://karma-runner.github.io/)

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
- `clean` Remove generated folders - `build`, `coverage`.
- `test` Run Karma against all `src/scripts/**/*.spec.ts` files.
- `build` Create distribution package.
- `serve` Start web-server and live-reload.

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

* ##### production
  In production mode all javascript and css files will be combined and minified.
  ```
  gulp build serve --production
  ```

### TODO

* Make more fast cache for typescript task (without gulp.src)
```
gulp.src(conf.typings, { since: g.memoryCache.lastMtime("typings") })
	.pipe(g.memoryCache("typings")),
```
* Styling
* Less
* Combine `typescript` and `typescript-karma` tasks
* Incremental unit tests
* Production is broken - https://github.com/ghpabs/angular2-seed-project/issues/56
* HTTP/2 - https://github.com/systemjs/systemjs/blob/master/docs/production-workflows.md#depcache