module.exports = (gulp, g, config, _) => {

    // var bundless = require('bundless/dist/src/sample-server.js').default;
    // // console.log('bundless ' , bundless);
    // var configuration = {
    // 	forceHttp1: true,
    // 	rootDir: process.cwd(),
    // 	srcDir: 'build', // Your local .js files, relative to rootDir
    // 	srcMount: '/modules', // URL prefix of local files
    // 	libMount: '/lib', // URL prefix of libraries (npm dependencies)
    // 	nodeMount: '/$node', // Internal URL prefix of Node.js libraries
    // 	systemMount: '/$system', // Internal URL of the system bootstrap,
    // 	ssl: require('spdy-keys') // SSL certificates
    // };

    gulp.task('bundless', function () {
        const bundless = require('bundless/sample-server');
        const express = require('express');
        const path = require('path');
        var serveStatic = require('serve-static')

        const app = express();
        const topology = {
            rootDir: process.cwd(),
            srcDir: 'build/js',             // Your local .js files, relative to rootDir
            srcMount: '/modules',       // URL prefix of local files
            libMount: '',           // URL prefix of libraries (npm dependencies)
            nodeMount: '/$node',        // Internal URL prefix of Node.js libraries
            ssl: require('spdy-keys') // SSL certificates
        };
        app.use(bundless.express(topology));
        app.use(serveStatic('build/'));

        app.listen(8080, function (err) {
            err ? console.error(err) : console.log(`Listening at ${this.address().address}:${this.address().port}`);
        });
    });
};
