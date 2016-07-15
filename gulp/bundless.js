module.exports = (gulp, g, config, _) => {

	var bundless = require('bundless/dist/src/sample-server.js').default;
	// console.log('bundless ' , bundless);
	var configuration = {
		forceHttp1: true,
		rootDir: process.cwd(),
		srcDir: 'build', // Your local .js files, relative to rootDir
		srcMount: '/modules', // URL prefix of local files
		libMount: '/lib', // URL prefix of libraries (npm dependencies)
		nodeMount: '/$node', // Internal URL prefix of Node.js libraries
		systemMount: '/$system', // Internal URL of the system bootstrap,
		ssl: require('spdy-keys') // SSL certificates
	};

	gulp.task('bundless', function() {
		bundless(configuration).listen(3000, 'localhost', function(err) {
			console.log("Bundless listening at " + this.address().address + ":" + this.address().port);
		});
	});

};