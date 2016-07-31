"use strict";

const gulp = require("gulp");
const g = require("gulp-load-plugins")({ scope: ['devDependencies', 'optionalDependencies'] });
const lastRun = require("last-run");
const saveStream = require("save-stream");
const _ = require("lodash");
const config = require("./env.conf");
const args = g.util.env;

require("gulp-di")(gulp, { scope: [] })
    .tasks("gulp")
    .provide("g", g)
    .provide("config", config)
    .provide("paths", config.paths)
    .provide("debug", debug)
    .provide("clearLastRun", clearLastRun)
    .provide("typingsStream", _.once(() => gulp.src(config.typings).pipe(saveStream())))
    .resolve();

function debug(title, namespace) {
    var arg = args.debug;
    var debugStream = g.debug({ title: title });
    if (arg === true || arg === "*") {
        return debugStream;
    } else if (typeof arg === "string") {
        title = title.toLowerCase();
        arg = arg.toLowerCase();
        if (title.indexOf(arg) !== -1 || (namespace && namespace.indexOf(arg) !== -1)) {
            return debugStream;
        }
    }
    return g.util.noop();
}

function clearLastRun(task) {
    var fn = task;
    if (typeof task === "string") {
        fn = gulp._getTask(task);
    }
    var metadata = require("undertaker/lib/helpers/metadata");
    var meta = metadata.get(fn);
    if (meta) {
        fn = meta.orig || fn;
    }
    return function reset(done) {
        lastRun.release(fn);
        done();
    };
}

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel("scripts", "styles", "assets"),
    "htdocs",
    "symlinks"
));

gulp.task("test", gulp.series(
    "build",
    "karma",
    "coverage"
));

gulp.task("serve", gulp.series(
    "build",
    gulp.parallel("watch", "livereload")
));
