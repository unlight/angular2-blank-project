(function() {

    // map tells the System loader where to look for things
    var map = {
        "services": "js/node_modules/services.js",
        // 'app': 'app', // 'dist',
        // 'rxjs':                       'node_modules/rxjs',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        '@angular': 'node_modules/@angular'
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        "js": {
            main: "bootstrap.js"
        },
        'app': {
            main: 'main.js',
            defaultExtension: 'js'
        },
        // 'rxjs':                       { defaultExtension: 'js' },
        'angular2-in-memory-web-api': {
            defaultExtension: 'js'
        },
    };

    var packageNames = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/router-deprecated',
        '@angular/testing',
        '@angular/upgrade',
    ];

    // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
    packageNames.forEach(function(pkgName) {
        var main = pkgName.slice(pkgName.lastIndexOf('/') + 1) + '.umd.js';
        packages[pkgName] = {
            main: main,
            format: 'amd',
            defaultExtension: 'js'
        };
    });

    System.config({
        map: map,
        packages: packages,
        bundles: {
            "js/app.js": ["bootstrap"]
        }
    });

})();