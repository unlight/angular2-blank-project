module.exports = (gulp, config) => {

    gulp.task("symlinks", function symlinks(done) {
        if (config.isProd) {
            return done();
        }
        var link = require("fs-symlink");
        return Promise.all([
            link("node_modules", "build/node_modules", "junction"),
        ]);
    });

};
