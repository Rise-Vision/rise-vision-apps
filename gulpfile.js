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
var minifyHtml  = require('gulp-htmlmin');
var ngHtml2Js   = require("gulp-ng-html2js");
var concat      = require("gulp-concat");
var log         = require("fancy-log");
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var colors      = require("colors");
var factory     = require("widget-tester").gulpTaskFactory;
var fs          = require('fs');
var os          = require('os');

require("./ch-build");
require("./i18n-build");
require("./css-build");

//--------------------- Variables --------------------------------------

var appJSFiles = [
  "./src/scripts/app.module.ajs.js",
  "./src/scripts/**/*.js"
];

var partialsHTMLFiles = [
  "./src/partials/**/*.html"
];

var unitTestFiles = [
  "src/bower_components/jquery/dist/jquery.js",
  "src/bower_components/angular/angular.js",
  "src/bower_components/angular-sanitize/angular-sanitize.js",
  "src/bower_components/angular-animate/angular-animate.js",
  "src/bower_components/angular-touch/angular-touch.js",
  "src/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
  "src/bower_components/angular-ui-router/release/angular-ui-router.js",
  "src/bower_components/angular-translate/angular-translate.js",
  "src/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
  "src/bower_components/checklist-model/checklist-model.js",
  "src/bower_components/ngstorage/ngStorage.js",
  "src/bower_components/angular-spinner/dist/angular-spinner.js",
  "src/bower_components/angular-cookies/angular-cookies.js",
  "src/bower_components/lodash/dist/lodash.js",
  "src/bower_components/ng-csv/build/ng-csv.js",
  "src/bower_components/ng-tags-input/ng-tags-input.js",
  "src/bower_components/angular-md5/angular-md5.min.js",
  "src/bower_components/angular-local-storage/dist/angular-local-storage.js",
  "src/bower_components/angular-messages/angular-messages.js",
  "src/bower_components/angular-mocks/angular-mocks.js",
  "src/bower_components/q/q.js",
  "src/bower_components/angular-ui-codemirror/ui-codemirror.js",
  "src/bower_components/angular-truncate/src/truncate.js",
  "src/bower_components/angular-slugify/angular-slugify.js",
  'src/bower_components/oclazyload/dist/ocLazyLoad.js',
  'src/bower_components/Sortable/Sortable.js',
  "src/bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js",
  "src/bower_components/moment/moment.js",
  "src/bower_components/angularjs-slider/dist/rzslider.min.js",
  "src/bower_components/oidc-client/dist/oidc-client.js",
  "node_modules/widget-tester/mocks/translate-mock.js",
  "src/tmp/partials.js",
  "src/scripts/components/**/*.js",
  "src/scripts/common-header/*.js",
  "src/scripts/common-header/**/*.js",
  "src/scripts/storage-selector-app.js",
  "src/scripts/app.module.ajs.js",
  "src/scripts/purchase/**/*.js",
  "src/scripts/billing/**/*.js",
  "src/scripts/common/**/*.js",
  "src/scripts/config/test.js",
  "src/scripts/displays/**/*.js",
  "src/scripts/editor/**/*.js",
  "src/scripts/schedules/**/*.js",
  "src/scripts/storage/**/*.js",
  "src/scripts/template-editor/**/*.js",
  "src/scripts/widgets/**/*.js",
  "test/unit/**/mocks/*.js",
  "test/unit/**/*.spec.js",
  "test/unit/common-header/services/svc-help-widget-override.js"
];

//------------------------- Browser Sync --------------------------------

gulp.task('browser-sync', function() {
  browserSync({
    startPath: '/index.html',
    files: ['./src/tmp/partials.js', './src/scripts/**/*.js', './dist/css/*.css', './src/index.html'],
    server: {
      baseDir: './src',
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
gulp.task('watch', function (done) {
  gulp.watch(partialsHTMLFiles, gulp.series('html2js'));
  gulp.watch(unitTestFiles, gulp.series('test:unit'));

  done();
});

//------------------------ Tooling --------------------------

gulp.task('pretty', function() {
  return gulp.src(appJSFiles)
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('./src/scripts'))
    .on('error', function (error) {
      console.error(String(error));
    });
});

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

gulp.task("clean-dist", function () {
  return gulp.src("dist", {read: false, allowEmpty: true})
    .pipe(rimraf());
});

gulp.task("clean-tmp", function () {
  return gulp.src("tmp", {read: false, allowEmpty: true})
    .pipe(rimraf());
});

gulp.task("clean", gulp.parallel("clean-dist", "clean-tmp"));

//------------------------ Build --------------------------

function buildHtml(path) {
  return gulp.src([path])
    .pipe(usemin({
      css: [cleanCSS, 'concat'],
      html: [function() {
        return minifyHtml({
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeComments: true
        })
      }],
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

gulp.task("html-selector", function () {
  return buildHtml("./src/storage-selector.html");
});

gulp.task("html-user-manager-silent", function () {
  return buildHtml("./src/user-manager-silent.html");
});

gulp.task("html", gulp.parallel("lint", "html-selector", "html-user-manager-silent"));

gulp.task("html2js", function() {
  return gulp.src(partialsHTMLFiles)
    .pipe(minifyHtml({
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true
    }))
    .pipe(ngHtml2Js({
      moduleName: "risevision.apps.partials",
      prefix: "partials/"
    }))
    .pipe(concat("partials.js"))
    .pipe(gulp.dest("./src/tmp/"))
    .pipe(gulp.dest("./dist/tmp/"));
});

gulp.task("config", function() {
  var env = process.env.NODE_ENV || "dev";
  log("Environment is", env);

  return gulp.src(["./src/scripts/config/" + env + ".js"])
    .pipe(rename("config.js"))
    .pipe(gulp.dest("./src/scripts/config"));
});

gulp.task('build-pieces', gulp.series("clean", gulp.parallel('config', 'i18n-build', 'css-build', 'html2js')));

gulp.task('build', gulp.series('build-pieces', "html"));

/*---- Unit testing ----*/

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
    coverageFiles: "src/scripts/**/*.js",
    basePath: '../..',
    testFiles: unitTestFiles
}));

gulp.task("coveralls", factory.coveralls());

gulp.task("test", gulp.series("build-pieces", "test:unit", "coveralls"));

/*---- e2e testing ----*/

gulp.task("dist-server", factory.testServer({
  html5mode: true,
  rootPath: "./dist",
  port: 8000
}));

gulp.task("server", factory.testServer({
  html5mode: true,
  rootPath: "./dist"
}));
gulp.task("server-close", factory.testServerClose());
gulp.task("test:webdriver_update", factory.webdriverUpdateSpecific({
    browsers: ["gecko=false"],
    webdriverManagerArgs: ["--versions.chrome=" + (process.env.CHROME_VERSION || "latest")]
  }
));
gulp.task("test:e2e:core", gulp.series("test:webdriver_update", factory.testE2EAngular({
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
})));

gulp.task("test:e2e", gulp.series(gulp.parallel("config-e2e"), "server", "test:e2e:core", "server-close"));

//------------------------ Global ---------------------------------

gulp.task('default', function(done) {
  console.log('***********************'.yellow);
  console.log('  npm run ng-start: start a server at port 8000 and watch angular files'.yellow);
  console.log('  npm run ng-build: build angular & angularjs to the dist folder'.yellow);
  console.log('  gulp dist-server: start a server at port 8000 for the dist folder'.yellow);  
  console.log('***********************'.yellow);
  console.log('  gulp build: build angularjs to dist'.yellow);
  console.log('  gulp watch: watch angularjs tests & partials'.yellow);
  console.log('  gulp test: run unit tests (angularjs)'.yellow);
  console.log('  gulp test:e2e: run e2e tests (angularjs)'.yellow);
  console.log('***********************'.yellow);
  
  done();
});
