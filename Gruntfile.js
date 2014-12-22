module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        files: [
          { expand: true, src: ['assets/*'], dest: 'build/' },
          { expand: true, src: ['src/index.html'], dest: 'build/', flatten: true },
          { expand: true, src: ['src/js/lib/require.js'], dest: 'build/js/lib/', flatten: true },
        ],
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

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['copy', 'requirejs']);
};
