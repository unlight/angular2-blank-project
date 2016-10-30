const karma = require("karma");

module.exports = (gulp, g, config, args, _) => {

    gulp.task("karma", done => {
        // Watch task is running, so run karma in watch mode.
        var isWatch = _.includes(args._, "watch") || args.w === true;
        if (!isWatch) {
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
