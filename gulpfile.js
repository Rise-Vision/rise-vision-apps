'use strict';
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var bower       = require('gulp-bower');
var modRewrite  = require('connect-modrewrite');
var prettify    = require('gulp-jsbeautifier');
var jshint      = require('gulp-jshint');
var rimraf      = require("gulp-rimraf");
var uglify      = require("gulp-uglify");
var usemin      = require("gulp-usemin");
var minifyCss   = require('gulp-minify-css');
var minifyHtml  = require('gulp-minify-html');
var ngHtml2Js   = require("gulp-ng-html2js");
var concat      = require("gulp-concat");
var gutil       = require("gulp-util");
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var factory     = require("widget-tester").gulpTaskFactory;
var fs          = require('fs');

//--------------------- Variables --------------------------------------

var appJSFiles = [
  "./web/scripts/app.js",
  "./web/scripts/**/*.js"
];

var partialsHTMLFiles = [
  "./web/partials/**/*.html"
];

var localeFiles = [
  "./web/bower_components/common-header/dist/locales/**/*"
];

var unitTestFiles = [
  "web/bower_components/common-header/dist/js/dependencies.js",
  "web/bower_components/angular-mocks/angular-mocks.js",
  "web/bower_components/q/q.js",
  "web/bower_components/common-header/dist/js/common-header.js",
  "web/bower_components/angular-translate/angular-translate.js",
  "web/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
  "web/bower_components/angular-ui-codemirror/ui-codemirror.js",
  "web/bower_components/angular-vertilize/angular-vertilize.js",
  "web/bower_components/angular-truncate/src/truncate.js",
  "web/bower_components/angular-slugify/angular-slugify.js",
  'web/bower_components/Sortable/Sortable.js',
  'web/bower_components/ng-tags-input/ng-tags-input.js',
  "web/bower_components/rv-angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js",
  "web/bower_components/widget-settings-ui-components/dist/js/angular/position-setting.js",
  "web/bower_components/common-header/dist/js/components/focus-me.js",
  "web/bower_components/common-header/dist/js/components/confirm-instance.js",
  "web/bower_components/common-header/dist/js/components/background-image-setting.js",
  "web/bower_components/common-header/dist/js/components/distribution-selector.js",
  "web/bower_components/common-header/dist/js/components/presentation-selector.js",
  "web/bower_components/common-header/dist/js/components/timeline.js",
  "web/bower_components/common-header/dist/js/components/timeline-basic.js",
  "web/bower_components/common-header/dist/js/components/message-box.js",
  "web/bower_components/common-header/dist/js/components/stop-event.js",
  "web/bower_components/widget-settings-ui-components/dist/js/angular/tooltip.js",
  "web/bower_components/widget-settings-ui-components/dist/js/angular/file-selector.js",
  "web/bower_components/widget-settings-ui-components/dist/js/angular/widget-button-toolbar.js",
  "node_modules/widget-tester/mocks/translate-mock.js",
  "node_modules/widget-tester/mocks/segment-analytics-mock.js",
  "web/scripts/storage-selector-app.js",
  "web/scripts/app.js",
  "web/scripts/**/*.js",
  "test/unit/**/*.tests.js",
  "test/unit/common/services/svc-zendesk-override.js"
];

var commonStyleLink = fs.realpathSync('web/bower_components/common-header') + '/**/*.css';

//------------------------- Browser Sync --------------------------------

gulp.task('browser-sync', function() {
  browserSync({
    startPath: '/index.html',
    server: {
      baseDir: './web',
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
      ]
    },
    logLevel: "debug",
    port: 8000,
    open: false
  });
});

gulp.task('browser-sync-reload', function() {
  console.log('browser-sync-reload');
  browserSync.reload();
});

//------------------------- Bower --------------------------------

/**
 * Install bower dependencies
 */
gulp.task('bower-install', ['bower-rm'], function(cb){
  return bower().on('error', function(err) {
    console.log(err);
    cb();
  });
});


/**
 *  Remove all bower dependencies
 */
gulp.task('bower-rm', function(){
  return gulp.src('assets/components', {read: false})
    .pipe(rimraf());
});

/**
 * Do a bower clean install
 */
gulp.task('bower-clean-install', ['bower-rm', 'bower-install']);


//------------------------- Watch --------------------------------
/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(partialsHTMLFiles, ['html2js']);
  gulp.watch(['./tmp/partials.js', './web/scripts/**/*.js', commonStyleLink, './web/index.html'], ['browser-sync-reload']);
  gulp.watch(unitTestFiles, ['test:unit']);
});


//------------------------ Tooling --------------------------

gulp.task('pretty', function() {
  return gulp.src(appJSFiles)
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('./web/scripts'))
    .on('error', function (error) {
      console.error(String(error));
    });
});

gulp.task("clean-dist", function () {
  return gulp.src("dist", {read: false})
    .pipe(rimraf());
});

gulp.task("clean-tmp", function () {
  return gulp.src("tmp", {read: false})
    .pipe(rimraf());
});

gulp.task("clean", ["clean-dist", "clean-tmp"]);

gulp.task("locales", function() {
  return gulp.src(localeFiles)
    .pipe(gulp.dest("dist/locales"));
});

gulp.task("lint", function() {
  return gulp.src(appJSFiles)
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

function buildHtml(path) {
  return gulp.src([path])
    .pipe(usemin({
      css: [minifyCss, 'concat'],
      html: [function() {return minifyHtml({empty: true})} ],
      js: [
        sourcemaps.init({largeFile: true}),
        'concat',
        uglify({ compress: {
          sequences     : false,  //-- join consecutive statemets with the “comma operator”
          properties    : true,   // optimize property access: a["foo"] → a.foo
          dead_code     : true,   // discard unreachable code
          drop_debugger : true,   // discard “debugger” statements
          unsafe        : false,  // some unsafe optimizations (see below)
          conditionals  : false,  //-- optimize if-s and conditional expressions
          comparisons   : true,   // optimize comparisons
          evaluate      : false,  //-- evaluate constant expressions
          booleans      : false,  //-- optimize boolean expressions
          loops         : true,   // optimize loops
          unused        : false,  //-- drop unused variables/functions
          hoist_funs    : true,   // hoist function declarations
          hoist_vars    : false,  // hoist variable declarations
          if_return     : true,   // optimize if-s followed by return/continue
          join_vars     : true,   // join var declarations
          cascade       : true,   // try to cascade `right` into `left` in sequences
          side_effects  : false,  // drop side-effect-free statements
          warnings      : true,   // warn about potentially dangerous optimizations/code
          global_defs   : {}      // global definitions
        }}),
        sourcemaps.write('.')
      ]
    }))
    .pipe(gulp.dest("dist/"))
    .on('error',function(e){
      console.error(String(e));
    });
}

gulp.task("html-index", function () {
  return buildHtml("./web/index.html");
});

gulp.task("html-selector", function () {
  return buildHtml("./web/storage-selector.html");
});

gulp.task("html", ["lint", "html-index", "html-selector"]);

gulp.task("html2js", function() {
  return gulp.src(partialsHTMLFiles)
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      loose: true
    }))
    .pipe(ngHtml2Js({
      moduleName: "risevision.apps.partials",
      prefix: "partials/"
    }))
    .pipe(concat("partials.js"))
    .pipe(gulp.dest("./web/tmp/"));
});

gulp.task("images", function () {
  return gulp.src(['./web/images/**/*.*'])
    .pipe(gulp.dest("dist/images"))
    .on('error',function(e){
      console.error(String(e));
    })
});

gulp.task("fonts", function() {
  return gulp.src("./web/bower_components/common-header/dist/fonts/**/*")
    .pipe(gulp.dest("dist/fonts"));
});

gulp.task("static-html", function() {
  return gulp.src('./web/loading-preview.html')
    .pipe(gulp.dest('dist/'));
})

gulp.task("config", function() {
  var env = process.env.NODE_ENV || "dev";
  gutil.log("Environment is", env);

  return gulp.src(["./web/scripts/config/" + env + ".js"])
    .pipe(rename("config.js"))
    .pipe(gulp.dest("./web/scripts/config"));
});

gulp.task('build', function (cb) {
  runSequence(["clean", "config"], ['pretty', 'html2js'],["html", "static-html", "fonts", "locales", "images"], cb);
});

/*---- testing ----*/

gulp.task("config-e2e", function() {
  var env = process.env.E2E_ENV || "dev";
  gutil.log("Environment is", env);

  return gulp.src(["test/e2e/config/" + env + ".json"])
    .pipe(rename("config.json"))
    .pipe(gulp.dest("test/e2e/config"));
});

gulp.task("test:unit", factory.testUnitAngular({
    coverageFiles: "../../web/scripts/**/*.js",
    testFiles: unitTestFiles
}));

gulp.task("coveralls", factory.coveralls());

gulp.task("server", factory.testServer({
  html5mode: true,
  rootPath: "./web"
}));
gulp.task("server-close", factory.testServerClose());
gulp.task("test:webdrive_update", factory.webdriveUpdate());
gulp.task("test:e2e:core", ["test:webdrive_update"],factory.testE2EAngular({
  browser: "chrome",
  loginUser: process.env.E2E_USER,
  loginPass: process.env.E2E_PASS,
  loginUser2: process.env.E2E_USER2,
  loginPass2: process.env.E2E_PASS2,
  twitterUser: process.env.TWITTER_USER,
  twitterPass: process.env.TWITTER_PASS,
  testFiles: function(){ 
    try{
      return JSON.parse(fs.readFileSync('/tmp/testFiles.txt').toString())
    } catch (e) {
      return process.env.TEST_FILES
    }
  }()
}));
gulp.task("test:e2e", function (cb) { 
  runSequence(["config", "config-e2e", "html2js"], "server", "test:e2e:core", "server-close", cb);
});

gulp.task("test",  function (cb) {
  runSequence(["config", "html2js"], "test:unit", "coveralls", cb);
});

//------------------------ Global ---------------------------------

gulp.task('default', [], function() {
  console.log('***********************'.yellow);
  console.log('  gulp dev: start a server in the  root folder and watch dev files'.yellow);
  console.log('  gulp test: run unit tests'.yellow);
  console.log('  gulp test:e2e: run e2e tests'.yellow);
  console.log('  gulp build: hint, lint, and minify files into ./dist '.yellow);
  console.log('  gulp bower-clean-install: clean bower install'.yellow);
  console.log('***********************'.yellow);
  return true;
});

gulp.task('dev', ['config', 'html2js', 'browser-sync', 'watch']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['dev']);
