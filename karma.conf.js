var config = require("./gulpfile.conf");

function karmaFiles() {
    var baseLibs = config.testBaseLibs;
    var sources = [
        // Paths loaded via module imports.
        {pattern: "build/**/*.js", included: false, watched: true},
        // Paths loaded via Angular's component compiler
        // {pattern: "build/**/*.html", included: false, watched: true},
        // {pattern: "build/**/*.css", included: false, watched: true}
    ];
    return [...baseLibs, ...sources];
}

module.exports = function(karma) {
    karma.set({
        files: karmaFiles(),
        browsers: ["PhantomJS"],
        plugins: [
            "karma-jasmine",
            "karma-coverage",
            "karma-phantomjs-launcher"
        ],
        frameworks: [
            "jasmine"
        ],
        preprocessors: {
            /**
             * Source files, that you want to generate coverage for.
             * Do not include tests or libraries.
             */
            "build/js/**/!(*.spec|*.test|*.e2e).js": ["coverage"]
        },
        reporters: ["progress", "coverage"],
        coverageReporter: {
            dir: ".coverage",
            reporters: [
                { type: "json", file: "coverage.json" },
                { type: "lcov", file: "coverage.lcov" },
            ]
        },
        // proxied base paths
        // proxies: {
        //     // required for component assests fetched by Angular's compiler
        //     "/src/": "/base/src/"
        // },
        autoWatch: true,
        singleRun: false,
        port: 9876,
        colors: true,
        logLevel: karma.LOG_INFO
    });
};