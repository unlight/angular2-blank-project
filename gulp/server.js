var path = require("path");
var systemjsMiddleware = require('systemjs-middleware/server/middleware');

module.exports = (gulp, g, config, paths) => {
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
            middleware: (connect, opt) => {
                systemjsMiddleware.configure({
                    basePath: "build"
                });
                systemjsMiddleware.setup(opt.app);
                // opt.app.use('/x', (req, res, next) => {
                //     res.end('xxx');
                // });
                return [
                    history()
                ]
            }
        });

        if (config.hotreload) {
            var chokidarEvEmitter = require("chokidar-socket-emitter");
            chokidarEvEmitter({
                app: connect.server,
                path: path.join(paths.destJs, "**/*.js")
            });
        }

        connect.server.on("close", done);
    });
};
