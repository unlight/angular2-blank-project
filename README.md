## Angular 2 - Seed Project

### Stack
- [Gulp 4](http://gulpjs.com/)
- [Angular 2](https://angular.io/)
- [TypeScript](http://www.typescriptlang.org/)
- [Typings](https://github.com/typings/typings)
- [Karma](http://karma-runner.github.io/) (not yet)

### Global Dependencies

| Dependency | Install                               |
| ---------- | ------------------------------------- |
| NodeJS     | [node.org](http://nodejs.org/)        |
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

#### Tasks
- `clean` Remove generated folders - `build`, `docs` and `coverage`.
- `unit` Run Karma against all `src/scripts/**/*.spec.js` files.
- `build` Create distribution package.
- `serve` Start web-server and live-reload.

#### Environments

##### Development:
`gulp build serve`

##### Production
`gulp build serve --production`
