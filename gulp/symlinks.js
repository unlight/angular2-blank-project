module.exports = (gulp, g, config, debug) => {

    gulp.task("symlinks", function symlinks() {
        var link = require("fs-symlink");
        return link("node_modules", "build/node_modules", "junction");
    });

};