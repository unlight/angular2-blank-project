const fs = require("fs");

module.exports = (gulp, g, args, config, paths, _, clearLastRun, watchHelper, state, lib) => {

    gulp.task("watch", (done) => {
        if (watchHelper.isLocked() && args.f !== true) {
            g.util.log(g.util.colors.red("WARNING!"));
            g.util.log(g.util.colors.yellow("Watch task is not started, because it is already running somewhere near."));
            // g.util.log(g.util.colors.yellow("If not, start task with -f argument"));
            return done();
        }
        watchHelper.lock();
        var watchOptions = { delay: 100 };
        const watchers = [
            gulp.watch(paths.src("**/*"), watchOptions)
                .on('all', sourceAllHandler),
            gulp.watch(paths.srcApp("**/*.ts"), watchOptions, gulp.series("scripts")),
            // If we changnig *.html we must recompile corresponsding component.
            gulp.watch(paths.srcApp("**/*.html"), watchOptions)
                .on("change", checkComponentFile("scripts")),
            gulp.watch("src/index.html", watchOptions, gulp.series("htdocs")),
            gulp.watch(["src/**/*.{scss,less,css}", "!src/**/_*.{scss,less,css}"], watchOptions)
                .on("change", checkComponentFile("styles"))
                .on("add", addStyleHandler())
                .on("unlink", removeStyleHandler()),
            gulp.watch("src/**/_*.{scss,less}", watchOptions, gulp.series(clearLastRun("styles"), "styles")),
        ];

        process.on("SIGINT", () => {
            watchers.forEach(w => w.close());
            watchHelper.unlock();
            done();
        });
    });

    function checkComponentFile(fallbackTask) {
        // TODO: Use state.inlined
        return function(path) {
            // Get corresponsding component file, home.component.css => home.component.ts
            var tsfile = lib(g.util.replaceExtension(path, ".ts"));
            // if (_.includes(state.inlined)
            if (fs.existsSync(tsfile)) {
                var fd = fs.openSync(tsfile, "r+");
                fs.futimesSync(fd, new Date(), new Date());
                fs.closeSync(fd);
                // Do not need to run scripts, watcher triggers it by itself.
            } else {
                gulp.series(clearLastRun(fallbackTask), fallbackTask).call();
            }
        };
    }

    function removeStyleHandler(path) {
        return gulp.series(clearLastRun("styles"), "clean-styles", "styles", "htdocs");
    }

    function addStyleHandler(path) {
        return gulp.series(clearLastRun("styles"), "styles", "htdocs");
    }

    function sourceAllHandler(type, file) {
        var line = new Array((process.stdout.columns || 80) + 1).join('\u2500');
        process.stdout.write(g.util.colors.gray.dim(line));
    }

};
