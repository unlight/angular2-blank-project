const del = require("del");

module.exports = (gulp) => {
    
    gulp.task("clean", function clean() {
        return del(["build", ".coverage"]);
    });

    gulp.task("cleanup", function() {
        return del([
            "build/node_modules"
        ]);
    });
};