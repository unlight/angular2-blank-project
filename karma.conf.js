var config = require("./env.conf");

module.exports = function(karma) {
    karma.set({
        files: [
            // Polyfills.
            'node_modules/es6-shim/es6-shim.js',
            'node_modules/reflect-metadata/Reflect.js',
            // System.js for module loading
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            // Zone.js dependencies
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',
            // RxJs.
            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },
            // paths loaded via module imports
            // Angular itself
            {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/@angular/**/*.map', included: false, watched: false},
            // suppress annoying 404 warnings for resources, images, etc.
            // { pattern: 'dist/dev/**/*.js', included: false, watched: true },
            { pattern: 'node_modules/systemjs/dist/system-polyfills.js', included: false, watched: false }, // PhantomJS2 (and possibly others) might require it
            // suppress annoying 404 warnings for resources, images, etc.
            // { pattern: 'dist/dev/assets/**/*', watched: false, included: false, served: true },
            { pattern: "build/js/**/*.js", included: false, watched: true },
            "karma.main.js"
        ],
        browsers: ["PhantomJS"],
        // browsers: ["Chrome"],
        plugins: [
            "karma-jasmine",
            "karma-coverage",
            "karma-phantomjs-launcher",
            "karma-sourcemap-loader",
        ],
        frameworks: [
            "jasmine",
        ],
        preprocessors: {
            // Source files, that you want to generate coverage for, do not include tests or libraries.
            "build/js/**/!(*.spec|*.test|*.e2e).js": ["coverage"],
            "build/js/**/*.js": ["sourcemap"]
        },
        reporters: ["progress", "coverage"],
        coverageReporter: {
            dir: ".coverage",
            reporters: [
                {type: "json", file: "coverage.json"}, 
                {type: "lcov", file: "coverage.lcov"}
            ]
        },
        // proxied base paths
        // proxies: {
        //     // required for component assests fetched by Angular's compiler
        //     "/src/": "/base/src/"
        // },
        autoWatch: true,
        autoWatchBatchDelay: 200,
        singleRun: false,
        port: 9876,
        logLevel: karma.LOG_INFO
    });
};