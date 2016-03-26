module.exports = function(karma) {
    karma.set({
        frameworks: [
            "jasmine"
        ],
        reporters: [
            "progress",
            // "coverage"
        ],
        preprocessors: {
            /**
             * Source files, that you want to generate coverage for.
             * Do not include tests or libraries.
             * These files will be instrumented by Istanbul.
             */
            // ".karma/**/*!(.spec).js": ["coverage"]
        },

        // coverageReporter: {
        //     type: "json",
        //     subdir: "./json",
        //     file: "coverage-js.json"
        // },

        autoWatch: true,
        singleRun: false,
        port: 9876,
        colors: true,
        logLevel: karma.LOG_INFO,
        browsers: ["PhantomJS"],
        plugins: [
            "karma-jasmine",
            // "karma-coverage",
            "karma-phantomjs-launcher"
        ]
    });
};