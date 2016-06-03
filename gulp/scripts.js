const combine = require("stream-combiner");
const merge2 = require("merge2");
const path = require("path");
const streamify = require("stream-array");
const escodegen = require("escodegen");
const cjsify = require("commonjs-everywhere").cjsify;
const del = require("del");
const through = require("through2");
const cjs2amd = require("cjs2amd");

module.exports = (gulp, g, config, paths, typingsStream, debug, _) => {

    gulp.task("scripts", function scripts(done) {
        var stream = merge2();
        if (config.isProd) {
            stream.add(shimsStream());
            stream.add(polyfillsStream());
            stream.add(vendorsStream());
        }
        stream.add(appStream());
        return stream
            .pipe(g.if(config.isProd, combine(
                g.if(config.concatToApp, g.concat("app.js")),
                g.uglify()
            )))
            .pipe(gulp.dest(paths.destJs))
            .pipe(g.connect.reload());
    });

    gulp.task("cleanup", function() {
        return del([
            "build/node_modules"
        ]);
    });

    function appStream() {
        var sourceRoot = "src/app";
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
            .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
            .pipe(g.size({ title: "scripts" }));
    }

    function shimsStream() {
        return gulp.src(config.shims.map(x => x.main))
            .pipe(g.concat("shims.js"));        
    }

    function polyfillsStream() {
        return gulp.src(config.polyfills.map(x => x.main))
            .pipe(g.concat("polyfills.js"));
    }

    function vendorsStream() {
        var libsContent = config.vendors.map(lib => `require('${lib.name}')`).join("\n");
        return g.file("vendors.js", libsContent, {src: true})
            .pipe(through.obj(function(chunk, enc, callback) {
                var result = cjs2amd.convert({
                    name: "vendors",
                    input: "vendors.js",
                    inputData: chunk.contents.toString(),
                    root: "./node_modules",
                    recursive: true,
                    bundle: true,
                    noRequireShim: true,
                    noDefineSelf: true,
                    cutNodePath: true
                });
                chunk.contents = Buffer.from(result, "utf8");
                callback(null, chunk);
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