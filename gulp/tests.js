const merge2 = require("merge2");

module.exports = (gulp, g, config, debug, typingsStream) => {

    gulp.task("tests", () => {
        var glob = [
            "src/app/**/*.{spec,test}.ts"
        ];
        var sourceRoot = "src/app";
        var sourceStream = merge2(
            typingsStream().load(),
            gulp.src(glob, { since: gulp.lastRun("tests") })
        );
        return sourceStream
            .pipe(debug("Test file", "karma"))
            .pipe(g.if(config.isDev, g.sourcemaps.init()))
            .pipe(g.typescript(config.tsProject)).js
            .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
            .pipe(gulp.dest(config.paths.destJs));
    });

};