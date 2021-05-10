"use strict";

/*jshint node: true */
/* global concat: true */

// ************************
// * Common Header        *
// * build script         *
// ************************

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    es = require("event-stream"),
    uglify = require("gulp-uglify-es").default,
    del = require("del"),
    path = require("path"),
    fs = require("fs"),
    ngHtml2Js = require("gulp-ng-html2js"),
    minifyHtml = require("gulp-htmlmin"),
    colors = require("colors");

    var commonHeaderSrcFiles = ["./tmp/partials/partials.js",
    "./src/scripts/common-header/dtv-common-header.js",
    "./src/scripts/common-header/directives/*.js",
    "./src/scripts/common-header/filters/*.js",
    "./src/scripts/common-header/controllers/*.js",
    "./src/scripts/common-header/services/*.js",
    "./src/scripts/components/*.js",
    "./dist/js/components/i18n.js",
    "./dist/js/components/gapi-loader.js",
    "./dist/js/components/core-api-client.js",
    "./dist/js/components/ui-flow.js",
    "./dist/js/components/userstate.js",
    "./dist/js/components/last-modified.js",
    "./dist/js/components/loading.js",
    "./dist/js/components/search-filter.js",
    "./dist/js/components/scrolling-list.js",
    "./dist/js/components/stop-event.js",
    "./dist/js/components/logging.js",
    "./dist/js/components/message-box.js",
    "./dist/js/components/confirm-modal.js",
    "./dist/js/components/svg-icon.js",
    "./dist/js/components/plans.js",
    "./dist/js/components/password-input.js",
    "./dist/js/components/store-products.js"
    ],
    dependencySrcFiles = ["./src/bower_components/jquery/dist/jquery.js",
    "./src/bower_components/angular/angular.js",
    "./src/bower_components/angular-sanitize/angular-sanitize.js",
    "./src/bower_components/angular-animate/angular-animate.js",
    "./src/bower_components/angular-touch/angular-touch.js",
    "./src/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
    "./src/bower_components/angular-ui-router/release/angular-ui-router.js",
    "./src/bower_components/angular-translate/angular-translate.js",
    "./src/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
    "./src/bower_components/angular-truncate/src/truncate.js",
    "./src/bower_components/angular-slugify/angular-slugify.js",
    "./src/bower_components/checklist-model/checklist-model.js",
    "./src/bower_components/ngstorage/ngStorage.js",
    "./src/bower_components/angular-spinner/dist/angular-spinner.js",
    "./src/bower_components/angular-cookies/angular-cookies.js",
    "./src/bower_components/lodash/dist/lodash.js",
    "./src/bower_components/ng-csv/build/ng-csv.js",
    "./src/bower_components/ng-tags-input/ng-tags-input.js",
    "./src/bower_components/angular-md5/angular-md5.min.js",
    "./src/bower_components/angular-local-storage/dist/angular-local-storage.js",
    "./src/bower_components/oclazyload/dist/ocLazyLoad.js"];

gulp.task("clean", function () {
  return del(["./tmp/**", "./dist/**"]);
});

// End - Tooling


// Components build
var componentsPath = "./src/scripts/components/";

var folders = fs.readdirSync(componentsPath)
  .filter(function(file) {
    return fs.statSync(path.join(componentsPath, file)).isDirectory();
  });

gulp.task("components-html2js", function() {
  return gulp.src("./src/partials/components/**/*.html")
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(ngHtml2Js({
      moduleName: function (file) {
        var pathParts = file.path.split("/");
        var folder = pathParts[pathParts.length - 2];
        return "risevision.common.components." + folder;
      },
      useStrict: true,
      prefix: "partials/components/"
    }))
    .pipe(gulp.dest("./tmp/partials/"));
});

gulp.task("components-dist", function (done) { //copy angular files
  var tasks = folders.map(function(folder) {
    return gulp.src([
      path.join(componentsPath, folder, "**/app.js"),
      path.join(componentsPath, folder, "**/svc-*.js"),
      path.join(componentsPath, folder, "**/dtv-*.js"),
      path.join(componentsPath, folder, "**/ctr-*.js"),
      path.join(componentsPath, folder, "**/ftr-*.js"),
      path.join("./tmp/partials/", folder, "*.js")
    ])
    .pipe(concat(folder + ".js"))
    .pipe(gulp.dest("dist/js/components"))
    .pipe(uglify())
    .pipe(rename(folder + ".min.js"))
    .pipe(gulp.dest("dist/js/components"));
  });
  return es.concat.apply(null, tasks)
    .on('end', done);
});

gulp.task("components-watch", function(done) {
  gulp.watch({glob: "src/partials/components/**/*.html"}, gulp.series("components-html2js"));
  gulp.watch({glob: ["src/scripts/components/**/*", "tmp/partials/*/*"]}, gulp.series("components-dist"));

  done();
});

gulp.task("build-components", gulp.series("components-html2js", "components-dist"));

// End - Components build


// Dist build
gulp.task("ch-html2js", function() {
  return gulp.src("src/partials/common-header/*.html")
    .pipe(minifyHtml({
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true
    }))
    .pipe(ngHtml2Js({
      moduleName: "risevision.apps.partials",
      useStrict: true,
      prefix: "partials/common-header/"
    }))
    .pipe(concat("partials.js"))
    .pipe(gulp.dest("./tmp/partials/"));
});

gulp.task("dependencies-dist", function () { //copy angular files
  return gulp.src(dependencySrcFiles)
    .pipe(concat("dependencies.js"))
    .pipe(gulp.dest("dist/js"))
    .pipe(uglify())
    .pipe(rename("dependencies.min.js"))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("common-header-dist", function () { //copy angular files
  return gulp.src(commonHeaderSrcFiles.concat(["./src/scripts/common-header/config/config.js"]))
    .pipe(concat("common-header.js"))
    .pipe(gulp.dest("dist/js"))
    .pipe(uglify())
    .pipe(rename("common-header.min.js"))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("build-dist", gulp.series("dependencies-dist", "common-header-dist"));

// End - Dist build

gulp.task("ch-build", gulp.series(gulp.parallel("ch-html2js", "build-components"), "build-dist"));
