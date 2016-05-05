const merge2 = require("merge2");

module.exports = (gulp, g, config, debug) => {

    gulp.task("assets", function assets() {
        var images = gulp.src("src/images/**/*.{png,jpg,gif,svg}")
            .pipe(gulp.dest("build/design/images"));
        return merge2([images]);
    });

};