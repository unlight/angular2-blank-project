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
                var moduleName = appPath
                    .replace(/^\/base\/build\//, "./")
                    .replace(/\.js$/, "");
                pathsMapping[moduleName] = appPath + "?" + window.__karma__.files[appPath]
                return pathsMapping;
            }, {})
    }
  }
});

// window.define = System.amdDefine;
// window.require = window.requirejs = System.amdRequire;

Promise.all([
        System.import('@angular/core/testing'),
        System.import('@angular/platform-browser-dynamic/testing')
    ]).then(function(providers) {
        var testing = providers[0];
        var testingBrowser = providers[1];
        testing.setBaseTestProviders(testingBrowser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, testingBrowser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);
    }).then(function() {
        debugger;
        var promises = Object.keys(__karma__.files) // All files served by Karma.
            .filter(onlySpecFiles)
            .map(function(moduleName) {
                return System.import(moduleName);
            });
        return Promise.all(promises);
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