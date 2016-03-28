"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || "8080";

const unixify = require("unixify");
const pkgDir = require("pkg-dir");
const g = require("gulp-load-plugins")();
const args = g.util.env;
const projectRoot = pkgDir.sync();

const baseLibs = [
    lib("systemjs/dist/system-polyfills.js"),
    lib("systemjs/dist/system.js"),
    lib("es6-shim"),
    lib("rxjs/bundles/Rx.js"),
    lib("angular2/bundles/angular2-polyfills.js"),
    lib("angular2/bundles/angular2.dev.js"),
    lib("angular2/bundles/router.dev.js"),
    lib("angular2/bundles/http.dev.js"),
    // lib("lodash")
];

const tsLibs = [
    lib("lodash-es")
];

const paths = {
    typings: [
        lib("angular2/typings/browser.d.ts"),
        "typings/main.d.ts"
    ],
    dev: {
        // Add dev only libs here
        jsLibs: [
            ...baseLibs
        ]
    },
    prod: {
        // Add prod only libs here
        jsLibs: [
            ...baseLibs
        ]
    },
    test: {
        jsLibs: [
            ...baseLibs,
            lib("angular2/bundles/testing.dev.js"),
            "karma.shim.js"
        ]
    }
};

var _tsProject;

const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    get isDev() {
        return !this.isProd;
    },
    get isProd() {
        return this.NODE_ENV === "production" || args.production === true;
    },
    get paths() {
        return this.isDev ? paths.dev : paths.prod;
    },
    get jsLibs() {
        return this.isDev ? paths.dev.jsLibs : paths.prod.jsLibs;
    }, 
    tsLibs: tsLibs,
    test: paths.test,
    typings: paths.typings,
    lib: lib,
    debug: debug,
    projectRoot: projectRoot,
    get tsProject() {
		if (!_tsProject) {
			_tsProject = g.typescript.createProject("tsconfig.json", {
				typescript: require("typescript"),
				outFile: config.isProd ? "app.js" : undefined
			});
		}
		return _tsProject;
    },
    tscOptions: require("./tsconfig").compilerOptions,
    karma: {
        configFile: projectRoot + "/karma.conf.js"
    }
};

module.exports = config;
exports.lib = lib;
exports.debug = debug;

function debug(title, namespace) {
    var arg = args.debug;
    var debugStream = g.debug({title: title});
    if (arg === true || arg === "*") {
        return debugStream;
    } else if (typeof arg === "string") {
        title = title.toLowerCase();
        arg = arg.toLowerCase();
        if (title.indexOf(arg) !== -1 || (namespace && namespace.indexOf(arg) !== -1)) {
            return debugStream;
        }
    }
    return g.util.noop();
}

function lib(path) {
    path = require.resolve(path).slice(projectRoot.length + 1);
    return unixify(path);
}
