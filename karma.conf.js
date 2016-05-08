var config = require("./env.conf");

module.exports = function(karma) {
    karma.set({
        files: [
            {pattern: "node_modules/es6-shim/es6-shim.js", included: true, watched: false},
            {pattern: "node_modules/systemjs/dist/system.src.js", included: true, watched: false},
            {pattern: "node_modules/systemjs/dist/system-polyfills.js", included: true, watched: false},
            {pattern: "node_modules/zone.js/dist/zone.js", included: true, watched: false},
            {pattern: "node_modules/zone.js/dist/jasmine-patch.js", included: true, watched: false},
            {pattern: "node_modules/zone.js/dist/async-test.js", included: true, watched: false},
            {pattern: "node_modules/zone.js/dist/fake-async-test.js", included: true, watched: false},
            {pattern: "node_modules/reflect-metadata/Reflect.js", included: true, watched: false},
            {pattern: "node_modules/reflect-metadata/Reflect.js.map", included: false, watched: false},
            {pattern: "node_modules/rxjs/**/*.js", included: false, watched: false},
            {pattern: "node_modules/rxjs/**/*.js.map", included: false, watched: false},
            {pattern: "node_modules/@angular/**/*.js", included: false, watched: false},
            {pattern: "node_modules/@angular/**/*.js.map", included: false, watched: false},
            {pattern: "systemjs.config.js", included: false, watched: false},
            {pattern: "build/js/**/*.js", included: false, watched: true},
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
        autoWatch: true,
        autoWatchBatchDelay: 100,
        singleRun: false,
        port: 9876,
        logLevel: karma.LOG_INFO
    });
};