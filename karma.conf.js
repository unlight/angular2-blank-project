var config = require("./env.conf");

module.exports = function (karma) {
    karma.set({
        files: [
            ...config.testJsLibs.map(p => ({ pattern: p, included: true, watched: false })),
            { pattern: "build/node_modules/rxjs/**/*.js", included: false, watched: false },
            { pattern: "build/node_modules/rxjs/**/*.map", included: false, watched: false },
            { pattern: "build/node_modules/@angular/**/*.js", included: false, watched: false },
            { pattern: "build/node_modules/@angular/**/*.map", included: false, watched: false },
            { pattern: "build/node_modules/karma-custom-log/**/*.js", included: false, watched: false },
            { pattern: "build/node_modules/karma-custom-log/**/*.map", included: false, watched: false },
            { pattern: "build/node_modules/power-assert/**/*.js", included: false, watched: false },
            { pattern: "systemjs.config.js", included: false, watched: false },
            { pattern: "build/js/**/*.js", included: false, watched: true },
            { pattern: "build/js/**/*.js.map", included: false, watched: false },
            "karma.main.js"
        ],
        // browsers: ['SlimerJS'],
        browsers: ["PhantomJS"],
        // browsers: ["Chrome"],
        plugins: [
            "karma-jasmine",
            "karma-coverage",
            "karma-phantomjs-launcher",
            "karma-slimerjs-launcher",
            "karma-chrome-launcher",
            "karma-sourcemap-loader",
            'karma-beep-reporter',
        ],
        frameworks: [
            "jasmine",
        ],
        preprocessors: {
            // Source files, that you want to generate coverage for, do not include tests or libraries.
            "build/js/**/!(*.spec|*.e2e-spec).js": ["coverage"],
            "build/js/**/*.js": ["sourcemap"]
        },
        slimerjsLauncher: {
            options: {
                settings: {
                    userAgent: 'SlimerJS'
                },
            },
            flags: []
        },
        reporters: ["progress", 'beep', "coverage"],
        coverageReporter: {
            dir: ".coverage",
            reporters: [
                { type: "json", file: "coverage.json" },
                { type: "lcov", file: "coverage.lcov" }
            ]
        },
        autoWatch: true,
        autoWatchBatchDelay: 100,
        singleRun: false,
        port: 9876,
        logLevel: karma.LOG_INFO
    });
};
