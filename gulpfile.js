'use strict';
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var bower       = require('gulp-bower');
var del         = require('delete');
var modRewrite  = require('connect-modrewrite');
var clean       = require('gulp-clean');
var prettify    = require('gulp-jsbeautifier');
var jshint      = require('gulp-jshint');
var rimraf      = require("gulp-rimraf");
var uglify      = require("gulp-uglify");
var usemin      = require("gulp-usemin");
var minifyCss   = require('gulp-minify-css');
var minifyHtml  = require('gulp-minify-html');
var gutil = require("gulp-util");
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var factory = require("widget-tester").gulpTaskFactory;



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
        port: 8000
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
    return del.sync('assets/components');
});

//------------------------- Watch --------------------------------
/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch([''], ['browser-sync-reload']);
});

/*---- tooling ---*/
gulp.task('pretty', function() {
  return gulp.src('./web/scripts/**/*.js')
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('./web/scripts'))
    .on('error', function (error) {
      console.error(String(error));
    });
});

var appJSFiles = [
  "./web/scripts/**/*.js"
];

var localeFiles = [
  "bower_components/rv-common-i18n/dist/locales/**/*"
];

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
  return gulp.src(['./web/index.html'])
    .pipe(usemin({
      css: [minifyCss(), 'concat'],
      html: [minifyHtml({empty: true})],
      js: [uglify({
        mangle:true,
        outSourceMap: false // source map generation doesn't seem to function correctly
      })]
    }))
    .pipe(gulp.dest("dist/"))
    .on('error',function(e){
      console.error(String(e));

    })
});

gulp.task("partials", function () {
  return gulp.src(['./web/partials/*.html'])
    .pipe(gulp.dest("dist/partials"))
    .on('error',function(e){
      console.error(String(e));

    })
});

gulp.task("images", function () {
  return gulp.src(['./web/images/*.*'])
    .pipe(gulp.dest("dist/images"))
    .on('error',function(e){
      console.error(String(e));
    })
});

gulp.task("data", function () {
  return gulp.src(['./web/data/*.*'])
    .pipe(gulp.dest("dist/data"))
    .on('error',function(e){
      console.error(String(e));
    })
});

gulp.task("fonts", function() {
  return gulp.src("./web/bower_components/rv-common-style/dist/fonts/**/*")
    .pipe(gulp.dest("dist/fonts"));
});

// Added it so the web component google-sheets can work
gulp.task("bower-components", function() {
  return gulp.src("./web/bower_components/**/*")
    .pipe(gulp.dest("dist/bower_components"));
});

gulp.task('build', function (cb) {
  runSequence(["clean"], ['pretty'],["html", "fonts", "locales", "partials", "images", "data", "bower-components"], cb);
});

gulp.task("config", function() {
  var env = process.env.NODE_ENV || "dev";
  gutil.log("Environment is", env);

  return gulp.src(["js/config/" + env + ".js"])
    .pipe(rename("config.js"))
    .pipe(gulp.dest("js/config"));
});

gulp.task("config-e2e", function() {
  var env = process.env.E2E_ENV || "dev";
  gutil.log("Environment is", env);

  return gulp.src(["test/e2e/con" +
    "fig/" + env + ".json"])
    .pipe(rename("config.json"))
    .pipe(gulp.dest("test/e2e/config"));
});

/*---- testing ----*/

var unitTestFiles = [
  "web/bower_components/common-header/dist/js/dependencies.js",
  "web/bower_components/angular-mocks/angular-mocks.js",
  "web/bower_components/q/q.js",
  "web/bower_components/common-header/dist/js/common-header.js",
  "web/bower_components/angular-ui-router/release/angular-ui-router.js",
  "web/bower_components/angular-translate/angular-translate.js",
  "web/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
  "web/bower_components/rv-common-i18n/dist/i18n.js",
  "web/bower_components/rv-common-app-components/dist/js/focus-me.js",
  "web/bower_components/rv-common-app-components/dist/js/confirm-instance.js",
  "node_modules/widget-tester/mocks/segment-analytics-mock.js",
  "web/scripts/app.js",
  "web/scripts/**/*.js",
  "test/unit/**/*.js"
];


gulp.task("test:unit", factory.testUnitAngular({testFiles: unitTestFiles}));

gulp.task("server", factory.testServer({
  html5mode: true,
  rootPath: "./web"
}));
gulp.task("server-close", factory.testServerClose());
gulp.task("test:webdrive_update", factory.webdriveUpdate());
gulp.task("test:e2e:core", ["test:webdrive_update"], factory.testE2EAngular({
  browser: "chrome",
  loginUser: process.env.E2E_USER,
  loginPass: process.env.E2E_PASS,
  testFiles: process.env.TEST_FILES
}));
gulp.task("test:e2e", function (cb) {
  runSequence("config-e2e","server", "test:e2e:core", "server-close", cb);
});


gulp.task("metrics", factory.metrics());
gulp.task("test",  function (cb) {
  runSequence("config", ["test:unit", "test:e2e"], cb);
});

gulp.task("test:ci",  function (cb) {
  runSequence("test:unit", "metrics", cb);
});

/**
 * Do a bower clean install
 */
gulp.task('bower-clean-install', ['bower-rm', 'bower-install']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);




