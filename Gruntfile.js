module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';\n'
            },
            dist: {
                src: [
                    'public/scripts/angular.js',
                    'public/scripts/angular-animate.js',
                    'public/scripts/ui-bootstrap-tpls.min.js',
                    'public/bower_components/angular-sanitize/angular-sanitize.js',
                    'public/scripts/angular-flash.js',
                    'public/scripts/angular-ui-routerV0.48.min.js',
                    'public/scripts/loading-bar.js',
                    // 'public/scripts/angular-flash.js',
                    'public/front-end/states.js',
                    'public/front-end/**/*.js',],
                dest: 'public/compiled/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today() %> */\n'
            },
            dist: {
                files: {
                    'public/compiled/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js',
                'public/front-end/**/*.js'],
                // 'public/content/dashboard/vendors/**/*.js',
                // 'public/content/dashboard/assets/js/app.js'],
                // 'public/content/dashboard/assets/js/scripts/alertify-demo.js'],
                // 'modules/**/*.js'],
            options: {
                esversion: 6,
                globals: {
                    jQuery: true,
                }
            }
        },
        // cssmin: {
        // options: {
        // roundingPrecision: -1,
        // shorthandCompacting: true,
        // keepSpecialComments: 0
        // },
        // target: {
        // files: {
        // 'app/compiled/css/<%= pkg.name %>.min.css': [
        // 'build/css/*.css',
        // 'css/*.css',
        // 'test/**/*.css'
        // ]
        // }
        // }
        // },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'concat', 'uglify'/* , 'cssmin' */]
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    // grunt.loadNpmTasks('grunt-contrib-cssmin');


    grunt.registerTask('default', ['jshint', 'concat', 'uglify', /* 'cssmin', */ 'watch']);

};