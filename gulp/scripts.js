const path = require("path");
const combine = require("stream-combiner");
const merge2 = require("merge2");
const del = require("del");
const deleteEmpty = require("delete-empty");
const buffer = require("vinyl-buffer");
const through = require("through2");
const source = require("vinyl-source-stream");

module.exports = (gulp, g, config, paths, typingsStream, debug, _) => {

    gulp.task("scripts", function scripts() {
        var stream = merge2();
        if (config.isProd) {
            stream.add(polyfillsStream());
        }
        stream.add(appStream());
        return stream
            .pipe(gulp.dest(paths.destJs))
            .pipe(g.if(config.isProd, productionStream()))
            .pipe(g.connect.reload());
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
            .pipe(g.if(tsSourceAndSpecs(), combine(
                g.tslint({ formatter: "stylish" }),
                g.tslint.report({ emitError: false, summarizeFailureOutput: false }),
                g.eslint(),
                g.eslint.format(),
                through.obj((file, encoding, callback) => {
                    if (_.find(file.eslint.messages, ['fatal', true])) {
                        g.util.beep();
                    }
                    callback(null, file);
                })
            )))
            .pipe(g.if(fileNameCondition(["main.ts", "app.module.ts"]), g.preprocess({ context: config })))
            .pipe(g.if("!*.d.ts", g.inlineNg2Template({ useRelativePaths: true })))
            .pipe(g.if(config.isDev, g.sourcemaps.init()))
            .pipe(g.typescript(config.tsProject)).js
            .pipe(g.if(config.isDev, g.sourcemaps.write(".", { includeContent: true, sourceRoot: sourceRoot })))
            .pipe(g.size({ title: "scripts" }));
    }

    function productionStream() {
        var stream = combine(
            g.ignore.include(["polyfills.js", "vendors.js", "main.js"]),
            // g.sourcemaps.init({loadMaps:true}),
            g.if("main.js", combine(
                through.obj(function (file, encoding, callback) {
                    file.contents = browserifyContents(file.path, this);
                    this.push(file);
                }),
                buffer()
            )),
            g.order(["polyfills.js", "vendors.js", "main.js"]),
            g.if(config.singleFile, g.concat("app.js")),
            g.uglify(),
            // g.sourcemaps.write(".", {includeContent: true}),
            gulp.dest(paths.destJs)
        );
        stream.on("end", cleanup);
        return stream;
    }

    function cleanup() {
        var rmpaths = [paths.destJs + "/**/*.*"];
        // TODO: Move to config.
        if (config.singleFile) {
            rmpaths.push("!build/js/app.js");
        } else {
            rmpaths.push("!build/js/polyfills.js", "!build/js/vendors.js", "!build/js/main.js");
        }
        del.sync(rmpaths);
        deleteEmpty.sync(paths.destJs);
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

};
