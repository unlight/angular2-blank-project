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
        .pipe(gulp.dest("build/images"));
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
        gulp.src(conf.typings), // TODO: cache
        gulp.src(glob, {since: gulp.lastRun("typescript")})
    );
    var result = sourceStream
        .pipe(g.util.env.debug ? g.debug() : g.util.noop())
        .pipe(g.tslint())
        .pipe(g.tslint.report("verbose", {emitError: false}))
        .pipe(g.preprocess({ context: conf }))
        .pipe(g.inlineNg2Template({ useRelativePaths: true }))
        .pipe(g.if(conf.isDev, g.sourcemaps.init()))
        .pipe(g.typescript(project));
    return result.js
        .pipe(g.if(conf.isProd, g.uglify()))
        .pipe(g.if(conf.isDev, g.sourcemaps.write({
            sourceRoot: sourceRoot
        })))
        .pipe(gulp.dest(dest))
        .pipe(g.connect.reload());
}

gulp.task("typescript", typescript);

gulp.task("index", function index() {
    var css = ["build/css/*"];
    var libs = conf.isProd ? ["build/libs/*"] : conf.paths.jslibs.map(lib => path.join("build/libs", lib));
    var source = gulp.src([...css, ...libs], { read: false });
    return gulp.src("src/index.html")
        .pipe(g.inject(source, { ignorePath: "build" }))
        .pipe(g.preprocess({ context: conf }))
        .pipe(gulp.dest("build"))
        .pipe(g.connect.reload());
});

gulp.task("watch", () => {
    // todo: done
    var ts = typescript({watch: true});
    var w = gulp.watch("src/index.html", gulp.series("index"));
    // () => {
    //     // todo: end
    //     // Both `css` and `html` are included in the glob because it's injected
    //     // into the JS files (output) when using external partials.
    //     // Injection is done by the `inlineNg2Template` plugin in the `typescript` task.
    //     // gulp.watch([
    //     //     "src/scripts/**/*.ts",
    //     //     "src/scripts/**/*.css",
    //     //     "src/scripts/**/*.html",
    //     //     "!src/scripts/**/*.spec.ts"
    //     // ], gulp.series("typescript")); // TODO: add unit tests
    //     // gulp.watch('src/scripts/**/*.spec.ts', unit); // TODO:
    //     // gulp.watch('src/scss/**/*.scss', scss); // TODO:
    // }
});

// todo: collect css from components
function sass() {
    return gulp.src("src/**/*.{scss,sass}")
        // todo: SASS LINT
        // .pipe(g.sassLint({ config: '.sass-lint.yml' }))
        // .pipe(g.sassLint.format())
        // .pipe(g.sassLint.failOnError())
        .pipe(g.rename({ dirname: "" }))
        .pipe(g.if(conf.isDev, g.sourcemaps.init()))
        .pipe(g.sass())
        .pipe(g.if(conf.isDev, g.sourcemaps.write()))
        .pipe(gulp.dest("build/css"))
        .pipe(g.connect.reload());
}

gulp.task("sass", sass);

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel(typescript, sass),
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

(function() {
    // TODO: Add watch
    // TODO: refactor this
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
