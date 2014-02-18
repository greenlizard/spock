var env = process.env.CI ? 'continuous' : 'unit';
var path = require('path');
var config = {
  src_path: 'src',
  build_path: 'build',
  release_path: 'release',
  components_path: 'build/bower_components',
  coverage_path:  'coverage',
  require: 'config/require.js',
  require_map: 'config/src.map.js'
};

module.exports = function (grunt) {
  // grunt plugins
  var mountFolder = function (connect, dir) {
    return connect.static(path.resolve(dir));
  };

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: config,

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        autoWatch: true,
        singleRun: false,
      },
      continuous: {
        autoWatch: false,
        singleRun: true
      },
      coverage: {
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'src/scripts/**/*.js': ['coverage']
        },
        coverageReporter: {
          type: 'html',
          dir: 'coverage/'
        }
      },
    },

    watch: {
      build: {
        options: { livereload: true },
        files: ['<%= config.src_path %>/**/*'],
        //tasks: ['build']
      },
      source: {
        options: { livereload: true },
        files: ['<%= config.src_path %>/**/*'],
      },
    },

    connect: {
      release: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          livereload: false,
          keepalive: true,
          middleware: function (connect) {
            return [mountFolder(connect, config.release_path)];
          }
        }
      },
      build: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          livereload: true,
          middleware: function (connect) {
            return [mountFolder(connect, config.build_path)];
          }
        }
      },
      source: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          livereload: true,
          middleware: function (connect) {
            return [mountFolder(connect, '.')];
          }
        }
      },
      coverage: {
        options: {
          port: 5555,
          // hostname: '0.0.0.0',
          keepalive: true,
          open: true,
          middleware: function (connect) {
            var dir = grunt.file.glob.sync(require('path').resolve(config.coverage_path + '/PhantomJS*'))[0];
            return [mountFolder(connect, dir)];
          }
        }
      },
    },

    clean: {
      build: ['<%= config.build_path %>/**/*', '!<%= config.build_path %>/<%= config.require %>'],
      deps: ['<%= config.components_path %>'],
      coverage: ['<%= config.coverage_path %>'],
      require: ['<%= config.src_path %>/<%= config.require %>'],
      require_map: ['<%= config.src_path %>/<%= config.require_map %>'],
      base: ['base'],
      ngconstant: ['<%= config.src_path %>/config/constants.js']
    },

    copy: {
      build: {
        files: [{ src: ['**'], dest: '<%= config.build_path %>', cwd: '<%= config.src_path %>', expand: true }]
      },
      require: {
        files: [{ src: '<%= config.require %>', dest: '<%= config.src_path %>', cwd: './', expand: true }]
      },
      base: {
        files: [{ src: '<%= config.src_path %>/**', dest: 'base', cwd: './', expand: true }]
      },
      cov: {},
      deps: {
        files: [
          { expand: true,
            cwd: 'bower_components',
            src: [
              'jquery/jquery*.{js,map}',
              'angular*/*.js',
              '!angular-ui-router/**',
              'requirejs/require.js',
              'respond/*.js',
            ],
            dest: '<%= config.components_path %>' },
          { expand: true, cwd: 'bower_components/angular-ui-router', src: ['release/*.js'], dest: '<%= config.components_path %>/angular-ui-router' },
          { expand: true, cwd: 'bower_components/html5shiv', src: ['dist/**'], dest: '<%= config.components_path %>/html5shiv' },
          { expand: true, cwd: 'bower_components/bootstrap', src: ['dist/**'], dest: '<%= config.components_path %>/bootstrap' },
        ]
      }
    },

    ngconstant: {
      options: {
        space: '  '
      },
      unit: [{
        dest: '<%= config.src_path %>/config/constants.js',
        name: 'spock.constants',
        constants: {
          API_URL: 'http://localhost',
          API_PORT: '5984',
          API_PATH: 'ng-db'
        }
      }],
      continuous: [{
        dest: '<%= config.src_path %>/config/constants.js',
        name:  'spock.constants',
        constants: {
          API_URL: process.env.API_URL,
          API_PORT: process.env.API_PORT,
          API_PATH: 'ng-db',
          package: grunt.file.readJSON('package.json')
        }
      }]
    },

    bower: {
      source: {
        rjsConfig: '<%= config.src_path %>/<%= config.require %>'
      }
    },

    angular_map: {
      source: {
        options: {
          fileName: 'index.js',
          nsPrefix: 'spock',
          cwd: '<%= config.src_path %>/scripts',
          files: {
            src: [
              '*.js',
              '!app*.js',
              '!*.tpl.html',
              '!main.js',
              '!*.spec.js',
              '!*Auth*'
            ]
          }
        }
      }
    },

    require_map: {
      source: {
        options: {
          fileName: '<%= config.src_path %>/<%= config.require_map %>'
        },
        files: [{
          src: ['scripts/**/*.js', '!scripts/app.js', '!scripts/**/*.spec.js'],
          cwd: '<%= config.src_path %>'
        }]
      },
      base: {
        options: {
          fileName: '<%= config.src_path %>/<%= config.require_map %>'
        },
        files: [{
          src: ['base/src/scripts/**/*.js', '!base/src/scripts/app.js', '!base/src/scripts/**/*.spec.js', '!base/src/scripts/src.map.js',],
          cwd: '.'
        }]
      }
    },

    requirejs: {
      compile: {
        options: {
          appDir                  : './<%= config.build_path %>',
          dir                     : './release',
          mainConfigFile          : './<%= config.build_path %>/main.js',
          optimize                : 'uglify2',
          generateSourceMaps      : false,
          preserveLicenseComments : false,
          findNestedDependencies  : true,
          fileExclusionRegExp: /\.min\.js/,
          catchError: {
            define: true
          },
          paths: {
            jquery: 'empty:',
            angular: 'empty:',
            'angular-mocks': 'empty:',
            'angular-resource': 'empty:',
            'angular-bootstrap': 'empty:',
            'angular-ui-router': 'empty:',
          },
        }
      }
    },

    html2js: {
      spock: {
        options: {
          base: '<%= config.src_path %>/'
        },
        src: ['<%= config.src_path %>/scripts/**/*.tpl.html'],
        dest: '<%= config.src_path %>/scripts/templates.cache.js',
        module: 'spock.templates.cache'
      }
    },

    http: {
      deleteDb: {
        options: {
          url: 'http://127.0.0.1:5984/ng-db',
          method: 'DELETE',
        }
      },

      createDb: {
        options: {
          url: 'http://127.0.0.1:5984/ng-db',
          method: 'PUT',
        },
        body: {
          id:"ng-db",
          name:"ng-db"
        }
      }
    }

  });

  // grunt.registerTask('deps',           'install bower components and copy to build',            ['bower_install', 'clean:deps', 'copy:deps']);
  // grunt.registerTask('source',         'copy source to build',                                  ['clean:build', 'copy:build']);
  // grunt.registerTask('require',        'copy require to build and resolve deps',                ['clean:require', 'copy:require', 'bower', 'angular_map', 'clean:require_map']);
  // grunt.registerTask('build',          'make build using: [deps|source|require]',               ['require', 'angular_map', 'require_map:source', 'source', 'deps']);

  // grunt.registerTask('server',         'start server',                                          ['bower_install', 'require', 'angular_map', 'require_map:source', 'connect:source', 'watch:source']);
  // grunt.registerTask('test',           'make test',                                             ['copy:base', 'require', 'angular_map', 'require_map:base', 'clean:base', 'karma:' + env]);
  // grunt.registerTask('server_build',   'start server on build',                                 ['build', 'connect:build', 'watch:build']);

  // grunt.registerTask('release',        '',                                                      ['build', 'requirejs']);
  // grunt.registerTask('server_release', '',                                                      ['release', 'connect:release']);

  // grunt.registerTask('coverage',       'make coverage',                                         ['install', 'karma:coverage', 'connect:coverage']);
  // grunt.registerTask('default',        '',                                                      ['test']);

  grunt.registerTask('cmd', 'terminal commands', function (cmd, args) {
    var spawn = require('child_process').spawn;

    var done = this.async();
    var ls = spawn(cmd, args.split(','));

    ls.stdout.on('data', function (data) {
      grunt.log.write(data);
    });

    ls.stderr.on('data', function (data) {
      grunt.log.write(data);
    });

    ls.on('close', function (code) {
      grunt.log.writeln('child process exited with code ' + code);
    });
    done();
  });

  grunt.registerTask('deps', 'resolve deps', function(param) {
    if (!param) {
      grunt.log.error('task needs a param deps:[source||base]')
    }
    grunt.task.run([
        'bower_install',
        'clean:require',
        'copy:require',
        'bower',
        'html2js',
        'clean:require_map',
        'clean:ngconstant',
        'ngconstant:' + env,
        'angular_map',
        'require_map:' + param
      ]
    );
  });

  grunt.registerTask(
    'server', 'start server', [
//      'cmd:pouchdb-server:"--user=john","--pass=doe"',
      'cmd:couch-persona:--host=http\\\://127.0.0.1,port=5984,--username=john,--password=doe',
      'http:deleteDb',
      'deps:source',
      'http:createDb',
      'connect:source',
      'watch:source'
    ]
  );

  grunt.registerTask(
    'test', 'make test', [
      'copy:base',
      'deps:base',
      'clean:base',
      'karma:' + env
    ]
  );

  grunt.registerTask(
    'build', 'performe build', [
      'deps:source',
      'clean:build',
      'copy:build',
      'clean:deps',
      'copy:deps'
    ]
  );

  grunt.registerTask(
    'server_build', 'start server on build', [
      'build',
      'connect:build',
      'watch:build'
    ]
  );

  grunt.registerTask('release',        '',                                                      ['build', 'requirejs']);
  grunt.registerTask('server_release', '',                                                      ['release', 'connect:release']);

  grunt.registerTask('coverage',       'make coverage',                                         ['install', 'karma:coverage', 'connect:coverage']);
  grunt.registerTask('default',        '',                                                      ['test']);

};
