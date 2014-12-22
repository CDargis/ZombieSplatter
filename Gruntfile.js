module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    customConfig: grunt.file.readJSON('config.json'),
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', '!src/js/lib/*.js'],
    },
    copy: {
      main: {
        files: [
          { expand: true, src: ['assets/*'], dest: 'build/' },
          { expand: true, src: ['src/js/lib/require.js'], dest: 'build/js/lib/', flatten: true },
        ],
      },
    },
    replace: {
      index: {
        src: ['src/index.html'],
        dest: 'build/',
        replacements: [{
          from: 'http://localhost:8080/',
          to: '<%= customConfig.rootContext %>'
        }],
      },
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'src/js/',
          mainConfigFile: 'src/js/main.js',
          name: 'main',
          out: 'build/js/main.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['jshint', 'copy', 'replace', 'requirejs']);
};
