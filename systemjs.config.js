(function(global) {
    var paths = {
        "n:*": "node_modules/*"
    };
    // map tells the System loader where to look for things
    var map = {
        "@angular": "n:@angular",
        "lodash": "n:lodash"
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        "js": {main: "main.js", defaultExtension: "js"}
    };

    [
        "@angular/common",
        "@angular/compiler",
        "@angular/core",
        "@angular/http",
        "@angular/platform-browser",
        "@angular/platform-browser-dynamic",
        "@angular/router",
        "@angular/testing"
    ].forEach(function(name) {
        var main = name.slice(name.lastIndexOf("/") + 1) + ".umd.js";
        packages[name] = { main: main, defaultExtension: "js"};
        // packages[name] = { main: "index", defaultExtension: "js"};
    });

    var config = {
        paths: paths,
        map: map,
        packages: packages
    };

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) {
        global.filterSystemConfig(config);
    }

    System.config(config);

})(this);