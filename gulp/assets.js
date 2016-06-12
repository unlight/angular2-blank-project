const merge2 = require("merge2");

module.exports = (gulp) => {

    gulp.task("assets", function assets() {
        var images = gulp.src("src/design/images/**/*.{png,jpg,gif,svg}")
            .pipe(gulp.dest("build/design/images"));
        return merge2([images]);
    });

};