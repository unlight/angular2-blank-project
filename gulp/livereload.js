module.exports = (gulp, g, config) => {
    gulp.task("livereload", function(done) {
        var history = require("connect-history-api-fallback");
        var connect = g.connect.server({
            root: ["build", "."],
            livereload: config.isDev,
            port: config.PORT,
            middleware: (connect, opt) => [
                history()
            ]
        });
        connect.server.on("close", done);
    });
};