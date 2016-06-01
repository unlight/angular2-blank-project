const combine = require("stream-combiner");
const merge2 = require("merge2");
var path = require("path");
var streamify = require("stream-array");
var escodegen = require("escodegen");
var cjsify = require("commonjs-everywhere").cjsify;
const del = require("del");
var through = require("through2");
var cjs2amd = require("cjs2amd");

module.exports = (gulp, g, config, paths, typingsStream, debug, _) => {

    gulp.task("scripts", function scripts(done) {
        var sourceRoot = "src/app";
        var sourceStream = merge2(
            typingsStream().load(),
            gulp.src(paths.srcApp("**/*.ts"), {since: gulp.lastRun("scripts")})
        );
        var appStream = sourceStream
            .pipe(debug("Merged scripts", "scripts"))
            .pipe(g.if(config.isProd, g.ignore.include(tsSourceCondition)))
            .pipe(g.if(tsLintCondition, combine(
                g.tslint(),
                g.tslint.report("verbose", {emitError: false})
            )))
            .pipe(g.if("main.ts", g.preprocess({ context: config })))
            .pipe(g.if("!*.d.ts", g.inlineNg2Template({ useRelativePaths: true })))
            .pipe(g.if(config.isDev, g.sourcemaps.init()))
            .pipe(g.typescript(config.tsProject)).js
            .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
            .pipe(g.if(config.isProd, g.uglify()))
            .pipe(g.size({ title: "scripts" }))
            .pipe(gulp.dest(paths.destJs))
            .pipe(debug("Written", "scripts"))
            .pipe(g.connect.reload());
        return appStream;
    });

    gulp.task("cleanup", function() {
        return del([
            "build/node_modules"
        ]);
    });

    gulp.task("shims", shims);
    
    gulp.task("polyfills", polyfills);
    
    gulp.task("vendors", vendors);

    function shims() {
        return gulp.src(config.shims.map(x => x.main))
            .pipe(g.concat("shims.js"))
            .pipe(g.uglify())
            .pipe(gulp.dest("build/js"))        
    }

    function polyfills () {
        return gulp.src(config.polyfills.map(x => x.main))
            .pipe(g.concat("polyfills.js"))
            .pipe(g.uglify())
            .pipe(gulp.dest("build/js"))
    }

    function vendors() {
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
            }))
            .pipe(g.uglify())
            .pipe(gulp.dest("build/js"))
    }

    function tsLintCondition(file) {
        var excludeExtList = [".e2e-spec", ".spec", ".d"];
        var basename = path.basename(file.path, ".ts");
        var extname = path.extname(basename);
        return !_.includes(excludeExtList, extname);
    }

    function tsSourceCondition(file) {
        var excludeExtList = [".e2e-spec", ".spec"];
        var basename = path.basename(file.path, ".ts");
        var extname = path.extname(basename);
        return !_.includes(excludeExtList, extname);
    }

};