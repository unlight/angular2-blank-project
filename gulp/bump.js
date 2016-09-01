module.exports = (gulp, g, args) => {

    gulp.task("bump", function () {
        var options = {};
        if (args.m) {
            options.type = "minor";
        }
        return gulp.src("./package.json")
            .pipe(g.bump())
            .pipe(gulp.dest("."));
    });

};
