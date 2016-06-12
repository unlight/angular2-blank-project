// Turn on full stack traces in errors to help debugging.
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
// Cancel Karma's synchronous start.
// We will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};
// Inject configuration to SystemJS config.
function filterSystemConfig(config) {
    config.baseURL = "/base/";
    config.map["rxjs"] = "n:rxjs";
    Object.assign(config.packages,  {
        "rxjs": {defaultExtension: "js"},
        "@angular/common": {main: "index", defaultExtension: "js"},
        "@angular/compiler": {main: "index", defaultExtension: "js"},
        "@angular/core": {main: "index", defaultExtension: "js"},
        "@angular/http": {main: "index", defaultExtension: "js"},
        "@angular/platform-browser": {main: "index", defaultExtension: "js"},
        "@angular/platform-browser-dynamic": {main: "index", defaultExtension: "js"},
        "@angular/router": {main: "index", defaultExtension: "js"},
        "@angular/testing": {main: "index", defaultExtension: "js"},
        "n:karma-custom-log": {main: "lib/index.js"},
        "build/js": {defaultExtension: "js"}
    });
}

// Load our SystemJS configuration.
System.import("base/systemjs.config.js")
.then(function() {
    return Promise.all([
        System.import("@angular/core/testing"),
        System.import("@angular/platform-browser-dynamic/testing"),
        System.import("@angular/testing/src/utils"),
        System.import("n:karma-custom-log")
    ]);
})
.then(function(providers) {
    var testing = providers[0];
    var testingBrowser = providers[1];
    testing.setBaseTestProviders(testingBrowser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, testingBrowser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);
    var utils = providers[2];
    if (!utils.browserDetection) utils.browserDetection = new utils.BrowserDetection();
    var k = providers[3];
    __karma__.result = k.karmaResult(__karma__.result, __karma__, {projectRoot: "http://localhost:9876/base"});
})
.then(function() {
    // Load spec files.
    var imports = Object.keys(__karma__.files)
        .filter(function(file) {
            return /\.spec\.js$/.test(file);
        })
        .map(function(file) {
            file = file.replace(/^\/base\//, "");
            return System.import(file);
        });
    return Promise.all(imports);
})
.then(function() {
    __karma__.start();
})
.catch(function(err) {
    // console.error(err); // TODO: Handle.
    __karma__.start();
});