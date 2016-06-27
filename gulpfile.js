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
  "./web/bower_components/rv-common-i18n/dist/locales/**/*"
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
  "web/bower_components/rv-common-i18n/dist/i18n.js",
  "web/bower_components/rv-common-app-components/dist/js/focus-me.js",
  "web/bower_components/rv-common-app-components/dist/js/confirm-instance.js",
  "web/bower_components/rv-common-app-components/dist/js/background-image-setting.js",
  "web/bower_components/rv-common-app-components/dist/js/distribution-selector.js",
  "web/bower_components/rv-common-app-components/dist/js/presentation-selector.js",
  "web/bower_components/rv-common-app-components/dist/js/timeline.js",
  "web/bower_components/rv-angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js",
  "web/bower_components/component-storage-selector/dist/storage-selector.js",  
  "web/bower_components/widget-settings-ui-components/dist/js/angular/*.js",
  "web/bower_components/rv-common-app-components/dist/js/stop-event.js",
  "node_modules/widget-tester/mocks/translate-mock.js",
  "node_modules/widget-tester/mocks/segment-analytics-mock.js",
  "web/scripts/storage-selector-app.js",
  "web/scripts/app.js",
  "web/scripts/**/*.js",
  "test/unit/**/*.tests.js"
];

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
  gulp.watch(['./tmp/partials.js', './web/scripts/**/*.js', './web/bower_components/rv-common-style/**/*', './web/index.html'], ['browser-sync-reload']);
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

gulp.task("html", ["lint"], function () {
  return gulp.src(['./web/index.html', './web/storage-selector.html'])
    .pipe(usemin({
      css: [minifyCss, 'concat'],
      html: [function() {return minifyHtml({empty: true})} ],
      js: [function(){ return uglify({
        mangle:true,
        outSourceMap: false // source map generation doesn't seem to function correctly
      })}]
    }))
    .pipe(gulp.dest("dist/"))
    .on('error',function(e){
      console.error(String(e));
    })
});

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
  return gulp.src("./web/bower_components/rv-common-style/dist/fonts/**/*")
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
  testFiles: function(){ 
    try{
      return JSON.parse(fs.readFileSync('/tmp/testFiles.txt').toString())
    } catch (e) {
      return process.env.TEST_FILES
    }
  }()
}));
gulp.task("test:e2e", function (cb) { 
  runSequence("config-e2e", "html2js", "server", "server-close", cb);
});

gulp.task("metrics", factory.metrics());
gulp.task("test",  function (cb) {
  runSequence(["config", "html2js"], "coveralls", cb);
});

gulp.task("test:ci",  function (cb) {
  runSequence("test:unit", "metrics", cb);
});

//------------------------ Global ---------------------------------

gulp.task('default', [], function() {
  console.log('***********************'.yellow);
  console.log('  gulp dev: start a server in the  root folder and watch dev files'.yellow);
  console.log('  gulp test: run unit and e2e tests'.yellow);
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
