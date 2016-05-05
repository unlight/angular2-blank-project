module.exports = (gulp, config, karmaServer) => {

    gulp.task("karma", done => {
        config.karma.singleRun = true;
        karmaServer(config.karma, done);
    });

};