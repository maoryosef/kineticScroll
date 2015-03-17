module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
            server: {
                files: {
					'client/css/app.css' : 'client/scss/app.scss'
                },
                options: {
                    debugInfo: true,
                    sourceComments: 'normal'
                }
            }
		},
		concat: {
    		options: {
      			process: function(src, filepath) {
          			return '// Source: ' + filepath + '\n' + src;
        		}
    		},
    		dist: {
      			src: ['client/src/requestAnimFrame.js', 'client/src/app_using_jquery.js'],
      			dest: 'client/app.js'
			},
			ang_dist: {
      			src: ['client/src/mainModule.js', 'client/src/mainController.js'],
      			dest: 'client/app2.js'
			}
  		},
		watch: {
			css: {
				files: ['**/*.scss', '**/*.js', '!client/app.js'],
				tasks: ['sass', 'concat:ang_dist']
			}
		},
		uglify: {
			options: {
				mangle: true
			},
			dist: {
				files: {
					'client/app2.min.js': ['client/app2.js'],
					'client/src/drag-scroll.min.js': ['client/src/drag-scroll.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');
	grunt.registerTask('default',['watch']);
}