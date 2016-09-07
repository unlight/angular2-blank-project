const path = require("path");
const Builder = require("systemjs-builder");

module.exports = (gulp) => {

    gulp.task("setup", (done) => {

        var builder = new Builder({
            defaultJSExtensions: true,
            baseURL: './node_modules',
            paths: {
                "systemjs-hot-reloader": "systemjs-hot-reloader/hot-reloader.js",
                "socket.io-client": "socket.io-client/socket.io.js",
                "weakee": "weakee/weakee.js",
                "debug": "debug/browser.js",
                "ms": "ms/index.js",
            }
        });

        return builder.bundle('systemjs-hot-reloader', 'node_modules/.tmp/systemjs-hot-reloader.js', {
            sourceMaps: true,
            sourceMapContents: true,
            minify: false,
            mangle: false
        });
    });
};
