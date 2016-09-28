const combine = require("stream-combiner");
const util = require("util");
const through = require("through2");

module.exports = (gulp, g, paths, config, hashOptions) => {

    gulp.task("htdocs", function htdocs() {
        var jsLibs = config.jsLibs;
        if (config.isProd) {
            jsLibs = "build/js/*.js";
        }
        var scripts = combine(
            gulp.src(jsLibs, { read: false }),
            g.if(config.isProd, combine(
                g.order(["polyfills*.js", "vendors*.js", "main*.js", "*.js"]),
                g.if(!config.hashNames, g.hash(hashOptions)) // Already renamed by productionStream()
            ))
        );
        var styles = combine(
            gulp.src(["build/design/main*.css", "build/design/*.css"], { read: false }),
            g.if(config.isProd, combine(
                g.if(!config.hashNames, g.hash(hashOptions))
            ))
        );
        return gulp.src("src/index.html")
            .pipe(g.inject(styles, { addRootSlash: false, ignorePath: paths.dest }))
            .pipe(g.inject(scripts, { addRootSlash: false, ignorePath: paths.dest }))
            .pipe(g.preprocess({ context: config }))
            .pipe(gulp.dest(paths.dest))
            .pipe(g.if(!config.hotreload, g.connect.reload()));
    });
};
