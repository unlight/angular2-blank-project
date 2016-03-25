process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
process.env.PORT = process.env.PORT ? process.env.PORT : "8080";

var unixify = require("unixify");
var gutil = require("gulp-util");
var pkgDir = require("pkg-dir");

var projectRoot = pkgDir.sync();

function lib(path) {
	path = require.resolve(path).slice(projectRoot.length + 1);
	return unixify(path);
}

var baseLibs = [
	lib("systemjs/dist/system-polyfills.js"),
	lib("systemjs/dist/system.js"),
	lib("es6-shim"),
	lib("rxjs/bundles/Rx.js"),
	lib("angular2/bundles/angular2-polyfills.js"),
	lib("angular2/bundles/angular2.dev.js"),
	lib("angular2/bundles/router.dev.js"),
	lib("angular2/bundles/http.dev.js"),
	lib("lodash")
];

var paths = {
	typings: [
		lib("angular2/typings/browser.d.ts"),
		"typings/main.d.ts"
	],

	dev: {
		jslibs: [
			...baseLibs
			// Add dev only libs here - eg "node_modules/debug-lib/index.js"
		]
	},

	prod: {
		jslibs: [
			...baseLibs
			// Add prod only libs here - eg "node_modules/analytics-lib/index.js"
		]
	},

	test: {
		jslibs: [
			...baseLibs,
			lib("angular2/bundles/testing.dev.js"),
			"karma.shim.js"
		]
	}
};

module.exports = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	get isDev() {
		return !this.isProd;
	},
	get isProd() {
		return this.NODE_ENV === "production" || gutil.env.production === true;
	},
	get paths() {
		return this.isDev ? paths.dev : paths.prod;
	},
	test: paths.test,
	typings: paths.typings
};