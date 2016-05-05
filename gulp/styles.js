const merge2 = require("merge2");
const combine = require("stream-combiner");

module.exports = (gulp, g, config, debug, _) => {

    var postcssPlugins = _.constant([
        require("autoprefixer")({browsers: ["last 3 version"]})
    ]);
    
    gulp.task("styles", function styles() {
        var sassStream = merge2(
                gulp.src(["src/styles/*.scss"], { base: "src/styles", since: gulp.lastRun("styles") }),
                gulp.src("src/scripts/**/*.scss", { since: gulp.lastRun("styles") })
            )
            .pipe(g.sassLint())
            .pipe(g.sassLint.format())
            .pipe(g.if(config.isProd, g.sassLint.failOnError()));
        var lessStream = gulp.src("src/scripts/**/*.less", { since: gulp.lastRun("styles") });
        var cssStream = gulp.src("src/scripts/**/*.css", { since: gulp.lastRun("styles") });
        var sourceStream = merge2([
            sassStream,
            lessStream,
            cssStream
        ]);
        return sourceStream
            .pipe(debug("Reading styles"))
            .pipe(g.rename({ dirname: "" }))
            .pipe(g.if(config.isDev, g.sourcemaps.init({loadMaps: true, identityMap: true})))
            .pipe(g.if("*.scss", g.sass()))
            .pipe(g.if("*.less", g.less()))
            .pipe(g.postcss(postcssPlugins()))
            .pipe(g.if(config.isDev, g.sourcemaps.write()))
            .pipe(g.if(config.isProd, combine(
                g.order(["style.css"]),
                g.concat("style.css"),
                g.csso()
            )))
            .pipe(g.size({ title: "styles" }))
            .pipe(gulp.dest("build/design"))
            .pipe(debug("Writing styles"))
            .pipe(g.connect.reload());
    });

};