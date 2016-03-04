/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
<<<<<<< HEAD
The compvare set of authors may be found at http://polymer.github.io/AUTHORS.txt
The compvare set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
=======
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
>>>>>>> upstream/master
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

<<<<<<< HEAD
=======
// Include promise polyfill for node 0.10 compatibility
require('es6-promise').polyfill();

>>>>>>> upstream/master
// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var merge = require('merge-stream');
var path = require('path');
var fs = require('fs');
var glob = require('glob-all');
var historyApiFallback = require('connect-history-api-fallback');
var packageJson = require('./package.json');
var crypto = require('crypto');
<<<<<<< HEAD
// var ghPages = require('gulp-gh-pages');
var htmlmin = require('gulp-htmlmin');
var cssnano = require('gulp-cssnano');
var replace = require('gulp-replace');
=======
var ensureFiles = require('./tasks/ensure-files.js');

// var ghPages = require('gulp-gh-pages');
>>>>>>> upstream/master

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var DIST = 'dist';

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

<<<<<<< HEAD
var styvarask = function(stylesPath, srcs) {
=======
var styleTask = function(stylesPath, srcs) {
>>>>>>> upstream/master
  return gulp.src(srcs.map(function(src) {
      return path.join('app', stylesPath, src);
    }))
    .pipe($.changed(stylesPath, {extension: '.css'}))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/' + stylesPath))
    .pipe($.minifyCss())
    .pipe(gulp.dest(dist(stylesPath)))
    .pipe($.size({title: stylesPath}));
};

var imageOptimizeTask = function(src, dest) {
  return gulp.src(src)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(dest))
    .pipe($.size({title: 'images'}));
};

var optimizeHtmlTask = function(src, dest) {
  var assets = $.useref.assets({
<<<<<<< HEAD
    searchPath: ['.tmp', 'app', dist()]
  });

  return gulp.src(src)
    // Replace path for vulcanized assets
    .pipe($.if('*.html', $.replace('elements/elements.html', 'elements/elements.vulcanized.html')))
=======
    searchPath: ['.tmp', 'app']
  });

  return gulp.src(src)
>>>>>>> upstream/master
    .pipe(assets)
    // Concatenate and minify JavaScript
    .pipe($.if('*.js', $.uglify({
      preserveComments: 'some'
    })))
    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
    // Output files
    .pipe(gulp.dest(dest))
    .pipe($.size({
      title: 'html'
    }));
};

// Compile and automatically prefix stylesheets
gulp.task('styles', function() {
<<<<<<< HEAD
  return styvarask('styles', ['**/*.css']);
});

gulp.task('elements', function() {
  return styvarask('elements', ['**/*.css']);
});

// Lint JavaScript
gulp.task('lint', function() {
  return gulp.src([
      'app/scripts/**/*.js',
      'app/elements/**/*.js',
      'app/elements/**/*.html',
      'gulpfile.js'
    ])
    .pipe(reload({
      stream: true,
      once: true
    }))

  // JSCS has not yet a extract option
  .pipe($.if('*.html', $.htmlExtract()))
  .pipe($.jshint())
  .pipe($.jscs())
  .pipe($.jscsStylish.combineWithHintResults())
  .pipe($.jshint.reporter('jshint-stylish'))
  .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
=======
  return styleTask('styles', ['**/*.css']);
});

// Ensure that we are not missing required files for the project
// "dot" files are specifically tricky due to them being hidden on
// some systems.
gulp.task('ensureFiles', function(cb) {
  var requiredFiles = ['.bowerrc'];

  ensureFiles(requiredFiles.map(function(p) {
    return path.join(__dirname, p);
  }), cb);
>>>>>>> upstream/master
});

// Optimize images
gulp.task('images', function() {
  return imageOptimizeTask('app/images/**/*', dist('images'));
});

// Copy all files at the root level (app)
gulp.task('copy', function() {
  var app = gulp.src([
    'app/*',
<<<<<<< HEAD
    'app/**/*.json', // workaround to copy json/
    '!app/test',
    '!app/cache-config.json'
=======
    '!app/test',
    '!app/elements',
    '!app/bower_components',
    '!app/cache-config.json',
    '!**/.DS_Store'
>>>>>>> upstream/master
  ], {
    dot: true
  }).pipe(gulp.dest(dist()));

<<<<<<< HEAD
  var bower = gulp.src([
    'bower_components/**/*'
  ]).pipe(gulp.dest(dist('bower_components')));

  var elements = gulp.src(['app/elements/**/*.html',
      'app/elements/**/*.css',
      'app/elements/**/*.js'
    ])
    .pipe(gulp.dest(dist('elements')));

  var swBootstrap = gulp.src(['bower_components/platinum-sw/bootstrap/*.js'])
    .pipe(gulp.dest(dist('elements/bootstrap')));

  var swToolbox = gulp.src(['bower_components/sw-toolbox/*.js'])
    .pipe(gulp.dest(dist('sw-toolbox')));

  var vulcanized = gulp.src(['app/elements/elements.html'])
    .pipe($.rename('elements.vulcanized.html'))
    .pipe(gulp.dest(dist('elements')));

  return merge(app, bower, elements, vulcanized, swBootstrap, swToolbox)
=======
  // Copy over only the bower_components we need
  // These are things which cannot be vulcanized
  var bower = gulp.src([
    'app/bower_components/{webcomponentsjs,platinum-sw,sw-toolbox,promise-polyfill}/**/*'
  ]).pipe(gulp.dest(dist('bower_components')));

  return merge(app, bower)
>>>>>>> upstream/master
    .pipe($.size({
      title: 'copy'
    }));
});

// Copy web fonts to dist
gulp.task('fonts', function() {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest(dist('fonts')))
    .pipe($.size({
      title: 'fonts'
    }));
});

// Scan your HTML for assets & optimize them
gulp.task('html', function() {
  return optimizeHtmlTask(
<<<<<<< HEAD
    ['app/**/*.html', '!app/{elements,test}/**/*.html'],
=======
    ['app/**/*.html', '!app/{elements,test,bower_components}/**/*.html'],
>>>>>>> upstream/master
    dist());
});

// Vulcanize granular configuration
gulp.task('vulcanize', function() {
<<<<<<< HEAD
  var DEST_DIR = dist('elements');
  return gulp.src(dist('elements/elements.vulcanized.html'))
=======
  return gulp.src('app/elements/elements.html')
>>>>>>> upstream/master
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
<<<<<<< HEAD
    .pipe(gulp.dest(DEST_DIR))
=======
    .pipe(gulp.dest(dist('elements')))
>>>>>>> upstream/master
    .pipe($.size({title: 'vulcanize'}));
});

// Generate config data for the <sw-precache-cache> element.
// This include a list of files that should be precached, as well as a (hopefully unique) cache
// id that ensure that multiple PSK projects don't share the same Cache Storage.
// This task does not run by default, but if you are interested in using service worker caching
// in your project, please enable it within the 'default' task.
// See https://github.com/PolymerElements/polymer-starter-kit#enable-service-worker-support
// for more context.
gulp.task('cache-config', function(callback) {
  var dir = dist();
  var config = {
    cacheId: packageJson.name || path.basename(__dirname),
    disabled: false
  };

  glob([
    'index.html',
    './',
    'bower_components/webcomponentsjs/webcomponents-lite.min.js',
    '{elements,scripts,styles}/**/*.*'],
    {cwd: dir}, function(error, files) {
    if (error) {
      callback(error);
    } else {
      config.precache = files;

      var md5 = crypto.createHash('md5');
      md5.update(JSON.stringify(config.precache));
      config.precacheFingerprint = md5.digest('hex');

      var configPath = path.join(dir, 'cache-config.json');
      fs.writeFile(configPath, JSON.stringify(config), callback);
    }
  });
});

// Clean output directory
gulp.task('clean', function() {
  return del(['.tmp', dist()]);
});

// Watch files for changes & reload
<<<<<<< HEAD
gulp.task('serve', ['styles', 'elements', 'images'], function() {
=======
gulp.task('serve', ['styles'], function() {
>>>>>>> upstream/master
  browserSync({
    port: 5000,
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: ['.tmp', 'app'],
<<<<<<< HEAD
      middleware: [historyApiFallback()],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
  gulp.watch(['app/elements/**/*.css'], ['elements', reload]);
  gulp.watch(['app/{scripts,elements}/**/{*.js,*.html}'], ['lint']);
=======
      middleware: [historyApiFallback()]
    }
  });

  gulp.watch(['app/**/*.html', '!app/bower_components/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], reload);
>>>>>>> upstream/master
  gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function() {
  browserSync({
    port: 5001,
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: dist(),
    middleware: [historyApiFallback()]
  });
});

// Build production files, the default task
gulp.task('default', ['clean'], function(cb) {
  // Uncomment 'cache-config' if you are going to use service workers.
  runSequence(
<<<<<<< HEAD
    ['copy', 'styles'],
    'elements',
    ['lint', 'images', 'fonts', 'html'],
    // 'vulcanize',
    'cache-config',
    cb);
});

// TODO: Everything can be reinstalled using Bower and Bower is fast!
// backup all dependencies inside bower_components.
// gulp.task('backup', function() {
// 	return gulp.src([
// 		'bower_components/**/*'
// 	])
// 		.pipe(gulp.dest('backup'));
// });

// minifying all dependencies inside bower_components.
gulp.task('mindep', function() {
  return gulp.src([
		'bower_components/@(app-|iron-|paper-|google-|firebase-|gold-|platinum-|neon-|font-|polymer)' +
		'*/**/*.html',
		// 'bower_components/@(app-|iron-|paper-|google-|firebase-|gold-|platinum-|neon-)*/**/*.js',
		'!bower_components/@(app-|iron-|paper-|google-|firebase-|gold-|platinum-|neon-|font-)' +
		'*/@(demo|test)/**/*',
		'!bower_components/@(app-|iron-|paper-|google-|firebase-|gold-|platinum-|neon-|font-)' +
		'*/**/@(demo|test)/**/*',
		'!bower_components/@(app-|iron-|paper-|google-|firebase-|gold-|platinum-|neon-|font-)' +
		'*/index.html',
		'!bower_components/iron-flex-layout/*' // avoid iron-flex-layout.
	])
	.pipe($.size({
  showFiles: true,
  pretty: true,
  title: 'mindep: '
	}))
	.pipe(htmlmin({
  minifyCSS: true,
  minifyJS: true,
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  removeComments: true,
  removeCommentsFromCDATA: true,
  caseSensitive: true,
  customAttrAssign: [/\$=/]
	}))
	.pipe(gulp.dest('backup'));
});
// TODO: special treatment for page.js.
gulp.task('minpage', function() {
  return gulp.src([
		'bower_components/page/*.js'
	])
		.pipe($.uglify())
		.pipe(gulp.dest('backup/page'));
});
gulp.task('cleandep', function() {
  del([
  'bower_components/' +
	'@(app-|iron-|paper-|google-|firebase-|gold-|platinum-|neon-|font-|page|polymer)*'
	]);
});
gulp.task('movemin', function() {
  return gulp.src([
		'backup/**/*'
	])
		.pipe(gulp.dest('bower_components'));
});
gulp.task('nobackup', function() {
  del([
		'backup',
		'.tmp'
	]);
});
// special treatment for iron-flex-layout as clean-css doesn't know how to parse Polymer's mixins.
gulp.task('minflex', function() {
  return gulp.src([
		'bower_components/iron-flex-layout/**/*.html'
	])
  .pipe($.htmlExtract({
    sel: 'style'
  }))
  .pipe(cssnano())
  .pipe($.rename({
    extname: '.css'
  }))
  .pipe(gulp.dest('.tmp'));
});
gulp.task('reflex', function() {
  var allFiles = [];
  var fileIdx = 0;
  var flexlayout = gulp.src([
		'bower_components/iron-flex-layout/iron-flex-layout.html'
	], function(un, files) {
  for (var i = 0; i < files.length; i++) {
    var temp = files[i].slice(0, -5).split('/');
    allFiles.push(temp.slice(temp.indexOf('bower_components'), temp.length).join('/'));
  }
	})
		.pipe(replace(/<style>[\s\S]*<\/style>/, function() {
  var style = fs.readFileSync('.tmp/' + allFiles[fileIdx] + '.css', 'utf8');
  fileIdx++;
  return '<style>' + style + '</style>';
		}))
		.pipe(htmlmin({
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  removeComments: true,
  removeCommentsFromCDATA: true,
  caseSensitive: true,
  customAttrAssign: [/\$=/]
		}))
		.pipe(gulp.dest('backup/iron-flex-layout/'));
  var flexcls =  gulp.src([
		'bower_components/iron-flex-layout/classes/iron-flex-layout.html',
		'bower_components/iron-flex-layout/classes/iron-shadow-flex-layout.html'
	], function(un, files) {
  for (var i = 0; i < files.length; i++) {
    var temp = files[i].slice(0, -5).split('/');
    allFiles.push(temp.slice(temp.indexOf('bower_components'), temp.length).join('/'));
  }
	})
		.pipe(replace(/<style>[\s\S]*<\/style>/, function() {
  var style = fs.readFileSync('.tmp/' + allFiles[fileIdx] + '.css', 'utf8');
  fileIdx++;
  return '<style>' + style + '</style>';
		}))
		.pipe(htmlmin({
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  removeComments: true,
  removeCommentsFromCDATA: true,
  caseSensitive: true,
  customAttrAssign: [/\$=/]
		}))
		.pipe(gulp.dest('backup/iron-flex-layout/classes/'));

  return merge(flexlayout, flexcls);
});
// TODO: special treatment for polymer.
// nopolymer
gulp.task('nopolymer', function() {
  del('bower_components/polymer*');
});
// minpolymer
gulp.task('minpolymer', function() {
  return gulp.src([
    // 'bower_components/polymer/polymer-mini.html',
    // 'bower_components/polymer/polymer-micro.html',
    // 'bower_components/polymer/polymer.html'
    'bower_components/polymer/polymer*.html'
  ])
    .pipe($.htmlExtract({
      sel: 'script'
    }))
    .pipe($.uglify())
    .pipe($.rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('.tmp'));
});
// repolymer
gulp.task('repolymer', function() {
  var _polymerFile = [];
  var _idx = 0;
  return gulp.src([
    'bower_components/polymer/*.html'
  ], function(u, files) {
    for (var i = 0, _file; i < files.length; i++) {
      _file = files[i].split('/');
      _polymerFile.push(_file[_file.length - 1].slice(0, -5));
    }
  })
    .pipe(replace(/<script>[\s\S]*<\/script>/, function() {
      var s = fs.readFileSync('.tmp/bower_components/polymer/' + _polymerFile[_idx] +
        '.min.js', 'utf8');
      _idx++;
      return '<script>' + s + '</script>';
    }))
    .pipe($.minifyHtml())
    .pipe(gulp.dest('backup/polymer'));
});
// movepolymer
gulp.task('movepolymer', function() {
  return gulp.src([
    'backup/polymer/*'
  ])
    .pipe(gulp.dest('bower_components/polymer'));
});
// TODO: crunch
gulp.task('crunch', function() {
  runSequence(
		'nobackup',
		['mindep', 'minpage', 'minflex'],
		'reflex',
		'movemin'
	);
});
gulp.task('crunch-polymer', function() {
  runSequence(
    'nobackup',
    'minpolymer',
    'repolymer',
    'nopolymer',
    'movepolymer'
  );
});
gulp.task('nobower', function() {
  del('bower_components');
});

=======
    ['ensureFiles', 'copy', 'styles'],
    ['images', 'fonts', 'html'],
    'vulcanize', // 'cache-config',
    cb);
});

>>>>>>> upstream/master
// Build then deploy to GitHub pages gh-pages branch
gulp.task('build-deploy-gh-pages', function(cb) {
  runSequence(
    'default',
    'deploy-gh-pages',
    cb);
});

// Deploy to GitHub pages gh-pages branch
gulp.task('deploy-gh-pages', function() {
  return gulp.src(dist('**/*'))
<<<<<<< HEAD
    // Check if running task from Travis Cl, if so run using GH_TOKEN
=======
    // Check if running task from Travis CI, if so run using GH_TOKEN
>>>>>>> upstream/master
    // otherwise run using ghPages defaults.
    .pipe($.if(process.env.TRAVIS === 'true', $.ghPages({
      remoteUrl: 'https://$GH_TOKEN@github.com/polymerelements/polymer-starter-kit.git',
      silent: true,
      branch: 'gh-pages'
    }), $.ghPages()));
});

// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
require('web-component-tester').gulp.init(gulp);

// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
<<<<<<< HEAD
} catch (err) {}
=======
} catch (err) {
  // Do nothing
}
>>>>>>> upstream/master
