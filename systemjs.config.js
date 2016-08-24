(function (global) {
    var paths = {
        "n:*": "node_modules/*"
    };
    // map tells the System loader where to look for things
    var map = {
        "@angular": "n:@angular",
        "lodash": "n:lodash"
    };

    var meta = {
        // "js/*" : { defaultExtension:  "js" },
        // "n:*" : { defaultExtension:  "js" }
    };

    var packageConfigPaths = [];

    // packages  tells the Syst em loader how to load when no filename and/or no extension
    var packages = {
        "js": { defaultExtension: "js" },
        "n:": { defaultExtension: "js" }

    [
        "@angular/common",
        "@angular/compiler",
        "@angular/core",
        "@angular/http",
        "@angular/forms",
        "@angular/platform-browser",
        "@angular/platform-browser-dynamic",
        "@angular/router"
    ].forEach(function (name) {
        var main = "bundles/" + name.slice(name.lastIndexOf("/") + 1) + ".umd.js";
        packages[name] = { main: main };
        // packageConfigPaths.push('node_modules/' + name + '/package.json');
    });

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
