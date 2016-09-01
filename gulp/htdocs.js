const combine = require("stream-combiner");
const util = require("util");

module.exports = (gulp, g, paths, config) => {

    var hashVersionPrefix = util.format("%s.%s", config.package.version, g.util.date("yyyymmdd'T'HHMMss"))
    var hashOptions = {
        algorithm: 'md5',
        hashLength: 6,
        template: '<%= name %><%= ext %>?v=' + hashVersionPrefix + '-<%= hash %>',
        version: config.package.version,
    };

    gulp.task("htdocs", function htdocs() {
        var styles = gulp.src(["build/design/main.css", "build/design/*.css"], { read: false })
            .pipe(g.if(config.isProd, g.hash(hashOptions)));
        var jsLibs = config.jsLibs;
        if (config.isProd) {
            jsLibs = "build/js/*.js";
        }
        var scripts = gulp.src(jsLibs, { read: false })
            .pipe(g.if(config.isProd, combine(
                g.order(["polyfills.js", "vendors.js", "main.js", "*.js"]),
                g.hash(hashOptions)
            )));
        return gulp.src("src/index.html")
            .pipe(g.inject(styles, { addRootSlash: false, ignorePath: paths.dest }))
            .pipe(g.inject(scripts, { addRootSlash: false, ignorePath: paths.dest }))
            .pipe(g.preprocess({ context: config }))
            .pipe(gulp.dest(paths.dest))
            .pipe(g.connect.reload());
    });
};
