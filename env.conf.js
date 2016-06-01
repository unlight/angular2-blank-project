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

const polyfills = [
    new Lib("es6-shim"),
    new Lib("zone.js"),
    new Lib("reflect-metadata"),
];

const vendors = [
    new Lib("rxjs"),
    new Lib("@angular/common"),
    new Lib("@angular/compiler"),
    new Lib("@angular/core"),
    new Lib("@angular/http"),
    new Lib("@angular/router"),
    new Lib("@angular/platform-browser"),
    new Lib("@angular/platform-browser-dynamic"),
];

const shims = [
    new Lib("cjs2amd/require-shim.js", {default: false, shim: true})
];

const baseLibs = [
    ...polyfills.map(x => x.main),
    new Lib("systemjs/dist/system.js").main,
];

var tsProject = _.once(() => {
    var options = {
        typescript: require("typescript"),
        isolatedModules: Boolean(config.isDev && (args.isolatedModules || args.im))
    };
    if (config.isProd) {
        Object.assign(options, {
            outFile: "main.js",
            module: "amd"
        });
    };
    return g.typescript.createProject("tsconfig.json", options);
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
    },
    polyfills: polyfills,
    vendors: vendors,
    shims: shims
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

function Lib(name, visibility) {
    this.name = name;
    if (!visibility) visibility = {};
    this.defaultVisibility = Boolean(visibility.default);
    Object.defineProperty(this, "main", {
        get: function() {
            return lib(this.name);
        }
    });
    ["shim", "polyfill", "dev", "prod", "test"].forEach(name => {
        Object.defineProperty(this, name, {
            get: function() {
                var result = this.defaultVisibility;
                if (visibility[name] !== undefined) {
                    result = Boolean(visibility.isPolyfill);
                }
                return result;
            }
        });
    });
}