module.exports = function (karma) {
    karma.set({
        files: [
            { pattern: "build/main.test.js" },
            // { pattern: "build/*.map", included: false, watched: false },
        ],
        browsers: ["PhantomJS"],
        plugins: [
            "karma-jasmine",
            "karma-phantomjs-launcher",
            "karma-chrome-launcher",
            "karma-sourcemap-loader",
            // "karma-coverage",
        ],
        frameworks: [
            "jasmine",
        ],
        preprocessors: {
            // Source files, that you want to generate coverage for, do not include tests or libraries.
            // "build/**/!(*.spec).js": ["coverage"],
            "build/**/*.js": ["sourcemap"]
        },
        reporters: ["progress"],
        autoWatch: true,
        singleRun: false,
        port: 9876,
        logLevel: karma.LOG_ERROR
    });
};
