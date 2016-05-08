// Turn on full stack traces in errors to help debugging.
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
// Cancel Karma's synchronous start.
// We will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};
// Inject configuration to SystemJS config.
function filterSystemConfig(config) {
    config.baseURL = "/base/";
    config.paths["js/node_modules/*"] = "build/js/node_modules/*";
    Object.assign(config.packages,  {
        "@angular/core": {main: "index", defaultExtension: "js"},
        "@angular/compiler": {main: "index", defaultExtension: "js"},
        "@angular/common": {main: "index", defaultExtension: "js"},
        "@angular/platform-browser": {main: "index", defaultExtension: "js"},
        "@angular/platform-browser-dynamic": {main: "index", defaultExtension: "js"},
        "@angular/router-deprecated": {main: "index", defaultExtension: "js"}
    });
    config.packages["build/js"] = {
        defaultExtension: "js",
        format: "register"
    };
}

// Load our SystemJS configuration.
System.import("base/systemjs.config.js")
.then(function() {
    return Promise.all([
        System.import("@angular/core/testing"),
        System.import("@angular/platform-browser-dynamic/testing"),
        System.import("@angular/testing/src/utils")
    ]);
})
.then(function(providers) {
    var testing = providers[0];
    var testingBrowser = providers[1];
    testing.setBaseTestProviders(testingBrowser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, testingBrowser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);
    var utils = providers[2];
    if (!utils.browserDetection) utils.browserDetection = new utils.BrowserDetection();
})
.then(function() {
    // Load spec files.
    var imports = Object.keys(__karma__.files)
        .filter(function(file) {
            return /\.(spec|test)\.js$/.test(file);
        })
        // .filter(function(filepath) {
        //     return filepath === "/base/build/js/components/app/app.spec.js";
        // })
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
    console.error(err);
});
// var resultFn = __karma__.result;
// __karma__.result = function() {
//     var log = arguments[0].log[0];
//     var newLog = log.split("\n").slice(0, 3).join("\n");
//     // newLog = newLog.replace(/http:\/\/localhost:9876\/base/g, "absolute");
//     arguments[0].log[0] = newLog;
//     // console.log('__karma__.result', arguments);
//     return resultFn.apply(__karma__, arguments);
// }