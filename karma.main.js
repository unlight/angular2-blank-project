// Turn on full stack traces in errors to help debugging.
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
// Cancel Karma's synchronous start.
// We will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function () { };
// Inject configuration to SystemJS config.
function filterSystemConfig(config) {
    config.baseURL = "/base/build";
    config.map["rxjs"] = "n:rxjs";
    Object.assign(config.packages, {
        "rxjs": { defaultExtension: "js" },
        "@angular/common": { main: "index", defaultExtension: "js" },
        "@angular/compiler": { main: "index", defaultExtension: "js" },
        "@angular/core": { main: "index", defaultExtension: "js" },
        "@angular/forms": { main: "index", defaultExtension: "js" },
        "@angular/http": { main: "index", defaultExtension: "js" },
        "@angular/platform-browser": { main: "index", defaultExtension: "js" },
        "@angular/platform-browser-dynamic": { main: "index", defaultExtension: "js" },
        "@angular/router": { main: "index", defaultExtension: "js" },
        "n:karma-custom-log": { main: "lib/index.js" },
    });
}

// Load our SystemJS configuration.
System.import("base/systemjs.config.js")
    .then(function () {
        return Promise.all([
            System.import("@angular/core/testing"),
            System.import("@angular/platform-browser-dynamic/testing"),
            System.import("n:karma-custom-log")
        ]);
    })
    .then(function (providers) {
        var testing = providers[0];
        var testingBrowser = providers[1];
        testing.TestBed.initTestEnvironment(testingBrowser.BrowserDynamicTestingModule, testingBrowser.platformBrowserDynamicTesting());
        var k = providers[2];
        __karma__.result = k.karmaResult(__karma__.result, __karma__, {exclude: /node_modules/});
    })
    .then(function () {
        // Load spec files.
        var imports = Object.keys(__karma__.files)
            .filter(function (file) {
                return /\.spec\.js$/.test(file);
            })
            .map(function (file) {
                if (file.slice(0, 12) === '/base/build/') {
                    file = file.slice(12);
                }
                return System.import(file);
            });
        return Promise.all(imports);
    })
    .then(__karma__.start, __karma__.error);
