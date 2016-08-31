"use strict";

process.env.BLUEBIRD_WARNINGS = 0;
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
    new Lib("tslib", { polyfill: true, dev: true, test: true}),
    new Lib("es6-shim", {polyfill: true, dev: true}),
    new Lib("zone.js", {polyfill: true, dev: true}),
    new Lib("reflect-metadata", {polyfill: true, dev: true}),
    new Lib("systemjs/dist/system.src.js", {dev: true, test: true}),
    new Lib("systemjs/dist/system-polyfills.js", {test: true}),
    new Lib("zone.js/dist/jasmine-patch.js", {test: true}),
    new Lib("zone.js/dist/async-test.js", {test: true}),
    new Lib("zone.js/dist/fake-async-test.js", {test: true}),
    new Lib("rxjs/bundles/Rx.js", {dev: true, test: true}),
    new Lib("./systemjs.config.js", {dev: true}),
];

var tsProject = _.once(() => {
    var options = {
        typescript: require("typescript"),
        isolatedModules: Boolean(config.isDev && (args.isolatedModules || args.im))
    };
    return g.typescript.createProject("tsconfig.json", options);
});

const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    APP_BASE: "/",
    // Concat to single file, if false release build will be splitted to app.js and vendors.js
    get singleFile() { // eslint-disable-line
        return false;
    },
    get isDev() {
        return !this.isProd;
    },
    get isProd() {
        return this.NODE_ENV === "production" || args.production === true;
    },
    get jsLibs() {
        var result = [];
        if (this.isDev) {
            result = baseLibs.filter(x => x.dev).map(x => x.main);
        } else if (this.isProd) {
            result = baseLibs.filter(x => x.prod).map(x => x.main);
        }
        return result;
    },
    get testJsLibs() {
        return baseLibs.filter(x => x.polyfill || x.test).map(x => x.main);
    },
    paths: {
        srcApp: createGlob("src/app"),
        dest: "build",
        destJs: "build/js"
    },
    typings: [
        "node_modules/typescript/lib/lib.es6.d.ts",
        "typings/globals/jasmine/index.d.ts",
        "typings/globals/angular-protractor/index.d.ts",
        "typings/globals/selenium-webdriver/index.d.ts",
    ],
    projectRoot: projectRoot,
    get tsProject() {
        return tsProject();
    },
    tscOptions: require("./tsconfig").compilerOptions,
    karma: {
        configFile: projectRoot + "/karma.conf.js"
    },
    get polyfills() {
        return baseLibs.filter(x => x.polyfill);
    },
    get minify() {
        var result = true;
        if (args.nomin) result = false;
        return result;
    }
};

module.exports = config;

// ==========================
// Functions
// ==========================

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

function Lib(name, visibility) { // eslint-disable-line
    this.name = name;
    if (!visibility) visibility = {};
    this.defaultVisibility = Boolean(visibility.default);
    Object.defineProperty(this, "main", {
        get: function() {
            return lib(this.name);
        }
    });
    ["polyfill", "dev", "prod", "test"].forEach(name => {
        Object.defineProperty(this, name, {
            get: function() {
                var result = this.defaultVisibility;
                if (visibility[name] !== undefined) {
                    result = Boolean(visibility[name]);
                }
                return result;
            }
        });
    });
}
