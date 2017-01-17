import * as _ from 'lodash';
import { Config } from 'karma';
const argv = require('minimist')(process.argv.slice(2));

module.exports = (config: any) => {

    const karma: Config = config;

    karma.set({
        basePath: './build',
        files: [
            { pattern: 'main.test.js' },
        ],
        browsers: ['PhantomJS'],
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-sourcemap-loader',
            'karma-coverage',
            'karma-remap-coverage',
        ],
        frameworks: [
            'jasmine',
        ],
        preprocessors: {
            'main.test.js': ['sourcemap'],
        },
        reporters: ['progress'],
        autoWatch: true,
        singleRun: false,
        port: 9876,
        logLevel: config.LOG_INFO
    });

    config.set({
        remapOptions: {
            basePath: './src',
            exclude: (file: string) => {
                if (_.endsWith(file, '.spec.ts')) return true;
                if (_.endsWith(file, '~tmp-spec-files.ts')) return true;
                if (_.includes(file, '\\packages')) return true;
                return false;
            }
        }
    });

    if (argv.coverage) {
        config.set({
            coverageReporter: { type: 'in-memory' },
            remapCoverageReporter: {
                'text-summary': null,
                html: '.coverage'
            },
        })
        config.preprocessors['main.test.js'] = ['coverage'];
        config.reporters = ['progress', 'coverage', 'remap-coverage'];
    }
};
