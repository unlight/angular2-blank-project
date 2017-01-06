module.exports = function (karma) {
    karma.set({
        files: [
            { pattern: "build/main.test.js" },
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
            "build/**/*.js": ["sourcemap"]
        },
        reporters: ["progress"],
        autoWatch: true,
        singleRun: false,
        port: 9876,
        logLevel: karma.LOG_INFO
    });
};
