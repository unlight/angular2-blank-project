require("reflect-metadata");
const path = require("path");

exports.config = {
	framework: "jasmine2",
	baseUrl: "http://localhost:8080/",
	// chromeDriver: 'c:/ProgramData/chocolatey/lib/nodist/tools/nodist-master/bin/node_modules/protractor/selenium/chromedriver_2.21.exe',
	// seleniumServerJar: 'c:/ProgramData/chocolatey/lib/nodist/tools/nodist-master/bin/node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar',
	capabilities: {
		browserName: "chrome",
		// binary: path.join(process.env.LOCALAPPDATA, "Google/Chrome SxS/Application/chrome.exe"),
		chromeOptions: {
			args: ["show-fps-counter=true", "incognito"]
		}
	},
	directConnect: true,
	allScriptsTimeout: 110000,
	getPageTimeout: 100000,
	jasmineNodeOpts: {
		isVerbose: false,
		showColors: true,
		includeStackTrace: false,
		defaultTimeoutInterval: 400000
	},
	/**
	 * Angular2 related configuration
	 * `useAllAngular2AppRoots` tells Protractor to wait for any Angular 2 apps
	 * on the page instead of just the one matching `rootEl`
	 */
	useAllAngular2AppRoots: true
};