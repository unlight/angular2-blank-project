const combine = require("stream-combiner");
const merge2 = require("merge2");
const path = require("path");

module.exports = (gulp, g, config, paths, typingsStream, debug, _) => {

    gulp.task("scripts", function scripts() {
        var stream = merge2();
        if (config.isProd) {
            stream.add(polyfillsStream());
            stream.add(vendorsStream());
        }
        stream.add(appStream());
        return stream
            .pipe(gulp.dest(paths.destJs))
            .pipe(g.if(config.isProd, combine(
                g.order(["polyfills.js", "vendors.js", "main.js"]),
                g.if("main.js", combine(
                    g.bro({bundleExternal: false}),
                    gulp.dest(paths.destJs)
                )),
                g.if(config.singleFile, combine(
                    g.debug(),
                    g.concat("app.js"),
                    gulp.dest(paths.destJs)
                ))
                // g.uglify()
            )))
            .pipe(g.connect.reload());
    });

    function appStream() {
        var sourceRoot = "";
        var sourceStream = merge2(
            typingsStream().load(),
            gulp.src(paths.srcApp("**/*.ts"), {since: gulp.lastRun("scripts")})
        );
        var s = sourceStream
            .pipe(debug("Merged scripts", "scripts"))
            .pipe(g.if(config.isProd, g.ignore.include(tsSourceCondition())))
            .pipe(g.if(tsLintCondition(), combine(
                g.tslint(),
                g.tslint.report("verbose", {emitError: false})
            )))
            .pipe(g.if("main.ts", g.preprocess({ context: config })))
            .pipe(g.if("!*.d.ts", g.inlineNg2Template({ useRelativePaths: true })))
            .pipe(g.if(config.isDev, g.sourcemaps.init()))
            .pipe(g.typescript(config.tsProject)).js
            .pipe(g.if(config.isDev, g.sourcemaps.write(".", { includeContent: true, sourceRoot: sourceRoot})))
            .pipe(g.size({ title: "scripts" }));
        return s;
    }

    function polyfillsStream() {
        var sources = config.shims.map(x => x.main)
            .concat(config.polyfills.map(x => x.main));
        return gulp.src(sources)
            .pipe(g.concat("polyfills.js"));
    }

    function vendorsStream() {
        var entries = config.vendors.map(lib => lib.name);
        return g.file('vendors.js', ";", {src: true})
            .pipe(g.bro({
                require: entries
            }));
    }

    function tsLintCondition() {
        return tsCondition([".e2e-spec", ".spec", ".d"]);
    }

    function tsSourceCondition() {
        return tsCondition([".e2e-spec", ".spec"]);
    }

    function tsCondition(excludeExtList) {
        return function(file) {
            var basename = path.basename(file.path, ".ts");
            var extname = path.extname(basename);
            return !_.includes(excludeExtList, extname);
        };
    }

};