"use strict";

const gulp = require("gulp");
const g = require("gulp-load-plugins")({ scope: ['devDependencies', 'optionalDependencies'] });
const lastRun = require("last-run");
const saveStream = require("save-stream");
const _ = require("lodash");
const config = require("./env.conf");
const args = g.util.env;
const del = require("del");
const fs = require("fs");
const mkdirp = require("mkdirp");
const util = require("util");
const path = require("path");
const unixify = require("unixify");
const combine = require("stream-combiner");

var state = {
    inlined: []
};

require("gulp-di")(gulp, { scope: [] })
    .tasks("gulp")
    .provide("g", g)
    .provide("args", args)
    .provide("config", config)
    .provide("paths", config.paths)
    .provide("debug", debug)
    .provide("clearLastRun", clearLastRun)
    .provide("typingsStream", _.once(() => gulp.src(config.typings).pipe(saveStream())))
    .provide("watchHelper", watchHelper())
    .provide("hashOptions", hashOptions())
    .provide("sassPipe", sassPipe)
    .provide("state", state)
    .provide("lib", lib)
    .resolve();

gulp.task("build", gulp.series(
    "clean",
    "scripts",
    gulp.parallel("styles", "assets"),
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
    gulp.parallel("watch", "server")
));

function lib(file) {
    file = path.resolve(file).slice(config.projectRoot.length + 1);
    return unixify(file);
}

function sassPipe() {
    return combine([
        g.sassLint(),
        g.sassLint.format(),
        g.if(config.isProd, g.sassLint.failOnError()),
        g.sass(),
    ]);
}

function debug(title, ns) {
    var arg = args.debug;
    var debugStream = g.debug({ title: title });
    if (arg === true || arg === "*") {
        return debugStream;
    } else if (typeof arg === "string") {
        title = title.toLowerCase();
        arg = arg.toLowerCase();
        if (_.includes(title, arg) || (ns && _.includes(ns, arg))) {
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

function watchHelper() {
    const lockFile = "node_modules/.tmp/watch.pid";
    return {
        lock() {
            mkdirp.sync("node_modules/.tmp");
            fs.writeFileSync(lockFile, process.pid);
        },
        unlock() {
            del.sync(lockFile);
        },
        isLocked() {
            return fs.existsSync(lockFile);
        }
    };
}

function hashOptions() {
    var version = config.package.version;
    var hashVersionPrefix = util.format("%s.%s", version, g.util.date("yyyymmdd'T'HHMMss"));
    var template = '<%= name %><%= ext %>?v=' + hashVersionPrefix + '-<%= hash %>';
    return {
        algorithm: 'md5',
        hashLength: 6,
        template: template,
        version: version,
    };
}
