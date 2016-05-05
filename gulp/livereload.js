module.exports = (gulp, g, config) => {
    gulp.task("livereload", function(done) {
        var history = require("connect-history-api-fallback");
        var rootFolders = ["build"];
        if (config.isDev) {
            rootFolders.push(".");
        }
        var connect = g.connect.server({
            root: rootFolders,
            livereload: config.isDev,
            port: config.PORT,
            middleware: (connect, opt) => [
                history()
            ]
        });
        connect.server.on("close", done);
    });
};