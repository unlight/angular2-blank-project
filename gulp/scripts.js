const combine = require("stream-combiner");
const merge2 = require("merge2");

module.exports = (gulp, g, config, paths, typingsStream, debug) => {

    gulp.task("scripts", function scripts() {
        var sourceRoot = "src/app";
        var sourceStream = merge2(
            typingsStream().load(),
            gulp.src(paths.srcApp("**/*.ts"), {since: gulp.lastRun("scripts")})
        );
        return sourceStream
            .pipe(debug("Merged scripts", "scripts"))
            .pipe(g.if("!*.d.ts", combine(
                g.tslint(),
                g.tslint.report("verbose", {emitError: false})
            )))
            .pipe(g.if("bootstrap.ts", g.preprocess({ context: config })))
            .pipe(g.if("!*.d.ts", g.inlineNg2Template({ useRelativePaths: true })))
            .pipe(g.if(config.isDev, g.sourcemaps.init()))
            .pipe(g.typescript(config.tsProject)).js
            .pipe(g.if(config.isProd, g.uglify({mangle: false})))
            .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
            .pipe(g.size({ title: "scripts" }))
            .pipe(gulp.dest(paths.destJs))
            .pipe(debug("Written", "scripts"))
            .pipe(g.connect.reload());
    });

};