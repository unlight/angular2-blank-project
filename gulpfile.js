// ========================================================
// CONFIGURATION
// ========================================================
const gulp = require("gulp");
const g = require("gulp-load-plugins")();
const path = require("path");
const merge2 = require("merge2");
const project = g.typescript.createProject("tsconfig.json", {
    typescript: require("typescript"),
    outFile: conf.isProd ? "app.js" : undefined
});

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || "8080";

const unixify = require("unixify");
const gutil = require("gulp-util");
const pkgDir = require("pkg-dir");

const projectRoot = pkgDir.sync();

const baseLibs = [
    // lib("systemjs/dist/system-polyfills.js"),
    lib("systemjs/dist/system.js"),
    // lib("es6-shim"),
    lib("rxjs/bundles/Rx.js"),
    lib("angular2/bundles/angular2-polyfills.js"),
    lib("angular2/bundles/angular2.dev.js"),
    lib("angular2/bundles/router.dev.js"),
    lib("angular2/bundles/http.dev.js"),
    // lib("lodash-es")
];

const paths = {
    typings: [
        lib("angular2/typings/browser.d.ts"),
        "typings/main.d.ts"
    ],

    dev: {
        jslibs: [
            ...baseLibs
            // Add dev only libs here
        ]
    },

    prod: {
        jslibs: [
            ...baseLibs
            // Add prod only libs here
        ]
    },

    test: {
        jslibs: [
            ...baseLibs,
            lib("angular2/bundles/testing.dev.js"),
            "karma.shim.js"
        ]
    }
};

const conf = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    get isDev() {
        return !this.isProd;
    },
    get isProd() {
        return this.NODE_ENV === "production" || gutil.env.production === true;
    },
    get paths() {
        return this.isDev ? paths.dev : paths.prod;
    },
    test: paths.test,
    testBaseLibs: paths.test.jslibs.map(lib => ({pattern: lib, watched: false})),
    typings: paths.typings,
    lib: lib,
    debug: debug,
    projectRoot: projectRoot,
    karma: {
        configFile: "karma.conf.js"
    }
};

function lib(path) {
    path = require.resolve(path).slice(projectRoot.length + 1);
    return unixify(path);
}

function debug(title, namespace) {
    var arg = gutil.env.debug;
    var debugStream = g.debug({title: title});
    if (arg === true || arg === "*") {
        return debugStream;
    } else if (typeof arg === "string") {
        title = title.toLowerCase();
        arg = arg.toLowerCase();
        if (title.indexOf(arg) !== -1 || (namespace && namespace.indexOf(arg) !== -1)) {
            return debugStream;
        }
    }
    return gutil.noop();
}

// ========================================================
// TASKS
// ========================================================

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

function scripts (options) {
    var glob = [
        "src/scripts/**/*.ts",
        "!src/scripts/**/*.spec.ts"
    ];
    if (!options) options = {};
    if (options.watch) {
        return gulp.watch(glob, gulp.series("scripts"));
    }
    var sourceRoot = "src/scripts";
    var dest = options.dest || "build/js";
    var sourceStream = merge2(
        gulp.src(conf.typings, { since: g.memoryCache.lastMtime("typings") })
            .pipe(conf.debug("Reading definitions", "scripts"))
            .pipe(g.memoryCache("typings")),
        gulp.src(glob, {since: gulp.lastRun("scripts")})
            .pipe(conf.debug("Reading sources", "scripts"))
    );
    var result = sourceStream
        .pipe(conf.debug("Merged streams", "scripts"))
        .pipe(g.tslint())
        .pipe(g.tslint.report("verbose", {emitError: false}))
        .pipe(g.preprocess({ context: conf }))
        .pipe(g.inlineNg2Template({ useRelativePaths: true }))
        .pipe(g.if(conf.isDev, g.sourcemaps.init()))
        .pipe(g.typescript(project));
    return result.js
        .pipe(g.if(conf.isProd, g.uglify({mangle: false})))
        .pipe(g.if(conf.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
        .pipe(g.size({ title: "scripts" }))
        .pipe(gulp.dest(dest))
        .pipe(conf.debug("Written", "scripts"))
        .pipe(g.connect.reload());
}

gulp.task("scripts", scripts);

gulp.task("index", function index() {
    var styles = ["build/design/*"];
    var jslibs = conf.isProd ? ["build/libs/*"] : conf.paths.jslibs.map(lib => path.join("build/libs", lib));
    var source = gulp.src([...styles, ...jslibs], { read: false })
            .pipe(conf.debug("Injecting"));
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
//     // }
// });

gulp.task("styles", function styles() {
    var sassStream = merge2([
            gulp.src("src/scss/*.{scss,sass}", { base: "src/scss", since: gulp.lastRun("styles") }),
            gulp.src("src/scripts/**/*.{scss,sass}", { since: gulp.lastRun("styles") })
        ])
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
        .pipe(conf.debug("Reading styles"))
        .pipe(g.rename({ dirname: "" }))
        .pipe(g.if(conf.isDev, g.sourcemaps.init()))
        .pipe(g.if("*.{scss,sass}", g.sass()))
        .pipe(g.if(conf.isDev, g.sourcemaps.write()))
        .pipe(g.size({ title: "styles" }))
        .pipe(gulp.dest("build/design"))
        .pipe(conf.debug("Writing styles"))
        .pipe(g.connect.reload());
});

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel("scripts", "styles"),
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
                // https://github.com/ivogabe/gulp-typescript/issues/201
                // sourceRoot: path.join(__dirname, sourceRoot)
                // Return relative source map root directories per file.
                sourceRoot: function(file) {
                    var sourceFile = path.join(file.cwd, file.sourceMap.file);
                    return path.relative(path.dirname(sourceFile), file.cwd);
                }
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
