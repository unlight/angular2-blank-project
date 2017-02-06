import * as _ from 'lodash';
import { Config } from 'karma';
const argv = require('minimist')(process.argv.slice(2));
const specBundleFile = 'spec.bundle.js';

module.exports = (config: any) => {

    const karma: Config = config;

    karma.set({
        basePath: './build',
        files: [
            { pattern: specBundleFile },
        ],
        browsers: ['PhantomJS'],
        frameworks: [
            'jasmine',
        ],
        preprocessors: {
            [specBundleFile]: ['sourcemap'],
        },
        reporters: ['progress'],
        autoWatch: true,
        singleRun: false,
        port: 9876,
        logLevel: config.LOG_INFO
    });

    if (argv.coverage) {
        config.set({
            remapOptions: {
                basePath: './src',
                exclude: (file: string) => {
                    if (_.endsWith(file, '.spec.ts')) return true;
                    if (_.endsWith(file, '~tmp-spec-files.ts')) return true;
                    if (_.includes(file, '\\packages')) return true;
                    return false;
                }
            },
            coverageReporter: { type: 'in-memory' },
            remapCoverageReporter: {
                'text-summary': null,
                html: __dirname + '/.testresults/coverage',
            },
        })
        config.preprocessors[specBundleFile] = ['coverage'];
        config.reporters = ['progress', 'coverage', 'remap-coverage'];
    }

    if (argv.reports) {

        config.set({
            reporters: ['mocha', 'html', 'junit'],
            mochaReporter: {
                symbols: {
                    success: '+',
                    info: '#',
                    warning: '!',
                    error: '-'
                }
            },
            htmlReporter: {
                outputDir: __dirname + '/.testresults',
                namedFiles: true,
                reportName: 'index',
                pageTitle: 'JsTest',
            },
            junitReporter: {
                outputDir: __dirname + '/.testresults',
                outputFile: 'js-junit.xml',
                useBrowserName: false
            },
        });
    }
};
