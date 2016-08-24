## Angular 2 - Project
Light-weight and easy to use seed project for Angular 2 apps.  
Based on [ghpabs/angular2-seed-project](https://github.com/ghpabs/angular2-seed-project) and [mraible/angular2-tutorial](https://github.com/mraible/angular2-tutorial)

### STACK
- [Gulp 4](http://gulpjs.com/)
- [Angular 2](https://angular.io/)
- [TypeScript](http://www.typescriptlang.org/)
- [SystemJS](https://github.com/systemjs/systemjs)
- [Typings](https://github.com/typings/typings)
- [Karma](http://karma-runner.github.io/)
- [Protractor](http://www.protractortest.org/)
- [Codelyzer](https://github.com/mgechev/codelyzer)

### FEATURES
- Gulp 4 incremental builds (since, lastRun)
- Unit tests coverage (with remap to TypeScript source)
- Merged pipeline of SASS, LESS and CSS + PostCSS

### GLOBAL DEPENDENCIES

| Dependency | Install                               |
| ---------- | ------------------------------------- |
| NodeJS     | [nodejs.org](http://nodejs.org/)      |
| Gulp CLI   | `npm install gulpjs/gulp-cli#4.0 -g`  |
| Typings    | `npm install typings -g`              |
| Protractor | `npm install -g protractor`           |

### INSTALL
```
git clone https://github.com/unlight/angular2-blank-project.git && cd angular2-blank-project
npm install && typings install
# to run end-to-end tests by protractor you need chromium
choco install chromium
```

### USAGE
```
gulp serve
```
Note: the `serve` task won't automatically launch the browser for you.
To view the app please open a new tab and go to `http://localhost:8080/`.

### TASKS
- `build` Create distribution package
- `test`  Build and run unit tests
- `serve` Start web-server and live-reload
- `karma` Run unit tests
- `protractor` Run end-to-end tests
- `clean` Remove generated folders

**Additional arguments:**

* ##### debug
  Tasks will be more versbosed informiong about processing files, etc. You can specify namespace of debug messages.  
  For example, show debug messages from typescript task only:
  ```
  gulp serve --debug=typescript
  ```
  Debug all:
  ```
  gulp serve --debug
  gulp serve --debug=*
  ```

* ##### production
  In production mode all javascript and css files will be combined and minified.
  ```
  gulp build --production
  ```

### TESTS
To run unit tests in watch mode:
```
gulp test watch
```

### RESOURCES
* TypeScript Compiler Options - http://www.typescriptlang.org/docs/handbook/compiler-options.html
* Angular2 Changelog - https://github.com/angular/angular/blob/master/CHANGELOG.md

### TODO

* https://github.com/ivogabe/gulp-typescript/issues/316
* Use gulp-batch insteadof since-lastRun
* Import lodash-es from TS
* Check gulp-typescript for reading d.ts files
* Beep on error (parsing error)
