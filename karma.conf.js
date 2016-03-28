var config = require("./gulpfile.conf");

function karmaFiles() {
    var jsLibs = config.test.jsLibs.map(lib => ({pattern: lib, watched: false}));
    var sources = [
        // Paths loaded via module imports.
        {pattern: "build/js/**/*.js", included: false, watched: true},
        // Paths loaded via Angular's component compiler
        // {pattern: "build/**/*.html", included: false, watched: true},
        // {pattern: "build/**/*.css", included: false, watched: true}
    ];
    return [...jsLibs, ...sources];
}

module.exports = function(karma) {
    karma.set({
        files: karmaFiles(),
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
            "build/js/**/!(*.spec|*.test|*.e2e).js": ["coverage"],
            "build/js/**/*.js": ["sourcemap"]
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