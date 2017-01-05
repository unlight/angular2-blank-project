const gulp = require("gulp");
const g = require("gulp-load-plugins")();
const fsbx = require("fuse-box");
const Path = require("path");
const del = require("del");
const _ = require("lodash");
const streamFromPromise = require('stream-from-promise');
const source = require('vinyl-source-buffer');
const config = {
    isDev: true,
    PORT: 8777,
    dest: "build"
};

const fuseBox = _.once(function createFuseBox() {
    const fuseBox = fsbx.FuseBox.init({
        homeDir: 'src/',
        sourceMap: {
            bundleReference: "sourcemaps.js.map",
            outFile: "./build/sourcemaps.js.map",
        },
        tsConfig: require('./tsconfig.json'),
        cache: true,
        outFile: './build/app.js',
        plugins: [
            fsbx.TypeScriptHelpers(),
            fsbx.CSSPlugin({ write: true }),
            fsbx.HTMLPlugin({ useDefault: false }),
        ]
    });
    return fuseBox;
});

gulp.task("build", () => {
    var bundle = fuseBox().bundle(">main.ts")
        .then(result => result.content);
    return streamFromPromise(bundle)
        .pipe(source('app.js'))
        .pipe(g.connect.reload());
});

gulp.task("server", (done) => {
    var history = require("connect-history-api-fallback");
    var folders = ["build"];
    var connect = g.connect.server({
        root: folders,
        livereload: config.isDev,
        port: config.PORT,
        middleware: (connect, opt) => [ // eslint-disable-line no-unused-vars
            history()
        ]
    });
    connect.server.on("close", done);
});

gulp.task("clean", function clean() {
    return del([".fusebox", "build"]);
});

gulp.task("watch", (done) => {
    const watchers = [
        gulp.watch("src/**/*.*", gulp.series('build')),
        gulp.watch("src/index.html", gulp.series("htdocs")),
    ];
    process.on("SIGINT", () => {
        watchers.forEach(w => w.close());
        done();
    });
});

gulp.task("htdocs", function htdocs() {
    return gulp.src("src/index.html")
        .pipe(gulp.dest(config.dest))
        .pipe(g.connect.reload());
});

gulp.task("start", gulp.series(
    "clean",
    "build",
    "htdocs",
    gulp.parallel("server", "watch")
));
