"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || "8080";

const path = require("path");
const unixify = require("unixify");
const pkgDir = require("pkg-dir");
const _ = require("lodash");
const g = require("gulp-load-plugins")();
const args = g.util.env;
const projectRoot = pkgDir.sync();

const baseLibs = [
    lib("es6-shim"),
    lib("zone.js/dist/zone.js"),
    lib("reflect-metadata/Reflect.js"),
    lib("systemjs/dist/system.src.js"),
    lib("rxjs/bundles/Rx.js"),
    lib("lodash")
];

var tsProject = _.once(() => {
    return g.typescript.createProject("tsconfig.json", {
        typescript: require("typescript"),
        isolatedModules: config.isDev && (args.isolatedModules || args.im),
        outFile: config.isProd ? "app.js" : undefined
    });
});

const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    APP_BASE: "/",
    get isDev() {
        return !this.isProd;
    },
    get isProd() {
        return this.NODE_ENV === "production" || args.production === true;
    },
    get jsLibs() {
        var result = baseLibs.slice();
        if (this.isDev) {
            result.push("systemjs.config.js")
        }
        return result;
    },
    test: {
        jsLibs: [
            ...baseLibs
        ]
    },
    paths: {
        srcApp: createGlob("src/app"),
        dest: "build",
        destJs: "build/js"
    },
    typings: [
        "typings/browser.d.ts",
        "node_modules/typescript/lib/lib.es6.d.ts"
    ],
    projectRoot: projectRoot,
    get tsProject() {
        return tsProject();
    },
    tscOptions: require("./tsconfig").compilerOptions,
    karma: {
        configFile: projectRoot + "/karma.conf.js"
    }
};

module.exports = config;

function lib(path) {
    path = require.resolve(path).slice(projectRoot.length + 1);
    return unixify(path);
}

function createGlob(pattern) {
    var func = function() {
        var params = Array.prototype.slice.call(arguments);
        var args = [].concat(pattern, params);
        var result = path.join.apply(null, args);
        return unixify(result);
    };
    func.not = function() {
        var result = func.apply(null, arguments);
        return "!" + result;
    };
    return func;
}