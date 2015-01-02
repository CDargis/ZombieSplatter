module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    customConfig: grunt.file.readJSON('config.json'),
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', '!src/js/lib/*.js', 'test/**/*.js'],
      options: {
        bitwise: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        freeze: true,
        funcscope: true,
        globals: {'define': true, 'module': true, 'createjs': true, 'Image': true, 'sinon': true,
                    'require': true, 'document': true, 'QUnit': true, 'test': true },
        immed: true,
        indent: 2,
        latedef: true,
        maxlen: 110,
        noempty: true,
        quotmark: 'single',
        shadow: false,
        undef: true,
        unused: true
      },
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.',
        },
      },
    },
    qunit: {
      all: {
        options: {
          urls: ['http://localhost:8000/src/testsuite.html'],
        },
      },
    },
    clean: ['build/'],
    copy: {
      main: {
        files: [
          { expand: true, src: ['assets/*'], dest: 'build/' },
          { expand: true, src: ['src/js/lib/require.js'], dest: 'build/js/lib/', flatten: true },
          { expand: true, src: ['src/css/main.css'], dest: 'build/css/', flatten: true },
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
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('unit', ['connect', 'qunit']);
  grunt.registerTask('default', ['unit', 'jshint', 'clean', 'copy', 'replace', 'requirejs']);
};
