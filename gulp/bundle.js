const path = require("path");
const Builder = require("systemjs-builder");
const fs = require("fs");
const mkdirp = require("mkdirp");

module.exports = (gulp) => {

    gulp.task("bundle", () => {
        var options = {
            normalize: true,
            runtime: false,
            sourceMaps: true,
            sourceMapContents: true,
            minify: false,
            mangle: false,
            externals: [
                "n:*",
                // "@angular/core",
                // "@angular/common",
                // "@angular/compiler",
                // "@angular/platform",
                // "@angular/platform",
                // "@angular/http",
                // "@angular/router",
                // "@angular/forms",
                // "@angular/core/testing",
                // "@angular/common/testing",
                // "@angular/compiler/testing",
                // "@angular/platform-browser",
                // "@angular/platform-browser",
                // "@angular/http/testing",
                // "@angular/router/testing",
                // "@angular/forms/testing",
                // "rxjs/*",
                // "lodash",
                // "lodash-es",
            ],
        };
        var builder = new Builder("./build", "./systemjs.config.js");
        builder.config({
            paths: {
                "rxjs/*": "node_modules/rxjs/*.js",
            },
            map: {
                "rxjs": "n:rxjs",
            },
            packages: {
                "rxjs": {main: "Rx.js", defaultExtension: "js"},
            }
        });
        return builder.buildStatic("./build/js/main.js", "build.js", options);
    });
};
