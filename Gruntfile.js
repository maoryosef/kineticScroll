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
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');
	grunt.registerTask('default',['watch']);
}