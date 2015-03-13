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
      			dest: 'client/app.js',
			},
  		},
		watch: {
			css: {
				files: ['**/*.scss', '**/*.js'],
				tasks: ['sass', 'concat']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');
	grunt.registerTask('default',['watch']);
}