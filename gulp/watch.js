const fs = require("fs");

module.exports = (gulp, g, config, paths, clearLastRun) => {

    gulp.task("watch", (done) => {
        var watchOptions = {delay: 100};
        const watchers = [
            gulp.watch(paths.srcApp("**/*.ts"), watchOptions, gulp.series("scripts")),
            // If we changnig *.html we must recompile corresponsding component,
            gulp.watch(paths.srcApp("**/*.html"), watchOptions)
                .on("change", onHtmlChange),
            gulp.watch("src/index.html", watchOptions, gulp.series("htdocs")),
            gulp.watch(["src/**/*.{scss,less,css}", "!src/**/_*.{scss,less,css}"], watchOptions)
                .on("change", gulp.series("styles"))
                .on("add", rebuildHtdocs)
                .on("unlink", rebuildHtdocs),
            gulp.watch("src/**/_*.{scss,less}", watchOptions, gulp.series(clearLastRun("styles"), "styles")),
        ];

        process.on("SIGINT", () => {
            watchers.forEach(w => w.close());
            done();
        });
    });

    function onHtmlChange(path) {
        var tsfile = g.util.replaceExtension(path, ".ts");
        if (fs.existsSync(tsfile)) {
            var fd = fs.openSync(tsfile, "r+");
            fs.futimesSync(fd, new Date(), new Date());
            fs.closeSync(fd);
            // Do not need to run scripts, watcher triggers it by itself.
        } else {
            gulp.series(clearLastRun("scripts"), "scripts").call();
        }
    }

    function rebuildHtdocs(path) {
        gulp.series(clearLastRun("styles"), "styles", "htdocs").call();
    }

};
