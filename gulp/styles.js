const merge2 = require("merge2");
const combine = require("stream-combiner");

module.exports = (gulp, g, config, paths, debug, _, sassPipe) => {

    var postcssPlugins = _.constant([
        require("autoprefixer")({ browsers: ["last 3 version"] })
    ]);

    gulp.task("styles", function styles() {
        var lastRunStyles = gulp.lastRun("styles");
        var sourceStream = gulp.src(["src/design/*.{scss,less,css}", paths.srcApp("**/*.{scss,less,css}")], { since: lastRunStyles })
            .pipe(g.ignore.exclude("_*"));
        return sourceStream
            .pipe(debug("Reading styles"))
            .pipe(g.rename({ dirname: "" }))
            .pipe(g.sourcemaps.init({ loadMaps: true, identityMap: true }))
            .pipe(g.if("*.scss", sassPipe()))
            .pipe(g.if("*.less", g.less()))
            .pipe(g.postcss(postcssPlugins()))
            .pipe(g.sourcemaps.write())
            .pipe(g.if(config.isProd, combine(
                g.order(["main.css"]),
                g.concat("main.css"),
                g.if(config.hashNames, g.hash()),
                g.csso()
            )))
            .pipe(g.size({ title: "styles" }))
            .pipe(gulp.dest("build/design"))
            .pipe(debug("Writing styles"))
            .pipe(g.connect.reload());
    });
};
