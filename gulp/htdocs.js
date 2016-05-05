const path = require("path");

module.exports = (gulp, g, config, debug, _) => {

    gulp.task("htdocs", function htdocs() {
        var styles = gulp.src(["build/design/style.css", "build/design/*"], { read: false });
        var jsLibs = config.jsLibs;
        if (config.isProd) {
           jsLibs = ["build/libs/*"];
        }
        console.log('jsLibs ' , jsLibs);
        var scripts = gulp.src(jsLibs, { read: false });
        return gulp.src("src/index.html")
            .pipe(g.inject(styles, { addRootSlash: false, ignorePath: "build" }))
            .pipe(g.inject(scripts, { addRootSlash: false, ignorePath: "build" }))
            .pipe(g.preprocess({ context: config }))
            .pipe(gulp.dest("build"))
            .pipe(g.connect.reload());
    });
};