var config = require("./env.conf");

module.exports = function(karma) {
    karma.set({
        files: [
            ...config.testJsLibs.map(p => ({pattern: p, included: true, watched: false})),
            {pattern: "build/node_modules/rxjs/**", included: false, watched: false},
            {pattern: "build/node_modules/@angular/**", included: false, watched: false},
            {pattern: "build/node_modules/karma-custom-log/**", included: false, watched: false},
            {pattern: "systemjs.config.js", included: false, watched: false},
            {pattern: "build/js/**/*.js", included: false, watched: true},
            "karma.main.js"
        ],
        browsers: ["PhantomJS"],
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
            "build/js/**/!(*.spec|*.e2e-spec).js": ["coverage"],
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
