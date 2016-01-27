'use strict';

module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {


            serverViews: {
                files: ['app/views/**'],
                options: {
                    livereload: true
                }
            },
            serverJS: {
                files: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            clientViews: {
                files: ['public/modules/**/views/**/*.html'],
                options: {
                    livereload: true
                }
            },
            clientJS: {
                files: ['public/js/**/*.js', 'public/modules/**/*.js', '!public/modules/**/e2e/**'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
//            clientCSS: {
//                files: ['public/**/css/*.css'],
//                tasks: ['csslint'],
//                options: {
//                    livereload: true
//                }
//            },
            clientLESS: {
                files: ['public/**/css/**/*.less'],
                tasks: ['less'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/**/*.js', 'public/modules/**/*.js', '!public/modules/**/e2e/**'],
                options: {
                    jshintrc: true
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ['assets/css']
                },
                files: {'public/modules/core/css/rememberators.css': 'public/modules/core/css/rememberators.less'}


            },
            production: {
                options: {
                    paths: ['assets/css'],
                    cleancss: true
                },
                files: {'public/modules/core/css/rememberators.css': 'public/modules/core/css/rememberators.less'}
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: ['public/modules/**/css/*.css']
            }
        },
        uglify: {
            production: {
                options: {
                    mangle: false
                },
                files: {
                    'public/dist/application.min.js': '<%= applicationJavaScriptFiles %>'
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'public/dist/application.min.css': '<%= applicationCSSFiles %>'
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug']
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        mochaTest: {
            src: ['app/tests/**/*.js'],
            options: {
                reporter: 'spec',
                require: 'server.js'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                autoWatch: true
            }
        },
        protractor: {
            options: {
                keepAlive: true,
                configFile: 'protractor.conf.js'
            },
            run: {}
        }
    });

    // Load NPM tasks 
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // A Task for loading the configuration object
    grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
//    	var init = require('./config/init')();
    	var config = require('./config/config');

    	grunt.config.set('applicationJavaScriptFiles', config.assets.js);
    	grunt.config.set('applicationCSSFiles', config.assets.css);
    });

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'less', 'concurrent']);

    // Lint task(s).
    grunt.registerTask('lint', ['jshint', 'csslint']);

    // Build task(s).
    grunt.registerTask('build', ['jshint', 'csslint', 'loadConfig' ,'uglify', 'cssmin']);

    // Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit', 'protractor:run']);


    grunt.registerTask('mocha', ['env:test', 'mochaTest']);

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.loadNpmTasks('grunt-karma');
};
