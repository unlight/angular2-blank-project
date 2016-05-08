const del = require("del");

module.exports = (gulp, config, debug, _) => {
    
    gulp.task("clean", function clean() {
        return del(["build", ".coverage"]);
    });

};