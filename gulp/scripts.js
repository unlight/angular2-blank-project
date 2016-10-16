const path = require("path");
const combine = require("stream-combiner");
const merge2 = require("merge2");
const del = require("del");
const deleteEmpty = require("delete-empty");
const buffer = require("vinyl-buffer");
const through = require("through2");
const source = require("vinyl-source-stream");
const webundler = require("gulp-webundler").default;

module.exports = (gulp, g, config, paths, typingsStream, debug, _, sassPipe, state, lib) => {

    gulp.task("scripts", function scripts() {
        var stream = merge2();
        if (config.isProd) {
            stream.add(polyfillsStream());
        }
        stream.add(appStream());
        return stream
            .pipe(gulp.dest(paths.destJs))
            // .pipe(g.if(config.isProd, productionStream()))
            .pipe(g.if(!config.hotreload, g.connect.reload()));
    });

    function appStream() {
        var sourceRoot = "";
        var sourceStream = merge2(
            typingsStream().load(),
            gulp.src(paths.srcApp("**/*.ts"), { since: gulp.lastRun("scripts") })
        );
        return sourceStream
            .pipe(debug("Merged scripts", "scripts"))
            .pipe(g.if(config.isProd, g.ignore.include(tsSourceCondition())))
            .pipe(g.if(tsSourceAndSpecs(), combine([
                g.tslint({ formatter: "stylish" }),
                g.tslint.report({ emitError: false, summarizeFailureOutput: false }),
                g.eslint(),
                g.eslint.format(),
                g.eslint.result(result => {
                    if (_.find(result.messages, ['fatal', true])) {
                        g.util.beep();
                    }
                }),
            ])))
            .pipe(g.if(fileNameCondition(["main.ts", "app.module.ts"]), g.preprocess({ context: config })))
            .pipe(g.if(includeExt([".component.ts"]), inlineNg2Template()))
            .pipe(g.sourcemaps.init({identityMap: true})) // TODO: move to upper pipe, when ready https://github.com/ludohenin/gulp-inline-ng2-template/issues/16
            .pipe(g.typescript(config.tsProject)).js
            .pipe(g.if(includeExt([".spec.js"]), g.espower()))
            // .pipe(g.debug())
            .pipe(webundler([
                { name: "main", include: ['main'], exclude: [
                    ...['@angular/core', '@angular/common', '@angular/compiler', '@angular/forms', '@angular/http', '@angular/platform-browser', '@angular/platform-browser-dynamic', '@angular/router', 'rxjs'],
                ] },
                { name: "vendors", include: ['vendors'], exclude: [
                    "main",
                ]
            },
            ]))
            .pipe(g.sourcemaps.write(".", { includeContent: true, sourceRoot: sourceRoot }))
    }

    function productionStream() {
        var outputFiles = [];
        var stream = combine(
            g.ignore.include(["polyfills.js", "vendors.js", "main.js"]),
            // g.sourcemaps.init({loadMaps:true}), // TODO: Load maps for production
            g.if("main.js", combine(
                through.obj(function (file, encoding, callback) {
                    file.contents = browserifyContents(file.path, this);
                    this.push(file);
                }),
                buffer()
            )),
            g.order(["polyfills.js", "vendors.js", "main.js"]),
            g.if(config.singleFile, g.concat("app.js")),
            g.if(config.hashNames, g.hash()),
            g.if(config.minify, g.uglify()),
            // g.sourcemaps.write(".", {includeContent: true}),
            gulp.dest(paths.destJs),
            through.obj((file, encoding, callback) => {
                outputFiles.push(file.relative);
                callback(null, file);
            }),
            g.size({showFiles: true})
        );
        stream.on("end", () => {
            var rmpaths = [paths.destJs + "/**/*.*"];
            outputFiles.forEach(f => rmpaths.push("!" + path.join(paths.destJs, f)));
            del.sync(rmpaths);
            deleteEmpty.sync(paths.destJs);
        });
        return stream;
    }

    function polyfillsStream() {
        var sources = config.polyfills.map(x => x.main);
        return gulp.src(sources)
            .pipe(g.concat("polyfills.js"));
    }

    function browserifyContents(entry, through) {
        const browserify = require("browserify");
        const distillify = require("distillify");
        var b = browserify(entry);
        if (!config.singleFile) {
            b.plugin(distillify, {
                outputs: {
                    pattern: "node_modules/**",
                    file: (packStream) => {
                        packStream
                            .pipe(source("vendors.js"))
                            .on("data", data => through.push(data));
                    }
                }
            });
        }
        return b.bundle(function () {
            through.emit("end");
        });
    }

    const inlineTransforms = {
        ".scss": () => sassPipe(),
        ".css": () => g.util.noop(),
    };

    function inlineNg2Template() {
        return g.inlineNg2Template({
            useRelativePaths: true,
            removeLineBreaks: true,
            styleProcessor: function (filepath, ext, fileContents, callback) {
                state.inlined[lib(filepath)] = true;
                // TODO: How to get gulp file here?
                // TODO: Also add gulp filw which inlines filepath
                // state.inlinedBy[file.path] = (state.inlinedBy[file.path] || []).concat(lib(filepath));
                var transform = inlineTransforms[ext];
                if (!transform) {
                    throw new Error(`I do not know how to transform '${ext}'`);
                    // TODO: Wait for fix https://github.com/ludohenin/gulp-inline-ng2-template/issues/68
                    // return callback(new Error(`I do not know how to transform '${ext}'`));
                }
                g.file(path.basename(filepath), fileContents, { src: true })
                    .pipe(transform()) // TODO: Add PostCss?
                    .pipe(g.if(config.isProd, g.csso()))
                    .pipe(through.obj((chunk, enc, cb) => {
                        fileContents = chunk.contents.toString();
                        cb();
                    }))
                    .on("error", (err) => callback(err))
                    .on("finish", () => {
                        callback(null, fileContents);
                    });
            },
        });
    }

    function fileNameCondition(names) {
        return function (file) {
            var basename = path.basename(file.path);
            return _.includes(names, basename);
        };
    }

    function tsSourceAndSpecs() {
        return tsExcludeCondition([".d", ".e2e-spec"]);
    }

    function tsLintCondition() {
        return tsExcludeCondition([".e2e-spec", ".spec", ".d"]);
    }

    function tsSourceCondition() {
        return tsExcludeCondition([".e2e-spec", ".spec"]);
    }

    function tsExcludeCondition(excludeExtList) {
        return function (file) {
            var basename = path.basename(file.path, ".ts");
            var extname = path.extname(basename);
            return !_.includes(excludeExtList, extname);
        };
    }

    function includeExt(incExtList) {
        return function (file) {
            var basename = path.basename(file.path);
            var result = _.some(incExtList, ext => _.endsWith(basename, ext));
            return result;
        };
    }

};
