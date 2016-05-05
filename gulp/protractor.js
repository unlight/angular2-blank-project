const merge2 = require("merge2");

module.exports = (gulp, config) => {

	gulp.task("protractor", function protractor() {
	    var glob = [
	        "src/scripts/**/*.e2e.ts"
	    ];
	    var sourceRoot = "src/scripts";
	    var dest = "build/js";
	    var sourceStream = merge2(
	        typingsStream().load(),
	        gulp.src(glob, { since: gulp.lastRun("protractor") })
	    );
	    return sourceStream
	        .pipe(debug("Test file", "protractor"))
	        .pipe(g.if(config.isDev, g.sourcemaps.init()))
	        .pipe(g.typescript(config.tsProject)).js
	        .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
	        .pipe(gulp.dest(dest))
	        .pipe(g.protractor.protractor({configFile: "protractor.conf.js"}));
	});

};