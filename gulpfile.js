const gulp = require("gulp");
const g = require("gulp-load-plugins")();
const lastRun = require("last-run");
const karma = require("karma");
const saveStream = require("save-stream");
const _ = require("lodash");
const config = require("./gulpfile.conf");
const debug = config.debug;

require("gulp-di")(gulp, {scope: []})
    .tasks("gulp")
    .provide("g", g)
    .provide("config", config)
    .provide("debug", debug)
    .provide("karmaServer", karmaServer)
    .provide("clearLastRun", clearLastRun)
    .provide("typingsStream", _.once(() => gulp.src(config.typings).pipe(saveStream())))
    .resolve();

function karmaServer(options, done) {
    const server = new karma.Server(options, error => {
        if (error) process.exit(error);
        done();
    });
    server.start();
    return server;
}

function clearLastRun(name) {
    var task = gulp._getTask(name);
    return function reset(done) {
        lastRun.release(task);
        done();
    };
}

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel("assets", "scripts", "styles"),
    "htdocs"
));
gulp.task("test", gulp.series("tests", "karma", "coverage"));
gulp.task("serve", gulp.parallel("watch", "livereload"));
gulp.task("develop", gulp.series("build", "serve"));
gulp.task("default", gulp.series("build", "test"));