"use strict";

const gulp = require("gulp");
const g = require("gulp-load-plugins")();
const path = require("path");
const merge2 = require("merge2");
const combine = require("stream-combiner");
const lastRun = require("last-run");
const _ = require("lodash");
const config = require("./gulpfile.conf");
const debug = config.debug;
const lib = config.lib;

// ========================================================
// BUILD
// ========================================================

gulp.task("assets", function assets() {
    var images = gulp.src("src/images/**/*.{png,jpg,gif,svg}")
        .pipe(gulp.dest("build/design/images"));
    var data = gulp.src("data/**", {base: "."})
        .pipe(gulp.dest("build"));
    var jsLibs = gulp.src(config.jsLibs, {base: "node_modules"});
    // var tsLibs = gulp.src(config.tsLibs, {base: "node_modules"})
    //     .pipe(g.typescript(config.tscOptions)).js;
    var libs = merge2(jsLibs)
        .pipe(g.if(config.isProd, combine(
            g.concat("libs.js"),
            g.uglify({mangle: false})
        )))
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
            // .pipe(debug("Reading definitions", "scripts"))
            .pipe(g.memoryCache("typings")),
        // gulp.src(config.lib("lodash-es")),
        gulp.src(glob, {since: gulp.lastRun("scripts")})
            // .pipe(debug("Reading sources", "scripts"))
    );
    return sourceStream
        .pipe(debug("Merged scripts", "scripts"))
        // .pipe(g.if("*.ts", combine(
        //     g.tslint(),
        //     g.tslint.report("verbose", {emitError: false})
        // )))
        .pipe(g.if("bootstrap.ts", g.preprocess({ context: config })))
        .pipe(g.inlineNg2Template({ useRelativePaths: true }))
        .pipe(g.if(config.isDev, g.sourcemaps.init()))
        .pipe(g.typescript(config.tsProject)).js
        .pipe(g.if(config.isProd, g.uglify({mangle: false})))
        .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
        .pipe(g.size({ title: "scripts" }))
        .pipe(gulp.dest(dest))
        .pipe(debug("Written", "scripts"))
        .pipe(g.connect.reload());
});

var postcssPlugins = _.constant([
    require("autoprefixer")({browsers: ["last 3 version"]})
]);

gulp.task("styles", function styles() {
    var sassStream = merge2(
            gulp.src(["src/styles/*.scss"], { base: "src/styles", since: gulp.lastRun("styles") }),
            gulp.src("src/scripts/**/*.scss", { since: gulp.lastRun("styles") })
        )
        .pipe(g.sassLint())
        .pipe(g.sassLint.format())
        .pipe(g.if(config.isProd, g.sassLint.failOnError()));
    var lessStream = gulp.src("src/scripts/**/*.less", { since: gulp.lastRun("styles") });
    var cssStream = gulp.src("src/scripts/**/*.css", { since: gulp.lastRun("styles") });
    var sourceStream = merge2([
        sassStream,
        lessStream,
        cssStream
    ]);
    return sourceStream
        .pipe(debug("Reading styles"))
        .pipe(g.rename({ dirname: "" }))
        .pipe(g.if(config.isDev, g.sourcemaps.init({loadMaps: true, identityMap: true})))
        .pipe(g.if("*.scss", g.sass()))
        .pipe(g.if("*.less", g.less()))
        .pipe(g.postcss(postcssPlugins()))
        .pipe(g.if(config.isDev, g.sourcemaps.write()))
        .pipe(g.if(config.isProd, combine(
            g.concat("style.css"),
            g.csso()
        )))
        .pipe(g.size({ title: "styles" }))
        .pipe(gulp.dest("build/design"))
        .pipe(debug("Writing styles"))
        .pipe(g.connect.reload());
});

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

gulp.task("watch", (done) => {
    const fs = require("fs");
    const w = [];
    const globScripts = [
        "src/scripts/**/*.ts",
        "!src/scripts/**/*.{spec,test,e2e}.ts"
    ];
    w[w.length] = gulp.watch(globScripts, gulp.series("scripts"));
    // If we changnig *.html we must recompile corresponsding component.
    w[w.length] = gulp.watch("src/scripts/**/*.html").on("change", path => {
        var tsfile = g.util.replaceExtension(path, ".ts");
        if (fs.existsSync(tsfile)) {
            var fd = fs.openSync(tsfile, "r+");
            var newTime = new Date(Date.now() - 1000);
            fs.futimesSync(fd, newTime, newTime);
            fs.closeSync(fd);
            // Do not need to run scripts, watcher triggers it by itself.
        } else {
            gulp.series(clearLastRun("scripts"), "scripts").call();
        }
    });
    w[w.length] = gulp.watch("src/index.html", gulp.series("htdocs"));
    w[w.length] = gulp.watch(["src/**/*.{scss,less,css}", "!src/**/_*.{scss,less}"], gulp.series("styles"));
    w[w.length] = gulp.watch("src/**/_*.{scss,less}", gulp.series(clearLastRun("styles"), "styles"));
    if (g.util.env.tests) {
        w[w.length] = gulp.watch("src/scripts/**/*.{spec,test}.ts", gulp.series("tests"));
        gulp.series("tests").call();
        // TODO: Fix memory leak here! If using gulp.series()
        setTimeout(() => {
            karmaServer(config.karma, done);
        }, 8000);
    }
    process.on("SIGINT", () => {
        w.forEach(watcher => watcher.close());
        done();
    });
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
    return server;
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
        .pipe(g.typescript(config.tsProject)).js
        .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
        .pipe(gulp.dest(dest));
});

// TODO: Maybe adapt karma-remap-instanbul-plugin
gulp.task("coverage", function() {
    var remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");
    return gulp.src(".coverage/**/coverage.json")
        .pipe(remapIstanbul({
            basePath: "./",
            reports: {
                "html": ".coverage/html-report",
                "json": ".coverage/report.json",
                "lcovonly": ".coverage/lcov-report.info"
            }
        }));
});

// ========================================================
// OTHER
// ========================================================

function clearLastRun(name) {
    var task = gulp._getTask(name);
    return function reset(done) {
        lastRun.release(task);
        done();
    };
}

gulp.task("clean", function clean() {
    var del = require("del");
    return del(["build", ".coverage"]);
});

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel(
        "assets",
        "scripts",
        "styles"),
    "htdocs"
));

gulp.task("test", gulp.series("tests", "karma", "coverage"));
gulp.task("serve", gulp.parallel("watch", "livereload"));
gulp.task("develop", gulp.series("build", "serve"));
gulp.task("default", gulp.series("build", "test"));