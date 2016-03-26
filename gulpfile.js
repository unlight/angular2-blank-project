var gulp = require("gulp");
var conf = require("./gulpfile.conf");
var g = require("gulp-load-plugins")();
var path = require("path");
var merge2 = require("merge2");
var project = g.typescript.createProject("tsconfig.json", {
    typescript: require("typescript"),
    outFile: conf.isProd ? "app.js" : undefined
});

gulp.task("clean", function clean() {
    var del = require("del");
    return del(["build", ".karma", "coverage"]);
});

gulp.task("assets", function assets() {
    var images = gulp.src("src/images/**/*.{png,jpg,gif}")
        .pipe(gulp.dest("build/design/images"));
    var libs = gulp.src(conf.paths.jslibs, {base: "."})
        .pipe(g.if(conf.isProd, g.concat("libs.js")))
        .pipe(g.if(conf.isProd, g.uglify()))
        .pipe(gulp.dest("build/libs"));
    return merge2([images, libs]);
});

function typescript (options) {
    var glob = [
        "src/scripts/**/*.ts",
        "!src/scripts/**/*.spec.ts"
    ];
    if (!options) options = {};
    if (options.watch) {
        return gulp.watch(glob, gulp.series(typescript));
    }
    var sourceRoot = "src/scripts";
    var dest = options.dest || "build/js";
    var sourceStream = merge2(
        gulp.src(conf.typings, { since: g.memoryCache.lastMtime("typings") })
            .pipe(g.util.env.debug ? g.debug({title: "After reading definitions:"}) : g.util.noop())
            .pipe(g.memoryCache("typings")),
        gulp.src(glob, {since: gulp.lastRun("typescript")})
            .pipe(g.util.env.debug ? g.debug({title: "After reading sources:"}) : g.util.noop())
    );
    var result = sourceStream
        .pipe(g.util.env.debug ? g.debug({title: "After merge streams:"}) : g.util.noop())
        .pipe(g.tslint())
        .pipe(g.tslint.report("verbose", {emitError: false}))
        .pipe(g.preprocess({ context: conf }))
        .pipe(g.inlineNg2Template({ useRelativePaths: true }))
        .pipe(g.if(conf.isDev, g.sourcemaps.init()))
        .pipe(g.typescript(project));
    return result.js
        .pipe(g.if(conf.isProd, g.uglify({mangle: false})))
        .pipe(g.if(conf.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
        .pipe(gulp.dest(dest))
        .pipe(g.util.env.debug ? g.debug({title: "Written:"}) : g.util.noop())
        .pipe(g.connect.reload());
}

gulp.task("typescript", typescript);

gulp.task("index", function index() {
    var styles = ["build/design/*"];
    var jslibs = conf.isProd ? ["build/libs/*"] : conf.paths.jslibs.map(lib => path.join("build/libs", lib));
    var source = gulp.src([...styles, ...jslibs], { read: false })
            .pipe(g.util.env.debug ? g.debug({title: "Injecting:"}) : g.util.noop());
    return gulp.src("src/index.html")
        .pipe(g.inject(source, { addRootSlash: false, ignorePath: "build" }))
        .pipe(g.preprocess({ context: conf }))
        .pipe(gulp.dest("build"))
        .pipe(g.connect.reload());
});

gulp.task("watch", () => {
    typescript({ watch: true });
    gulp.watch("src/index.html", gulp.series("index"));
    gulp.watch("src/**/*.{scss,sass,less,css}", gulp.series("styles"));
});

// gulp.task("watch", () => {
//     // () => {
//     //     // todo: end
//     //     // Both `css` and `html` are included in the glob because it's injected
//     //     // into the JS files (output) when using external partials.
//     //     // Injection is done by the `inlineNg2Template` plugin in the `typescript` task.
//     //     // gulp.watch([
//     //     //     "src/scripts/**/*.ts",
//     //     //     "src/scripts/**/*.css",
//     //     //     "src/scripts/**/*.html",
//     //     //     "!src/scripts/**/*.spec.ts"
//     //     // ], gulp.series("typescript")); // TODO: add unit tests
//     //     // gulp.watch('src/scripts/**/*.spec.ts', unit); // TODO:
//     //     // gulp.watch('src/scss/**/*.scss', scss); // TODO:
//     // }
// });

gulp.task("styles", function styles() {
    var sassStream = gulp.src("src/**/*.{scss,sass}", { since: gulp.lastRun("styles") })
        .pipe(g.sassLint())
            .pipe(g.sassLint.format())
            .pipe(g.if(g.util.env.production, g.sassLint.failOnError()));
    // todo: less, css stream
    var sourceStream = merge2([
        sassStream,
        // gulp.src("src/**/*.less", { since: gulp.lastRun("styles") }),
        // gulp.src("src/**/*.css", { since: gulp.lastRun("styles") }),
    ]);
    return sourceStream
        .pipe(g.util.env.debug ? g.debug({title: "Reading styles:"}) : g.util.noop())
        .pipe(g.rename({ dirname: "" }))
        .pipe(g.if(conf.isDev, g.sourcemaps.init()))
        .pipe(g.if("*.{scss,sass}", g.sass()))
        .pipe(g.if(conf.isDev, g.sourcemaps.write()))
        .pipe(gulp.dest("build/design"))
        .pipe(g.util.env.debug ? g.debug({title: "Writing styles:"}) : g.util.noop())
        .pipe(g.connect.reload());
});

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel(typescript, "styles"),
    "assets",
    "index"
));

gulp.task("livereload", function(done) {
    var history = require("connect-history-api-fallback");
    var connect = g.connect.server({
        root: "build",
        livereload: conf.isDev,
        port: conf.PORT,
        middleware: (connect, opt) => [
            history()
        ]
    });
    connect.server.on("close", done);
});

gulp.task("serve", gulp.parallel("watch", "livereload"));

gulp.task("develop", gulp.series("build", "serve"));

(function() {
    // TODO: Add watch
    // TODO: Refactor this
    var karma = require("karma");
    var del = require("del");
    var remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");

    function karmaClean() {
        return del([".karma"]);
    }

    function karmaTypescript() {
        var sourceRoot = "src/scripts";
        var glob = "src/scripts/**/*.ts";
        var dest = ".karma";
        // TODO: combine with typescript task
        var result = gulp.src([glob, ...conf.typings])
            .pipe(g.tslint())
            .pipe(g.tslint.report("verbose", {emitError: false}))
            .pipe(g.preprocess({ context: conf }))
            .pipe(g.inlineNg2Template({ useRelativePaths: true }))
            .pipe(g.sourcemaps.init())
            .pipe(g.typescript(project));

        return result.js
            .pipe(g.sourcemaps.write({
                sourceRoot: path.join(__dirname, sourceRoot)
            }))
            .pipe(gulp.dest(dest));
    }

    function karmaRun(done) {
        return new karma.Server({
            configFile: path.join(__dirname, "karma.conf.js")
        }, done).start();
    }

    function karmaRemapIstanbul() {
        return gulp.src("coverage/json/coverage-js.json")
            .pipe(remapIstanbul({
                reports: {
                    json: "coverage/json/coverage-ts.json",
                    html: "coverage/html-report"
                }
        }));
    }

    gulp.task("test", gulp.series(
        karmaClean,
        karmaTypescript,
        karmaRun,
        karmaRemapIstanbul,
        karmaClean
    ));

})();
