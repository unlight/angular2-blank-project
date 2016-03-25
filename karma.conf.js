var conf = require("./gulpfile.conf");

module.exports = function(karma) {
    var config = {
        basePath: "./",
        frameworks: [
            // "systemjs",
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
            '.karma/**/*!(.spec).js': ['coverage']
        },

        /** Optionally, configure the reporter */
        coverageReporter: {
            type: 'json',
            subdir: './json',
            file: 'coverage-js.json'
        },

        singleRun: true,
        port: 9876,
        colors: true,
        logLevel: karma.LOG_DEBUG,

        /**
         * @param browsers {Array} List of browsers for Karma to run the tests against.
         * We can use `Chrome`, `Firefox` or `PhantomJS` out-of-the-box here.
         */
        browsers: ["PhantomJS"],

        plugins: [
            // "karma-systemjs",
            "karma-jasmine",
            "karma-coverage",
            "karma-phantomjs-launcher"
        ],

        // customLaunchers: {
        //     ChromeTravisCI: {
        //         base: 'Chrome',
        //         flags: ['--no-sandbox']
        //     }
        // },

        // systemjs: {
        //     // Path to your SystemJS configuration file
        //     configFile: "./system.conf.js",
        //     files: [
        //         ".karma/**/*.js",
        //     ],

        //     // Patterns for files that you want Karma to make available, but not loaded until a module requests them. eg. Third-party libraries.
        //     serveFiles: [
        //         // "node_modules/**/*.js"
        //     ],

        //     // SystemJS configuration specifically for tests, added after your config file.
        //     // Good for adding test libraries and mock modules
        //     config: {
        //         paths: {
        //             // "lodash": "node_modules/lodash/*.js"
        //             // 'angular-mocks': 'bower_components/angular-mocks/angular-mocks.js'
        //         }
        //     }
        // }
    };

    /**
     * `PhantomJS2` support is limited in Travis CI so we use `Chrome` instead.
     * Note that we also need to configure Travis so it enables Chrome.
     * See `before_script` in the `.travis.yml` file.
     */
    if (process.env.TRAVIS) {
        config.browsers = ['ChromeTravisCI'];
    }

    karma.set(config);
};