(function (global) {
    var paths = {
        "n:*": "node_modules/*"
    };
    // map tells the System loader where to look for things
    var map = {
        "@angular": "n:@angular",
        "lodash": "n:lodash",
        "power-assert": "n:power-assert",
        "capaj/systemjs-hot-reloader": "n:systemjs-hot-reloader",
        "traceur": "n:bower-traceur",
        "traceur-runtime": "n:bower-traceur-runtime",
        "socket.io-client": "n:socket.io-client",
        "weakee": "n:weakee",
        "debug": "n:debug",
        "ms": "n:ms",
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
        "capaj/systemjs-hot-reloader": { main: "hot-reloader.js"},
        "traceur": { main: "traceur.js"},
        "traceur-runtime": { main: "traceur-runtime.js"},
        "socket.io-client": { main: "socket.io.js"},
        "weakee": { main: "weakee.js"},
        "debug": { main: "browser.js", defaultExtension: "js"},
        "ms": { main: "index.js", defaultExtension: "js"},
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
