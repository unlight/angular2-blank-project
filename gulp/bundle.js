const path = require("path");
const Builder = require("systemjs-builder");
const fs = require("fs");
const mkdirp = require("mkdirp");

module.exports = (gulp) => {

    gulp.task("bundle", () => {
        var options = {
            normalize: true,
            runtime: false,
            sourceMaps: false,
            sourceMapContents: true,
            minify: false,
            mangle: false,
            // format: "cjs",
        };
        var builder = new Builder("./build");
        builder.config({
            paths: {
                "n:*": "node_modules/*",
                "js/*": "js/*",
                "@angular/*": "node_modules/@angular/*",
                "rxjs/*": "node_modules/rxjs/*.js",
            },
            map: {
                "rxjs": "n:rxjs",
                '@angular/core': "n:@angular/core",
            },
            packages: {
                "js/": {defaultExtension: "js"},
                "rxjs": {defaultExtension: "js"},
                '@angular/core': {defaultExtension: "js", main: "index.js"},
                '@angular/common': {defaultExtension: "js", main: "index.js"},
                '@angular/compiler': {defaultExtension: "js", main: "index.js"},
                '@angular/platform-browser': {defaultExtension: "js", main: "index.js"},
                '@angular/platform-browser-dynamic': {defaultExtension: "js", main: "index.js"},
                '@angular/http': {defaultExtension: "js", main: "index.js"},
                '@angular/router': {defaultExtension: "js", main: "index.js"},
                '@angular/forms': {defaultExtension: "js", main: "index.js"},
            },
            bundles: {
                // "node_modules/.tmp/Rx.js": "rxjs/*",
            }
        });
        // builder.trace('js/main.js').then(tree => {
        //     console.log('tree', tree);
        // });
        return builder.bundle("js/main", "build.js", options);
    });
};
