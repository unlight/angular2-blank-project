(function (global) {
    var paths = {
        "n:*": "node_modules/*",
        "capaj/systemjs-hot-reloader": "node_modules/systemjs-hot-reloader/hot-reloader.js",
        "socket.io-client": "node_modules/socket.io-client/socket.io.js",
        "weakee": "node_modules/weakee/weakee.js",
        "debug": "node_modules/debug/browser.js",
        "ms": "node_modules/ms/index.js",
        "power-assert": "node_modules/build/power-assert.js",
        "traceur": "node_modules/bower-traceur/traceur.js",
        "traceur-runtime":"node_modules/bower-traceur-runtime/traceur-runtime.js",
    };
    // map tells the System loader where to look for things
    var map = {
        "@angular": "n:@angular",
        "lodash": "n:lodash",
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
    };

    // packageConfigPaths.push('node_modules/*/package.json');

    var config = {
        transpiler: "traceur",
        traceurOptions: {
            "annotations": true,
            "memberVariables": true,
            "types": true
        },
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
