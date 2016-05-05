const path = require("path");

module.exports = (gulp, g, config, debug, _) => {
  
    gulp.task("htdocs", function htdocs() {
        var styles = ["build/design/style.css", "build/design/*"];
        var jsLibs = config.isProd ? ["build/libs/*"] : config.jsLibs.map(lib => path.join("build/libs", path.relative("node_modules", lib)));
        var source = gulp.src([...styles, ...jsLibs], { read: false })
                .pipe(debug("Injecting"));
        return gulp.src("src/index.html")
            .pipe(g.inject(source, { addRootSlash: false, ignorePath: "build" }))
            .pipe(g.preprocess({ context: config }))
            .pipe(gulp.dest("build"))
            .pipe(g.connect.reload());
    });

};