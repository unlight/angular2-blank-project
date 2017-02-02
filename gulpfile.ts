/// <reference path="node_modules/@types/node/index.d.ts" />
import * as _ from 'lodash';
import * as fs from 'fs';
import * as Path from 'path';
import { PostCSS, FuseBox, RawPlugin, CSSPlugin, HTMLPlugin, UglifyJSPlugin } from 'fuse-box';
import del = require('del');
import through = require('through2');
import { execSync } from 'child_process';
const readPkg = require('read-pkg');
const gulp = require('gulp');
const g = require('gulp-load-plugins')();
const streamFromPromise = require('stream-from-promise');
const source = require('vinyl-source-buffer');
const { GulpPlugin } = require('fusebox-gulp-plugin');
const args = g.util.env;
const config = {
    DEV_MODE: args.prod !== true,
    PORT: 8777,
    dest: 'build',
    specBundle: 'spec.bundle',
};
const postcssPlugins = _.constant([
    require('autoprefixer')({ browsers: ['last 3 version'] }),
]);

const fuseBox = _.memoize(function createFuseBox(options = {}) {
    const config: any = _.get(options, 'config');
    let main = _.get(options, 'main', 'app');
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
                CSSPlugin((() => {
                    // TODO: Use serve option to rename css file for prod.
                    return { write: !config.DEV_MODE };
                })()),
            ],
            HTMLPlugin({ useDefault: false }),
        ]
    };
    if (!config.DEV_MODE) {
        settings.plugins.push(UglifyJSPlugin({}) as any);
    }
    const fuse = FuseBox.init({ ...settings, ...options });
    return fuse;
});

gulp.task('build', (done) => {
    return fuseBox({ config }).bundle({
        [`${config.dest}/app.js`]: `>main.ts`,
        [`${config.dest}/about.module.js`]: `[about.module.ts]`,
    }).then(() => liveReload());
});

gulp.task('build:modules', () => {
    const names = ['about.module'];
    const plist = names.map(main => fuseBox({ config, main }).bundle(`[${main}.ts]`));
    return Promise.all(plist);
});

gulp.task('build:rev', () => {
    const {version} = readPkg.sync();
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
    fuseBox({ config, main: `${config.specBundle}` })
        .bundle(`>${config.specBundle}.ts`, () => done());
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
        }, (cb: any) => {
            let contents = fileList
                .map(p => Path.relative('./src', p))
                .map(p => `./${p.replace(/\\/g, '/')}`)
                .map(p => p.replace(/\.ts$/, ''))
                .map(p => `require('${p}')`)
                .join('\n')
            let file = new g.util.File({ contents: Buffer.from(contents), path: '~tmp-spec-files.ts' });
            cb(null, file);
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('spec:post', (done) => {
    var contents = fs.readFileSync(`./${config.dest}/${config.specBundle}.js`, 'utf8');
    var lastLine = _.last(contents.split('\n'));
    contents = contents.replace(/\/\/# sourceMappingURL=.+/gm, '\n') + lastLine;
    fs.writeFileSync(`./${config.dest}/${config.specBundle}.js`, contents);
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

gulp.task('devserver', () => {
    fuseBox({ config }).devServer('>main.ts', { port: 8083 });
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

gulp.task('clean', function clean() {
    return del(['.fusebox', '.coverage', config.dest]);
});

gulp.task('htdocs', function htdocs() {
    let scripts = gulp.src(`${config.dest}/app*.js`, { read: false });
    let styles = gulp.src(`${config.dest}/*.css`, { read: false });
    return gulp.src('src/index.html')
        .pipe(g.inject(styles, { addRootSlash: false, ignorePath: config.dest }))
        .pipe(g.inject(scripts, { addRootSlash: false, ignorePath: config.dest }))
        .pipe(gulp.dest(config.dest))
        .pipe(g.connect.reload());
});

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
    let onEnd = () => { };
    if (args.commit) {
        onEnd = () => {
            const {version} = readPkg.sync();
            execSync(`git add package.json`);
            execSync(`git commit -m "${version}"`);
        };
    }
    return gulp.src('./package.json')
        .pipe(g.bump())
        .pipe(gulp.dest('.'))
        .on('end', onEnd);
});

gulp.task('start', gulp.series(
    'clean',
    'build',
    'build:modules',
    'htdocs',
    gulp.parallel('server', 'watch')
));

gulp.task('release', gulp.series(
    'clean',
    'build',
    'build:modules',
    // 'build:rev',
    'htdocs'
));

function liveReload(callback?: Function) {
    const stream = g.file('app.js', '', { src: true });
    if (callback) {
        stream.on('end', callback)
    }
    stream.pipe(g.connect.reload());
}
