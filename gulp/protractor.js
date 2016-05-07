const merge2 = require("merge2");

module.exports = (gulp, config, paths, typingsStream) => {

    gulp.task("protractor", function protractor() {
        var sourceRoot = "src/app";
        var dest = "build/js";
        var sourceStream = merge2(
            typingsStream().load(),
            gulp.src(paths.srcApp("**/*.e2e.ts"), { since: gulp.lastRun("protractor") })
        );
        return sourceStream
            .pipe(debug("Test file", "protractor"))
            .pipe(g.if(config.isDev, g.sourcemaps.init()))
            .pipe(g.typescript(config.tsProject)).js
            .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
            .pipe(gulp.dest(dest))
            .pipe(g.protractor.protractor({configFile: "protractor.conf.js"}));
    });

};