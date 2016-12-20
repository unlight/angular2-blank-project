const del = require("del");

module.exports = (gulp, args) => {

    gulp.task("clean", function clean() {
        return del([".fusebox", "build", ".coverage"]);
    });

};
