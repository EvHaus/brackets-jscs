/* global module */

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compress: {
			build: {
				options: {
					archive: 'build/brackets-jscs-<%= pkg.version %>.zip'
				},
				files: [{
					src: [
						'bower_components/react/JSXTransformer.js',
						'jscs/jscs-browser.js',
						'main.js',
						'LICENSE',
						'NOTICE',
						'package.json',
						'README.md'
					],
					dest: '/'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('build', ['compress']);
};