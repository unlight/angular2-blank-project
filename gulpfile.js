const gulp = require("gulp");
const g = require("gulp-load-plugins")();
const fsbx = require("fuse-box");
const Path = require("path");
const del = require("del");
const _ = require("lodash");
const streamFromPromise = require('stream-from-promise');
const source = require('vinyl-source-buffer');
const { GulpPlugin } = require('fusebox-gulp-plugin');
const config = {
    DEV_MODE: true,
    PORT: 8777,
    dest: "build"
};

const fuseBox = _.once(function createFuseBox(options = {}) {
    var appname = _.get(options, 'appname', 'app');
    let settings = {
        homeDir: 'src/',
        log: false,
        sourceMap: {
            bundleReference: `${appname}.js.map`,
            outFile: `./${config.dest}/${appname}.js.map`,
        },
        tsConfig: require('./tsconfig.json'),
        cache: true,
        outFile: `./${config.dest}/${appname}.js`,
        plugins: [
            [
                /\.ts$/,
                fsbx.TypeScriptHelpers(),
                GulpPlugin([
                    (file) => g.preprocess({context: config})
                ]),
            ],
            fsbx.CSSPlugin({ write: true }),
            fsbx.HTMLPlugin({ useDefault: false }),
        ]
    };
    _.assign(settings, options);
    const fuseBox = fsbx.FuseBox.init(settings);
    return fuseBox;
});

gulp.task("build", () => {
    var bundle = fuseBox().bundle(">main.ts")
        .then(result => result.content);
    return streamFromPromise(bundle)
        .pipe(source('app.js'))
        .pipe(g.connect.reload());
});

gulp.task("spec", () => {
    const specOptions = {
        appname: 'main.test'
    };
    return fuseBox(specOptions).bundle(">main.test.ts");
});

gulp.task("spec:w", (done) => {
    const watchers = [
        gulp.watch("src/**/*.*", gulp.series('spec')),
    ];
    process.on("SIGINT", () => {
        watchers.forEach(w => w.close());
        done();
    });
});

gulp.task("server", (done) => {
    var history = require("connect-history-api-fallback");
    var folders = [config.dest];
    var connect = g.connect.server({
        root: folders,
        livereload: config.DEV_MODE,
        port: config.PORT,
        middleware: (connect, opt) => [ // eslint-disable-line no-unused-vars
            history()
        ]
    });
    connect.server.on("close", done);
});

gulp.task("clean", function clean() {
    return del([".fusebox", config.dest]);
});

gulp.task("watch", (done) => {
    const watchers = [
        gulp.watch("src/**/!(*.spec).*", gulp.series('build')),
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
