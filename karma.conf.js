'use strict';

/**
 * Module dependencies.
 */
var applicationConfiguration = require('./config/config');

// Karma configuration
module.exports = function(config) {
	config.set({
		// Frameworks to use
		frameworks: ['jasmine'],

		// List of files / patterns to load in the browser
		files: applicationConfiguration.assets.lib.js.concat(applicationConfiguration.assets.js, applicationConfiguration.assets.tests),
		//files: [
		//	{pattern: '**/tests/unit/**/*.js', watched: true, included: true, served: true},
		//	{pattern: '**/services/**/*.js', watched: true, included: true, served: true},
		//],

		proxies: {'/modules/': '/public/modules/'},


		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		//reporters: ['progress'],
		reporters: ['progress', 'coverage'],
//		reporters: ['coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
           // 'public/modules/courses/controllers/courses.client.controller.js': ['coverage']
        },

        coverageReporter: { type : 'html', dir : 'coverage/' },

		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],
//		browsers: ['Chrome'],


		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: false
	});
};
