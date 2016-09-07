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
    config.map["karma-custom-log"] = "n:karma-custom-log/lib/index.js";
    Object.assign(config.packages, {
        "rxjs": { defaultExtension: "js" },
    });
}

// Load our SystemJS configuration.
System.import("base/systemjs.config.js")
    .then(function () {
        return Promise.all([
            System.import("@angular/core/testing"),
            System.import("@angular/platform-browser-dynamic/testing"),
            System.import("karma-custom-log")
        ]);
    })
    .then(function (providers) {
        var coreTesting = providers[0];
        var browserTesting = providers[1];
        coreTesting.TestBed.initTestEnvironment(browserTesting.BrowserDynamicTestingModule, browserTesting.platformBrowserDynamicTesting());
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
