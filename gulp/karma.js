const karma = require("karma");

module.exports = (gulp, g, config) => {

    gulp.task("karma", done => {
        // Watch task is running, so run karma in watch mode.
        if (g.util.env._.indexOf("watch") === -1) {
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
