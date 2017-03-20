## Angular 2 - Project

[![Greenkeeper badge](https://badges.greenkeeper.io/unlight/angular2-blank-project.svg)](https://greenkeeper.io/)
Light-weight and easy to use seed project for Angular 2 apps.  
Based on [ghpabs/angular2-seed-project](https://github.com/ghpabs/angular2-seed-project) and [mraible/angular2-tutorial](https://github.com/mraible/angular2-tutorial)

### FEATURES
- Gulp 4 incremental builds (since, lastRun)
- Hot Reload!
- Unit tests coverage (with remap to TypeScript source)
- Merged pipeline of SASS, LESS and CSS + PostCSS

### STACK
- [Gulp 4](http://gulpjs.com/)
- [Angular 2](https://angular.io/)
- [TypeScript](http://www.typescriptlang.org/)
- [SystemJS](https://github.com/systemjs/systemjs)
- [Typings](https://github.com/typings/typings)
- [Karma](http://karma-runner.github.io/)
- [Codelyzer](https://github.com/mgechev/codelyzer)
- [Protractor](http://www.protractortest.org/)

### GLOBAL DEPENDENCIES

| Dependency | Install                               |
| ---------- | ------------------------------------- |
| NodeJS     | [nodejs.org](http://nodejs.org/)      |
| Gulp CLI   | `npm install -g gulp-cli`             |
| Typings    | `npm install -g typings`              |
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

### HOT RELOAD
To enable hot reload run:
```
gulp serve --hot
```
On every change console will be cleared, to disable add `--nocc`.

### TESTS
To run unit tests in watch mode:
```
gulp test watch
```
If you already have launched `serve` task, then use:
```
gulp karma -w
```

### RESOURCES
* TypeScript Compiler Options - http://www.typescriptlang.org/docs/handbook/compiler-options.html
* Angular2 Changelog - https://github.com/angular/angular/blob/master/CHANGELOG.md

### KNOWN ISSUES
* Incremental rebuild does not work in production

### FAQ
* _Watch task is not started, because it is already running somewhere near._      
  You are trying to start second task which contains `watch` task. If not, try to relaunch main task 
  (e.g. `serve`) with `-f` argument (e.g. `gulp serve -f`)

### TODO

* Fix eslint rule no-unused-vars
* Made static offline compiler
  import { platformBrowser } from '@angular/platform-browser';
  The app module factory produced by the static offline compiler
  import { AppModuleNgFactory } from './app.module.ngfactory';
  platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
  https://github.com/angular/angular/tree/master/modules/@angular/compiler-cli
* HTTP/2
* Update to TypeScript 2
* https://github.com/ivogabe/gulp-typescript/issues/316
* Use gulp-batch insteadof since-lastRun
* Import lodash-es from TS
* Check gulp-typescript for reading d.ts files
