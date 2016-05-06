// Turn on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

// Load our SystemJS configuration.
System.config({
    baseURL: '/base/'
});

System.config({
    defaultJSExtensions: true,
    map: {
        'rxjs': 'node_modules/rxjs',
        '@angular': 'node_modules/@angular'
    },
    packages: {
        '@angular/core': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/compiler': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/common': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser-dynamic': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/router-deprecated': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        'rxjs': {
            defaultExtension: 'js'
        },
        "base/build": {
            defaultExtension: false,
            format: "register",
            map: Object.keys(window.__karma__.files)
                .filter(onlyAppFiles)
                .reduce(function createPathRecords(pathsMapping, appPath) {
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

Promise.all([
        System.import('@angular/core/testing'),
        System.import('@angular/platform-browser-dynamic/testing')
    ]).then(function(providers) {
        var testing = providers[0];
        var testingBrowser = providers[1];
        testing.setBaseTestProviders(testingBrowser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
            testingBrowser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);
    }).then(function() {
        return Promise.all(
            Object.keys(window.__karma__.files) // All files served by Karma.
            .filter(onlySpecFiles)
            .map(file2moduleName)
            .map(function(path) {
                console.log('path ', path);
                return System.import(path).then(function(module) {
                    if (module.hasOwnProperty('main')) {
                        module.main();
                    }
                    // else {
                    //     throw new Error('Module ' + path + ' does not implement main() method.');
                    // }
                });
            }));
    })
    .then(function() {
        __karma__.start();
    }, function(error) {
        console.error(error.stack || error);
        __karma__.start();
    });

function onlySpecFiles(path) {
    // check for individual files, if not given, always matches to all
    var patternMatched = __karma__.config.files ?
        path.match(new RegExp(__karma__.config.files)) : true;
    var result = patternMatched && /\.(spec|test)\.js$/.test(path);
    return result
}

// Normalize paths to module names.
function file2moduleName(filePath) {
    return filePath.replace(/\\/g, '/')
        .replace(/^\/base\//, '')
        .replace(/\.js$/, '');
}

function onlyAppFiles(filePath) {
    return /^\/base\/build\/.*\.js$/.test(filePath);
}