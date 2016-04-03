// Fixes undefined module function in SystemJS bundle.
if (typeof module === "undefined") {
    function module() {}
}

// Karma entry file.
// Tun on full stack traces in errors to help debugging.
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;

// Prevent Karma from starting synchronously.
__karma__.loaded = function() {};

System.config({
    paths: {
        "core-js/*": "base/node_modules/core-js/*"
    },
    packages: {
        "base/node_modules/core-js": {
            defaultExtension: "js",
            format: "cjs"
        },
        "base/build": {
            format: "register",
            map: Object.keys(window.__karma__.files)
                .filter(filterSourceFiles)
                .reduce(function(mapping, path) {
                    var moduleName = path.replace(/^\/base\/build\/js\//, "./").replace(/\.js$/, "");
                    mapping[moduleName] = path + "?" + window.__karma__.files[path];
                    return mapping;
                }, {})
        }
    }
});

System.import("core-js/es6/symbol.js")
    .then(function() {
        return System.import("angular2/src/platform/browser/browser_adapter");
    })
    .then(function(browserAdapter) {
        browserAdapter.BrowserDomAdapter.makeCurrent();
    })
    .then(function() {
        return Promise.all(loadTestFiles());
    })
    .then(function() {
        __karma__.start();
    })
    .catch(function(error) {
        __karma__.error(error.stack || String(error));
    });

function filterSourceFiles(path) {
    return path.indexOf("/base/build/js/") === 0;
}

function filterTestFiles(path) {
    return /\.(spec|test)\.js$/.test(path);
}

function importTestFiles(path) {
    return System.import(path);
}

function loadTestFiles() {
    return Object.keys(window.__karma__.files)
        .filter(filterTestFiles)
        .map(importTestFiles);
}