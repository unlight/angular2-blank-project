/**
 * This setup is based on Julie Ralph's `ng2-test-seed` project.
 * See https://github.com/juliemr/ng2-test-seed
 * Hopefully Angular2 and Karma integration will be more seamless in the future.
 * Unit tests are currently only implemented to run against the development target.
 */

module.exports = function(karma) {
	var config = {
		basePath: '',

		frameworks: ['jasmine'],

		files: [
			/** Paths loaded by Karma */
			{ pattern: 'node_modules/traceur/bin/traceur.js', included: true, watched: true },
			{ pattern: 'node_modules/systemjs/dist/system-polyfills.js', included: true, watched: true },
			{ pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: true },
			{ pattern: 'node_modules/angular2/bundles/angular2.dev.js', included: true, watched: true },
			{ pattern: 'node_modules/angular2/bundles/testing.js', included: true, watched: true },
			{ pattern: 'karma.shim.js', included: true, watched: true },

			/** Paths loaded via module imports */
			{ pattern: 'build/js/**/*.js', included: false, watched: true },

			/** Paths to unit tests */
			{ pattern: 'test/unit/**/*.spec.js', included: false, watched: false },

			/** Paths to support debugging with source maps in dev tools */
			{ pattern: 'src/app/**/*.ts', included: false, watched: false }
		],

		exclude: [
			'node_modules/angular2/**/*_spec.js'
		],

		reporters: ['progress', 'coverage'],

		preprocessors: {
			/**
			 * Source files, that you want to generate coverage for.
			 * Do not include tests or libraries.
			 * These files will be instrumented by Istanbul.
			 */
			'build/js/**/*.js': ['coverage']
		 },

		/** Optionally, configure the reporter */
		coverageReporter: {
			type: 'json',
			subdir: './json',
			file: 'coverage-js.json'
		},

		port: 9876,
		colors: true,
		logLevel: karma.LOG_INFO,

		/**
		 * @param browsers {Array} List of browsers for Karma to run the tests against.
		 * We can use `Chrome`, `Firefox` or `PhantomJS2` out-of-the-box here.
		 * Unfortunately `PhantomJS2` support is limited for Linux users or Travis CI.
		 *
		 * Note: When running in Travis we set the browser to `Firefox` as `Chrome`
		 * isn't available there.
		 */
		browsers: ['Chrome'],

		autoWatch: false,
		singleRun: true
	};

	if (process.env.TRAVIS) {
		config.browsers = ['Firefox'];
	}

	karma.set(config);
};
