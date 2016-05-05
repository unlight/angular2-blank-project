const combine = require("stream-combiner");
const merge2 = require("merge2");

module.exports = (gulp, g, config, debug) => {

    gulp.task("assets", function assets() {
        var images = gulp.src("src/images/**/*.{png,jpg,gif,svg}")
            .pipe(gulp.dest("build/design/images"));
        var jsLibs = gulp.src(config.jsLibs, {base: "node_modules"});
        var libs = merge2(jsLibs)
            .pipe(g.if(config.isProd, combine(
                g.concat("libs.js"),
                g.uglify({mangle: false})
            )))
            .pipe(gulp.dest("build/libs"));
        return merge2([images, libs]);
    });

};