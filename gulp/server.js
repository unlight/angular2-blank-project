module.exports = (gulp, g, config) => {
    gulp.task("server", function(done) {
        var history = require("connect-history-api-fallback");
        var folders = ["build"];
        if (config.isDev) {
            folders.push(".");
        }
        var connect = g.connect.server({
            root: folders,
            livereload: config.isDev,
            port: config.PORT,
            middleware: (connect, opt) => [ // eslint-disable-line no-unused-vars
                history()
            ]
        });
        connect.server.on("close", done);
    });
};
