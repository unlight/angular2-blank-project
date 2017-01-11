const gulp = require("gulp");
const g = require("gulp-load-plugins")();
const fsbx = require("fuse-box");
const Path = require("path");
const del = require("del");
const _ = require("lodash");
const through = require('through2');
const streamFromPromise = require('stream-from-promise');
const source = require('vinyl-source-buffer');
const { GulpPlugin } = require('fusebox-gulp-plugin');
const config = {
    DEV_MODE: g.util.env.prod !== true,
    PORT: 8777,
    dest: "build"
};

const fuseBox = _.once(function createFuseBox(options = {}) {
    var main = _.get(options, 'main', 'app');
    let settings = {
        homeDir: 'src/',
        log: false,
        sourceMap: {
            bundleReference: `${main}.js.map`,
            outFile: `./${config.dest}/${main}.js.map`,
        },
        tsConfig: require('./tsconfig.json'),
        cache: true,
        outFile: `./${config.dest}/${main}.js`,
        plugins: [
            [
                /\.ts$/,
                fsbx.TypeScriptHelpers(),
                GulpPlugin([
                    (file) => g.preprocess({context: config})
                ]),
            ],
            [
                /\.css$/,
                GulpPlugin([
                    (file) => g.if(!config.DEV_MODE, g.csso()),
                ]),
                fsbx.CSSPlugin({ write: true }),
            ],
            fsbx.HTMLPlugin({ useDefault: false }),
        ]
    };
    _.assign(settings, options);
    return fsbx.FuseBox.init(settings);
});

gulp.task("build", () => {
    var bundle = fuseBox().bundle(">main.ts")
        .then(result => result.content);
    return streamFromPromise(bundle)
        .pipe(source('app.js'))
        .pipe(g.connect.reload());
});

gulp.task("spec:bundle", () => {
    const specOptions = {
        main: 'main.test'
    };
    return fuseBox(specOptions).bundle(">main.test.ts");
});

gulp.task("spec:w", (done) => {
    const watchers = [
        gulp.watch("src/**/*.*", gulp.series('spec:bundle')),
    ];
    process.on("SIGINT", () => {
        watchers.forEach(w => w.close());
        done();
    });
});

gulp.task('spec:pre', () => {
    let fileList = [];
    return gulp.src('src/**/*.spec.ts', {read: false})
        .pipe(through.obj((file, enc, cb) => {
            fileList.push(file.path);
            cb();
        }, cb => {
            let contents = fileList
                .map(p => Path.relative('./src', p))
                .map(p => `./${p.replace(/\\/g, '/')}`)
                .map(p => p.replace(/\.ts$/, ''))
                .map(p => `require('${p}')`)
                .join('\n')
            let file = new g.util.File({contents: Buffer.from(contents), path: '~tmp-spec-files.ts'})
            cb(null, file);
        }))
        .pipe(gulp.dest('src'));
});

gulp.task("spec:build", gulp.series('spec:pre', 'spec:bundle'));

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

gulp.task('eslint', () => {
    return gulp.src("src/**/*.ts")
        .pipe(g.ignore.exclude('~tmp-spec-files.ts'))
        .pipe(g.eslint())
        .pipe(g.eslint.format());
});
