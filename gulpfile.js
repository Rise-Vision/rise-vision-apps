'use strict';
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var modRewrite  = require('connect-modrewrite');
var prettify    = require('gulp-jsbeautifier');
var jshint      = require('gulp-jshint');
var rimraf      = require("gulp-rimraf");
var uglify      = require("gulp-uglify-es").default;
var usemin      = require("gulp-usemin");
var cleanCSS    = require('gulp-clean-css');
var minifyHtml  = require('gulp-minify-html');
var ngHtml2Js   = require("gulp-ng-html2js");
var concat      = require("gulp-concat");
var log         = require("fancy-log");
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var colors      = require("colors");
var factory     = require("widget-tester").gulpTaskFactory;
var fs          = require('fs');
var os          = require('os');

var Builder     = require('systemjs-builder');
var inject      = require('gulp-inject');

require("./ch-build");
require("./i18n-build");
require("./css-build");

//--------------------- Variables --------------------------------------

var appJSFiles = [
  "./web/scripts/app.module.ajs.js",
  "./web/scripts/**/*.js"
];

var partialsHTMLFiles = [
  "./web/partials/**/*.html"
];

var unitTestFiles = [
  "web/bower_components/jquery/dist/jquery.js",
  "web/bower_components/angular/angular.js",
  "web/bower_components/angular-sanitize/angular-sanitize.js",
  "web/bower_components/angular-animate/angular-animate.js",
  "web/bower_components/angular-touch/angular-touch.js",
  "web/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
  "web/bower_components/angular-ui-router/release/angular-ui-router.js",
  "web/bower_components/angular-translate/angular-translate.js",
  "web/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
  "web/bower_components/checklist-model/checklist-model.js",
  "web/bower_components/ngstorage/ngStorage.js",
  "web/bower_components/angular-spinner/dist/angular-spinner.js",
  "web/bower_components/angular-cookies/angular-cookies.js",
  "web/bower_components/lodash/dist/lodash.js",
  "web/bower_components/ng-csv/build/ng-csv.js",
  "web/bower_components/ng-tags-input/ng-tags-input.js",
  "web/bower_components/angular-md5/angular-md5.min.js",
  "web/bower_components/angular-local-storage/dist/angular-local-storage.js",
  "web/bower_components/angular-messages/angular-messages.js",
  "web/bower_components/angular-mocks/angular-mocks.js",
  "web/bower_components/q/q.js",
  "web/bower_components/angular-ui-codemirror/ui-codemirror.js",
  "web/bower_components/angular-truncate/src/truncate.js",
  "web/bower_components/angular-slugify/angular-slugify.js",
  'web/bower_components/oclazyload/dist/ocLazyLoad.js',
  'web/bower_components/Sortable/Sortable.js',
  "web/bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js",
  "web/bower_components/moment/moment.js",
  "web/bower_components/angularjs-slider/dist/rzslider.min.js",
  "web/bower_components/oidc-client/dist/oidc-client.js",
  "node_modules/widget-tester/mocks/translate-mock.js",
  "web/tmp/partials.js",
  "web/scripts/components/**/*.js",
  "web/scripts/common-header/*.js",
  "web/scripts/common-header/**/*.js",
  "web/scripts/storage-selector-app.js",
  "web/scripts/app.module.ajs.js",
  "web/scripts/purchase/**/*.js",
  "web/scripts/billing/**/*.js",
  "web/scripts/common/**/*.js",
  "web/scripts/config/test.js",
  "web/scripts/displays/**/*.js",
  "web/scripts/editor/**/*.js",
  "web/scripts/schedules/**/*.js",
  "web/scripts/storage/**/*.js",
  "web/scripts/template-editor/**/*.js",
  "web/scripts/widgets/**/*.js",
  "test/unit/**/mocks/*.js",
  "test/unit/**/*.tests.js",
  "test/unit/**/*-spec.js",
  "test/unit/common-header/services/svc-help-widget-override.js"
];

//------------------------- Browser Sync --------------------------------

gulp.task('browser-sync', function() {
  browserSync({
    startPath: '/index.html',
    files: ['./web/tmp/partials.js', './web/scripts/**/*.ts', './dist/css/*.css', './web/index.html'],
    server: {
      baseDir: './web',
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
      ]
    },
    reloadDebounce: 2000,
    reloadDelay: 2000,
    logLevel: "debug",
    port: 8000,
    open: false
  });
});

//------------------------- Watch --------------------------------
/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(partialsHTMLFiles, ['html2js']);
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

gulp.task("lint", function() {
  let lintError;

  return gulp.src(appJSFiles)
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(jshint.reporter("fail"))
    .on("error", function(e){
      lintError = true;
    })
    .on("end", function(){
      if(lintError) {
        process.exit();
      }
    });
});

function buildHtml(path) {
  return gulp.src([path])
    .pipe(usemin({
      css: [cleanCSS, 'concat'],
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
  return buildHtml("./web/index_raw.html");
});

gulp.task("html-selector", function () {
  return buildHtml("./web/storage-selector.html");
});

gulp.task("html-user-manager-silent", function () {
  return buildHtml("./web/user-manager-silent.html");
});

gulp.task("html", ["lint", "html-index", "html-selector", "html-user-manager-silent"]);

gulp.task("jpgcompressor", function() {
  return gulp.src("node_modules/compressorjs/dist/compressor.min.js")
    .pipe(gulp.dest("web/vendor/compressor"));
});

gulp.task("tus", function() {
  return gulp.src("node_modules/tus-js-client/dist/tus.min.js")
    .pipe(gulp.dest("web/vendor/tus"));
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

gulp.task("vendor", function () {
  return gulp.src(['./web/vendor/**/*.*'])
    .pipe(gulp.dest("dist/vendor"))
    .on('error',function(e){
      console.error(String(e));
    })
});

gulp.task("static-html", function() {
  return gulp.src(['./web/loading-preview.html', './web/user-manager-silent.html'])
    .pipe(gulp.dest('dist/'));
})

gulp.task("config", function() {
  var env = process.env.NODE_ENV || "dev";
  log("Environment is", env);

  return gulp.src(["./web/scripts/config/" + env + ".js"])
    .pipe(rename("config.js"))
    .pipe(gulp.dest("./web/scripts/config"));
});

gulp.task("angular2-src", function () {
  return gulp.src(['./web/src/**/*.js'])
    .pipe(gulp.dest("dist/src"))
    .on('error',function(e){
      console.error(String(e));
    })
});

gulp.task("index-rename", function() {
  return gulp.src('./dist/index_raw.html')
    .pipe(rename("index.html"))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bundle-angular-deps', function() {
  // optional constructor options
  // sets the baseURL and loads the configuration file
  var builder = new Builder('', 'web/systemjs.config.js');

  return builder
    .bundle('web/src/main.js - [web/src/**/*.js]', 'web/angular2-deps.js', {}) //{ minify: true, sourceMaps: true })
    .then(function() {
      console.log('Build complete');
    })
    .catch(function(err) {
      console.log('Build error');
      console.log(err);
    });
});

gulp.task('angular2-inject', function () {
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var srcStream = gulp.src(['./web/angular2-deps.js'], {read: false});

  return gulp.src('./web/index.html')
    .pipe(rename("index_raw.html"))
    .pipe(inject(srcStream, {relative: true}))
    .pipe(gulp.dest('./web'));
});

gulp.task('build-pieces', function (cb) {
  runSequence(["clean"], ['config', 'i18n-build', 'css-build', 'html2js', 'tus', 'jpgcompressor'], cb);
});

gulp.task('build', function (cb) {
  runSequence(["clean", "bundle-angular-deps"], ['angular2-inject'], ['build-pieces'], ["html", "static-html", "images", "vendor", "angular2-src"], ["index-rename"], cb);
});

/*---- testing ----*/

gulp.task("config-e2e", function() {
  var env = process.env.E2E_ENV || "dev";
  log("Environment is", env);

  return gulp.src(["test/e2e/config/" + env + ".json"])
    .pipe(rename("config.json"))
    .pipe(gulp.dest("test/e2e/config"));
});

gulp.task("test:unit:nocoverage", factory.testUnitAngular({
    testFiles: unitTestFiles,
    basePath: '../..'
}));

gulp.task("test:unit", factory.testUnitAngular({
    coverageFiles: "web/scripts/**/*.js",
    basePath: '../..',
    testFiles: unitTestFiles
}));

gulp.task("coveralls", factory.coveralls());

gulp.task("server", factory.testServer({
  html5mode: true,
  rootPath: "./web"
}));
gulp.task("server-close", factory.testServerClose());
gulp.task("test:webdriver_update", factory.webdriverUpdateSpecific({
    browsers: ["gecko=false"],
    webdriverManagerArgs: ["--versions.chrome=" + (process.env.CHROME_VERSION || "latest")]
  }
));
gulp.task("test:e2e:core", ["test:webdriver_update"],factory.testE2EAngular({
  browser: "chrome",
  loginUser: process.env.E2E_USER,
  loginPass: process.env.E2E_PASS,
  loginUser1: process.env.E2E_USER1,
  loginPass1: process.env.E2E_PASS1,
  stageEnv: process.env.STAGE_ENV || os.userInfo().username || 'local',
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
  runSequence(["build-pieces", "config-e2e"], "server", "test:e2e:core", "server-close", cb);
});

gulp.task("test",  function (cb) {
  runSequence(["build-pieces"], "test:unit", "coveralls", cb);
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

gulp.task('dev', ['lint', 'build-pieces', 'browser-sync', 'watch']);

/**
 * Default task, running just `gulp` will compile the sass, launch BrowserSync & watch files.
 */
gulp.task('default', ['dev']);
