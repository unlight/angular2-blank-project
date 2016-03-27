"use strict";

const gulp = require("gulp");
const g = require("gulp-load-plugins")();
const path = require("path");
const merge2 = require("merge2");
const config = require("./gulpfile.conf");
const debug = config.debug;
const args = g.util.env;

// ========================================================
// BUILD
// ========================================================

gulp.task("assets", function assets() {
    var images = gulp.src("src/images/**/*.{png,jpg,gif}")
        .pipe(gulp.dest("build/design/images"));
    var libs = gulp.src(config.paths.jslibs, {base: "."})
        .pipe(g.if(config.isProd, g.concat("libs.js")))
        .pipe(g.if(config.isProd, g.uglify()))
        .pipe(gulp.dest("build/libs"));
    return merge2([images, libs]);
});

gulp.task("scripts", function scripts () {
    var glob = [
        "src/scripts/**/*.ts",
        "!src/scripts/**/*.{spec,test,e2e}.ts"
    ];
    var sourceRoot = "src/scripts";
    var dest = "build/js";
    var sourceStream = merge2(
        gulp.src(config.typings, { since: g.memoryCache.lastMtime("typings") })
            .pipe(debug("Reading definitions", "scripts"))
            .pipe(g.memoryCache("typings")),
        gulp.src(glob, {since: gulp.lastRun("scripts")})
            .pipe(debug("Reading sources", "scripts"))
    );
    return sourceStream
        .pipe(debug("Merged streams", "scripts"))
        .pipe(g.tslint())
        .pipe(g.tslint.report("verbose", {emitError: false}))
        .pipe(g.preprocess({ context: config }))
        .pipe(g.inlineNg2Template({ useRelativePaths: true }))
        .pipe(g.if(config.isDev, g.sourcemaps.init()))
        .pipe(g.typescript(config.tsProject))
        .js
        .pipe(g.if(config.isProd, g.uglify({mangle: false})))
        .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
        .pipe(g.size({ title: "scripts" }))
        .pipe(gulp.dest(dest))
        .pipe(debug("Written", "scripts"))
        .pipe(g.connect.reload());
});

gulp.task("styles", function styles() {
    var sassStream = merge2([
            gulp.src("src/scss/*.{scss,sass}", { base: "src/scss", since: gulp.lastRun("styles") }),
            gulp.src("src/scripts/**/*.{scss,sass}", { since: gulp.lastRun("styles") })
        ])
        .pipe(g.sassLint())
            .pipe(g.sassLint.format())
            .pipe(g.if(args.production, g.sassLint.failOnError()));
    var cssStream = gulp.src("src/**/*.css", { since: gulp.lastRun("styles") });
    // var lessStream = gulp.src("src/**/*.less", { since: gulp.lastRun("styles") });
    var sourceStream = merge2([
        sassStream,
        // lessStream,
        cssStream
    ]);
    return sourceStream
        .pipe(debug("Reading styles"))
        .pipe(g.rename({ dirname: "" }))
        .pipe(g.if(config.isDev, g.sourcemaps.init()))
        .pipe(g.if("*.{scss,sass}", g.sass()))
        .pipe(g.if(config.isDev, g.sourcemaps.write()))
        .pipe(g.size({ title: "styles" }))
        .pipe(gulp.dest("build/design"))
        .pipe(debug("Writing styles"))
        .pipe(g.connect.reload());
});

gulp.task("htdocs", function htdocs() {
    var styles = ["build/design/app.css", "build/design/*"];
    var jslibs = config.isProd ? ["build/libs/*"] : config.paths.jslibs.map(lib => path.join("build/libs", lib));
    var source = gulp.src([...styles, ...jslibs], { read: false })
            .pipe(debug("Injecting"));
    return gulp.src("src/index.html")
        .pipe(g.inject(source, { addRootSlash: false, ignorePath: "build" }))
        .pipe(g.preprocess({ context: config }))
        .pipe(gulp.dest("build"))
        .pipe(g.connect.reload());
});

gulp.task("watch", () => {
    var globScripts = ["src/scripts/**/*.ts", "!src/scripts/**/*.{spec,test,e2e}.ts"];
    gulp.watch(globScripts, gulp.series("scripts"));
    gulp.watch("src/index.html", gulp.series("htdocs"));
    gulp.watch("src/**/*.{scss,sass,less,css}", gulp.series("styles"));
});

gulp.task("livereload", function(done) {
    var history = require("connect-history-api-fallback");
    var connect = g.connect.server({
        root: "build",
        livereload: config.isDev,
        port: config.PORT,
        middleware: (connect, opt) => [
            history()
        ]
    });
    connect.server.on("close", done);
});

// ========================================================
// TESTS
// ========================================================
const karma = require("karma");

function karmaServer(options, done) {
    const server = new karma.Server(options, error => {
        if (error) process.exit(error);
        done();
    });
    server.start();
}

gulp.task("karma", done => {
    config.karma.singleRun = true;
    karmaServer(config.karma, done);
});

gulp.task("tests", () => {
    // TODO: Maybe combine with scripts task?
    var glob = [
        "src/scripts/**/*.{spec,test}.ts"
    ];
    var sourceRoot = "src/scripts";
    var dest = "build/js";
    var sourceStream = merge2(
        gulp.src(config.typings, { since: g.memoryCache.lastMtime("typings") })
            .pipe(g.memoryCache("typings")),
        gulp.src(glob, { since: gulp.lastRun("tests") })
    );
    return sourceStream
        .pipe(debug("Test file", "karma"))
        .pipe(g.if(config.isDev, g.sourcemaps.init()))
        .pipe(g.typescript(config.tsProject))
        .js
        .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
        .pipe(gulp.dest(dest));
});

gulp.task("tests.watch", done => {
    gulp.watch("src/scripts/**/*.{spec,test}.ts", gulp.series("tests"));
    karmaServer(config.karma, done);
});

gulp.task("coverage", function() {
    var remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");
    return gulp.src(".coverage/**/coverage.json")
        .pipe(remapIstanbul({
            basePath: "./",
            reports: {
                "html": ".coverage/istanbul-html-report",
                "json": ".coverage/istanbul-report.json",
                "lcovonly": ".coverage/istanbul-lcov-report.info"
            }
        }));
});

// ========================================================
// OTHER
// ========================================================

gulp.task("clean", function clean() {
    var del = require("del");
    return del(["build", ".coverage"]);
});

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel("scripts", "styles"),
    "assets",
    "htdocs"
));

gulp.task("test", gulp.series("tests", "karma", "coverage"));

gulp.task("serve", gulp.parallel("watch", "livereload"));

gulp.task("develop", gulp.series("build", "test", "serve"));
