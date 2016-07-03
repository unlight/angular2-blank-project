module.exports = (gulp, config) => {

    gulp.task("symlinks", function symlinks(done) {
        if (!config.isProd) {
            var link = require("fs-symlink");
            link("node_modules", "build/node_modules", "junction");
        }
        done();
    });

};