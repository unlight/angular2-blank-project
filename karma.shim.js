/**
 * This setup is based on Julie Ralph's `ng2-test-seed` project.
 * See https://github.com/juliemr/ng2-test-seed
 * Hopefully Angular2 and Karma integration will be more seamless in the future.
 * Unit tests are currently only implemented to run against the development target.
 */

/** Tun on full stack traces in errors to help debugging */
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

/**
 * Cancel Karma's synchronous start,
 * we will call `__karma__.start()` later, once all the specs are loaded.
 */
__karma__.loaded = function() {};

System.config({
    map: {
        "@angular": "base/node_modules/@angular",
        "@angular/platform-browser": "base/node_modules/@angular/platform-browser/platform-browser.umd.js",
        // "@angular/testing/testing_internal": "base/node_modules/@angular/testing/testing_internal.js",
        "services": "base/build/js/node_modules/services.js",
    },
    packages: {
        // "base/node_modules/angular@": {
        //     format: "amd",
        //     defaultExtension: "js"
        // },
        // "base/node_modules/angular@/platform-browser": {format: "amd", main: "platform-browser.umd.js", defaultExtension: "js"},
        "base/build": {
            defaultExtension: false,
            format: "register",
            map: Object.keys(window.__karma__.files).
            filter(onlyAppFiles).
            reduce(function createPathRecords(pathsMapping, appPath) {
                /**
                 * Creates local module name mapping to global path with karma's fingerprint in path, e.g.:
                 * "./hero.service": "/base/build/js/hero.service.js?f4523daf879cfb7310ef6242682ccf10b2041b3e"
                 */
                var moduleName = appPath
                    .replace(/^\/base\/build\//, "./")
                    .replace(/\.js$/, "");

                pathsMapping[moduleName] = appPath + "?" + window.__karma__.files[appPath]

                return pathsMapping;
            }, {})
        }
    }
});

System.import("@angular/platform-browser")
    .then(function(browser) {
        console.log('browser ' , browser);
    })
    .then(function() {
        return Promise.all(
            Object.keys(window.__karma__.files) // All files served by Karma.
            .filter(onlySpecFiles)
            .map(function(moduleName) {
                /** Loads all spec files via their global module names (e.g. "base/src/app/hero.service.spec") */
                return System.import(moduleName);
            }));
    })
    .then(__karma__.start, function(error) {
        __karma__.error(error.stack || String(error));
    });

function filePath2moduleName(filePath) {
    return filePath
        .replace(/^\//, "") // remove / prefix
        .replace(/\.\w+$/, ""); // remove suffix
}

function onlyAppFiles(filePath) {
    return /^\/base\/build\/.*\.js$/.test(filePath);
}

function onlySpecFiles(path) {
    return /\.(spec|test)\.js$/.test(path);
}