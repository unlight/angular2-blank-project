module.exports = (gulp) => {

    var remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");
    // TODO: Maybe adapt karma-remap-instanbul-plugin
    // Waiting for fix https://github.com/marcules/karma-remap-istanbul/issues/23
    gulp.task("coverage", function() {
        return gulp.src(".coverage/**/coverage.json")
            .pipe(remapIstanbul({
                basePath: "./",
                reports: {
                    "html": ".coverage/html-report",
                    "json": ".coverage/report.json",
                    "lcovonly": ".coverage/lcov-report.info"
                }
            }));
    });

};
