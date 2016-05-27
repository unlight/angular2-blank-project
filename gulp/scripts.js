const combine = require("stream-combiner");
const merge2 = require("merge2");
var path = require("path");
var streamify = require("stream-array");
var escodegen = require("escodegen");
var cjsify = require("commonjs-everywhere").cjsify;
const del = require("del");

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
            .pipe(g.if("bootstrap.ts", g.preprocess({ context: config })))
            .pipe(g.if("!*.d.ts", g.inlineNg2Template({ useRelativePaths: true })))
            .pipe(g.if(config.isDev, g.sourcemaps.init()))
            .pipe(g.typescript(config.tsProject)).js
            .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
            .pipe(g.size({ title: "scripts" }))
            .pipe(gulp.dest(paths.destJs))
            .pipe(debug("Written", "scripts"))
            .pipe(g.connect.reload());
        return appStream;
    });

    gulp.task("cleanup", function() {
        return del([
            "build/node_modules",
            "build/js/**",
            "!build/js",
            "!build/js/polyfills.js",
            "!build/js/app.js"
        ]);
    });

    gulp.task("bundle", () => {
        return createStream("app.js", "js/bootstrap.js", process.cwd() + "/build")
            .pipe(g.uglify())
            .pipe(gulp.dest(paths.destJs));
    });

    gulp.task("polyfills", polyfills);
    
    // gulp.task("vendors", vendors);

    function polyfills () {
        return gulp.src(config.polyfills.map(x => x.main))
            .pipe(g.concat("polyfills.js"))
            .pipe(g.uglify())
            .pipe(gulp.dest("build/js"))
    }

    // function vendors() {
    //     var libsContent = config.vendors.map(lib => `require('${lib.name}')`).join("\n");
    //     return g.file("vendors.js", libsContent, {src: true})
    //         .pipe(g.bro())
    //         // .pipe(g.uglify())
    //         .pipe(gulp.dest("build/js"))
    // }

    function createStream(outFile, entry, root) {
        var ast = cjsify(entry, root);
        var result = escodegen.generate(ast);
        return streamify([new g.util.File({
            path: outFile,
            contents: new Buffer(result)
        })]);
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