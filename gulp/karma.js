const karma = require("karma");

module.exports = (gulp, g, config, _) => {
    
    gulp.task("karma", done => {
        // Watch task is running, so run karma in watch mode.
        if (_.includes(g.util.env._, "watch")) {
            config.karma.singleRun = true;
        }
        karmaServer(config.karma, done);
    });

    function karmaServer(options, done) {
        const server = new karma.Server(options, (code) => {
            done(code ? new Error("Karma error code " + code) : null);
        });
        server.start();
        return server;
    }

};
