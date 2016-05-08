module.exports = (gulp, g, config, karmaServer) => {

    gulp.task("karma", done => {
        // Watch task is running, so run karma in watch mode.
        if (g.util.env._.indexOf("watch") === -1) {
            config.karma.singleRun = true;  
        }
        karmaServer(config.karma, done);
    });

};