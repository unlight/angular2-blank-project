var conf = require("./gulpfile.conf");

module.exports = function(karma) {
    var config = {
        basePath: "./",
        frameworks: [
            "jasmine"
        ],
        files: [
                ...conf.test.jslibs,
                {pattern: ".karma/**/*.js", included: false}
        ],
        reporters: ["progress", "coverage"],
        preprocessors: {
            /**
             * Source files, that you want to generate coverage for.
             * Do not include tests or libraries.
             * These files will be instrumented by Istanbul.
             */
            ".karma/**/*!(.spec).js": ["coverage"]
        },

        coverageReporter: {
            type: "json",
            subdir: "./json",
            file: "coverage-js.json"
        },

        singleRun: true,
        port: 9876,
        colors: true,
        logLevel: karma.LOG_INFO,

        /**
         * @param browsers {Array} List of browsers for Karma to run the tests against.
         * We can use `Chrome`, `Firefox` or `PhantomJS` out-of-the-box here.
         */
        browsers: ["PhantomJS"],

        plugins: [
            "karma-jasmine",
            "karma-coverage",
            "karma-phantomjs-launcher"
        ],

    };

    karma.set(config);
};