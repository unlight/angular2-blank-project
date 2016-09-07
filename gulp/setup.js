const path = require("path");
const Builder = require("systemjs-builder");

module.exports = (gulp) => {

    gulp.task("setup", (done) => {

        var builder = new Builder('./', './systemjs.config.js');

        return builder.bundle('capaj/systemjs-hot-reloader', 'node_modules/.tmp/systemjs-hot-reloader.js', {
            runtime: true,
            sourceMaps: true,
            sourceMapContents: true,
            minify: false,
            mangle: false
        });
    });
};
