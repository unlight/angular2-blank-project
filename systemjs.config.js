(function (global) {
    var paths = {
        "n:*": "node_modules/*"
    };
    // map tells the System loader where to look for things
    var map = {
        "@angular": "n:@angular",
        "lodash": "n:lodash",
        "power-assert": "n:power-assert",
    };

    var meta = {
        // "js/*" : { defaultExtension:  "js" },
        // "n:*" : { defaultExtension:  "js" }
    };

    var packageConfigPaths = [];

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        "js": { defaultExtension: "js" },
        "n:": { defaultExtension: "js" },
        "@angular/common": {main: "bundles/common.umd.js"},
        "@angular/compiler": {main: "bundles/compiler.umd.js"},
        "@angular/core": {main: "bundles/core.umd.js"},
        "@angular/http": {main: "bundles/http.umd.js"},
        "@angular/forms": {main: "bundles/forms.umd.js"},
        "@angular/platform-browser": {main: "bundles/platform-browser.umd.js"},
        "@angular/platform-browser-dynamic": {main: "bundles/platform-browser-dynamic.umd.js"},
        "@angular/router": {main: "bundles/router.umd.js"},
        "power-assert": { main: "build/power-assert.js"},
    };

    // packageConfigPaths.push('node_modules/*/package.json');

    var config = {
        // defaultJSExtensions: true,
        paths: paths,
        map: map,
        packages: packages,
        meta: meta,
        // packageConfigPaths: packageConfigPaths
    };

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) {
        global.filterSystemConfig(config);
    }

    System.config(config);

})(this);
