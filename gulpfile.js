"use strict";
// ========================================================
// CONFIGURATION
// ========================================================
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || "8080";

const gulp = require("gulp");
const g = require("gulp-load-plugins")();
const path = require("path");
const merge2 = require("merge2");
const unixify = require("unixify");
const pkgDir = require("pkg-dir");

const projectRoot = pkgDir.sync();
var tsProject = () => {
    const project = g.typescript.createProject("tsconfig.json", {
        typescript: require("typescript"),
        outFile: config.isProd ? "app.js" : undefined
    });
    tsProject = () => project;
    return project;
};

const baseLibs = [
    lib("systemjs/dist/system-polyfills.js"),
    lib("systemjs/dist/system.js"),
    lib("es6-shim"),
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

const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    get isDev() {
        return !this.isProd;
    },
    get isProd() {
        return this.NODE_ENV === "production" || g.util.env.production === true;
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
        get files() {
            return karmaFiles();
        },
        configFile: projectRoot + "/karma.conf.js"
    }
};

function lib(path) {
    path = require.resolve(path).slice(projectRoot.length + 1);
    return unixify(path);
}

function debug(title, namespace) {
    var arg = g.util.env.debug;
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
    return g.util.noop();
}

// ========================================================
// TASKS
// ========================================================

gulp.task("clean", function clean() {
    var del = require("del");
    return del(["build"]);
});

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
        .pipe(g.typescript(tsProject()))
        .js
        .pipe(g.if(config.isProd, g.uglify({mangle: false})))
        .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
        .pipe(g.size({ title: "scripts" }))
        .pipe(gulp.dest(dest))
        .pipe(debug("Written", "scripts"))
        .pipe(g.connect.reload());
});

gulp.task("scripts.watch", () => {
    var glob = [
        "src/scripts/**/*.ts",
        "!src/scripts/**/*.{spec,test,e2e}.ts"
    ];
    gulp.watch(glob, gulp.series("scripts"));
});

gulp.task("index", function index() {
    var styles = ["build/design/*"];
    var jslibs = config.isProd ? ["build/libs/*"] : config.paths.jslibs.map(lib => path.join("build/libs", lib));
    var source = gulp.src([...styles, ...jslibs], { read: false })
            .pipe(debug("Injecting"));
    return gulp.src("src/index.html")
        .pipe(g.inject(source, { addRootSlash: false, ignorePath: "build" }))
        .pipe(g.preprocess({ context: config }))
        .pipe(gulp.dest("build"))
        .pipe(g.connect.reload());
});

gulp.task("watch", gulp.parallel(
    "scripts.watch",
    () => {
        gulp.watch("src/index.html", gulp.series("index"));
        gulp.watch("src/**/*.{scss,sass,less,css}", gulp.series("styles"));
    }
));

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
// TEST
// ========================================================
const karma = require("karma");

function karmaFiles() {
    var baseLibs = config.testBaseLibs;
    var sources = [
        // Paths loaded via module imports.
        {pattern: "build/**/*.js", included: false, watched: true},
        // Paths loaded via Angular's component compiler
        // {pattern: "build/**/*.html", included: false, watched: true},
        // {pattern: "build/**/*.css", included: false, watched: true}
    ];
    return [...baseLibs, ...sources];
}

function karmaServer(options, done) {
    const server = new karma.Server(options, error => {
        if (error) process.exit(error);
        done();
    });
    server.start();
}

gulp.task("karma.scripts", () => {
    // TODO: Maybe combine with scripts task?
    var glob = [
        "src/scripts/**/*.{spec,test}.ts"
    ];
    var sourceRoot = "src/scripts";
    var dest = "build/js";
    var sourceStream = merge2(
        gulp.src(config.typings, { since: g.memoryCache.lastMtime("typings") })
            .pipe(g.memoryCache("typings")),
        gulp.src(glob)
    );
    return sourceStream
        .pipe(debug("Karma"))
        .pipe(g.if(config.isDev, g.sourcemaps.init()))
        .pipe(g.typescript(tsProject()))
        .js
        .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
        .pipe(gulp.dest(dest));
});

gulp.task("karma", done => {
    config.karma.singleRun = true;
    karmaServer(config.karma, done);
});

// ========================================================
// COLLECTION
// ========================================================

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel("scripts", "styles"),
    "assets",
    "index",
    "karma.scripts",
    "karma"
));

gulp.task("serve", gulp.parallel("watch", "livereload"));

gulp.task("develop", gulp.series("build", "serve"));


// (function() {
//     // TODO: Add watch
//     var remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");

//     function karmaRemapIstanbul() {
//         return gulp.src("coverage/json/coverage-js.json")
//             .pipe(remapIstanbul({
//                 reports: {
//                     json: "coverage/json/coverage-ts.json",
//                     html: "coverage/html-report"
//                 }
//         }));
//     }

//     gulp.task("test", gulp.series(
//         karmaClean,
//         karmaTypescript,
//         karmaRun,
//         karmaRemapIstanbul,
//         karmaClean
//     ));

// })();
