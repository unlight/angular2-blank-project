const combine = require("stream-combiner");
const merge2 = require("merge2");
const path = require("path");
const del = require("del");
const deleteEmpty = require('delete-empty');

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
            .pipe(g.if(config.isProd, productionStream()))
            .pipe(gulp.dest(paths.destJs))
            .pipe(g.connect.reload());
    });

    function productionStream() {
        var stream = combine(
            g.ignore.include(["polyfills.js", "vendors.js", "main.js"]),
            g.if("main.js", g.bro({bundleExternal: false})),
            g.if(config.singleFile, combine(
                g.order(["polyfills.js", "vendors.js", "main.js"]),
                g.concat("app.js")
            )),
            g.uglify()
        );
        stream.on('end', cleanup);
        return stream;
    }

    function cleanup() {
        var rmpaths = [paths.destJs + '/**/*.*'];
        // TODO: Move to config.
        if (config.singleFile) {
            rmpaths.push("!build/js/app.js");
        } else {
            rmpaths.push("!build/js/polyfills.js", "!build/js/vendors.js", "!build/js/main.js");
        }
        del.sync(rmpaths);
        deleteEmpty.sync(paths.destJs);
    }

    function appStream() {
        var sourceRoot = "";
        var sourceStream = merge2(
            typingsStream().load(),
            gulp.src(paths.srcApp("**/*.ts"), {since: gulp.lastRun("scripts")})
        );
        return sourceStream
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