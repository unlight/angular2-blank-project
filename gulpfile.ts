/// <reference path="node_modules/@types/node/index.d.ts" />
import * as _ from 'lodash';
import * as fs from 'fs';
import * as Path from 'path';
import { PostCSS, FuseBox, RawPlugin, CSSPlugin, HTMLPlugin, UglifyJSPlugin } from 'fuse-box';
import del = require('del');
import through = require('through2');
const gulp = require('gulp');
const g = require('gulp-load-plugins')();
const streamFromPromise = require('stream-from-promise');
const source = require('vinyl-source-buffer');
const { GulpPlugin } = require('fusebox-gulp-plugin');
const args = g.util.env;
const config = {
    DEV_MODE: args.prod !== true,
    PORT: 8777,
    dest: 'build'
};
const postcssPlugins = _.constant([
    require('autoprefixer')({ browsers: ['last 3 version'] }),
]);

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
                GulpPlugin([
                    (file) => g.preprocess({ context: config })
                ]),
            ],
            [
                /\.component\.css$/,
                PostCSS(postcssPlugins()),
                GulpPlugin([
                    (file) => g.if(!config.DEV_MODE, g.csso()),
                ]),
                RawPlugin({}),
            ],
            [
                /\.css$/,
                PostCSS(postcssPlugins()),
                GulpPlugin([
                    (file) => g.if(!config.DEV_MODE, g.csso()),
                ]),
                CSSPlugin({ write: true }),
            ],
            HTMLPlugin({ useDefault: false }),
        ]
    };
    if (!config.DEV_MODE) {
        settings.plugins.push(UglifyJSPlugin({}) as any);
    }
    _.assign(settings, options);
    return FuseBox.init(settings);
});

gulp.task('build', () => {
    var bundle = fuseBox().bundle('>main.ts')
        .then(result => result.content);
    return streamFromPromise(bundle)
        .pipe(source('app.js'))
        .pipe(g.connect.reload());
});

gulp.task('release', () => {
    const {version} = require('./package');
    const suffix = ['', version, g.util.date("yyyymmdd'T'HHMMss")].join('.');
    return gulp.src(`${config.dest}/*.{js,css}`)
        .pipe(through.obj((file, enc, callback) => {
            del.sync(file.path);
            callback(null, file);
        }))
        .pipe(g.rename({ suffix }))
        .pipe(gulp.dest(config.dest));
});

gulp.task('spec:bundle', (done) => {
    const specOptions = {
        main: 'main.test'
    };
    fuseBox(specOptions)
        .bundle('>main.test.ts')
        .then(() => {
            setTimeout(done, 100);
        });
});

gulp.task('spec:watch', (done) => {
    const watchers = [
        gulp.watch('src/**/*.*', gulp.series('spec:bundle')),
    ];
    process.on('SIGINT', () => {
        watchers.forEach(w => w.close());
        done();
    });
});

gulp.task('spec:pre', () => {
    let fileList = [];
    return gulp.src('src/**/*.spec.ts', { read: false })
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
            let file = new g.util.File({ contents: Buffer.from(contents), path: '~tmp-spec-files.ts' })
            cb();
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('spec:post', (done) => {
    var contents = fs.readFileSync('./build/main.test.js', 'utf8');
    var lastLine = _.last(contents.split('\n'));
    contents = contents.replace(/\/\/# sourceMappingURL=.+/gm, '\n') + lastLine;
    fs.writeFileSync('./build/main.test.js', contents);
    done();
});

gulp.task('spec:build', gulp.series('spec:pre', 'spec:bundle', 'spec:post'));

gulp.task('server', (done) => {
    var history = require('connect-history-api-fallback');
    var folders = [config.dest];
    var connect = g.connect.server({
        root: folders,
        livereload: config.DEV_MODE,
        port: config.PORT,
        middleware: (connect, opt) => [ // eslint-disable-line no-unused-vars
            history()
        ]
    });
    connect.server.on('close', done);
});

gulp.task('server:dev', () => {
    gulp.series('htdocs').call();
    fuseBox().devServer('>main.ts', { port: 8083, root: config.dest });
});

gulp.task('clean', function clean() {
    return del(['.fusebox', '.coverage', config.dest]);
});

gulp.task('watch', (done) => {
    const watchers = [
        gulp.watch('src/**/!(*.spec).*', gulp.series('build')),
        gulp.watch('src/index.html', gulp.series('htdocs')),
    ];
    process.on('SIGINT', () => {
        watchers.forEach(w => w.close());
        done();
    });
});

gulp.task('htdocs', function htdocs() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest(config.dest))
        .pipe(g.connect.reload());
});

gulp.task('start', gulp.series(
    'clean',
    'build',
    'htdocs',
    gulp.parallel('server', 'watch')
));

gulp.task('eslint', () => {
    return gulp.src("src/**/*.ts")
        .pipe(g.ignore.exclude('~tmp-spec-files.ts'))
        .pipe(g.eslint())
        .pipe(g.eslint.format());
});

gulp.task('bump', () => {
    const options: any = {};
    if (args.m) {
        options.type = 'minor';
    }
    return gulp.src('./package.json')
        .pipe(g.bump())
        .pipe(gulp.dest('.'));
});

gulp.task('delay', (done) => {
    const delay = _.get(args, 'delay', 1000);
    setTimeout(done, delay);
});
