"use strict"
/* global require */

var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCSS = require("gulp-minify-css");
var rename = require("gulp-rename");
var colors = require("colors");

var paths = {
  sass: ["./web/scss/**/*.scss", "./web/scss/*.scss"],
  appSass: "./web/scss/app.scss",
  alignmentSass: "./web/scss/ui-components/alignment.scss",
  quillCss: ["./node_modules/quill/dist/quill.core.css", "./node_modules/quill/dist/quill.snow.css"],
  tmpFonts: "./web/tmp/fonts",
  tmpCss: "./web/tmp/css",
  distFonts: "./dist/fonts",
  distCss: "./dist/css",
  fonts: ["./web/bower_components/font-awesome/fonts/*.*","./web/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*.*"]
};

var cssBuild = {};

gulp.task("fonts-copy", function () {
  console.log("[COPY] copying over fonts".yellow);

  gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.distFonts));
});

gulp.task("css-build-alignment", function () {
  return gulp.src(paths.alignmentSass)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(minifyCSS({ keepBreaks: true }))
    .pipe(rename("alignment.min.css"))
    .pipe(gulp.dest(paths.tmpCss))
    .pipe(gulp.dest(paths.distCss));
});

gulp.task("css-build-quill", function () {
  return gulp.src(paths.quillCss)
    .pipe(gulp.dest(paths.tmpCss))
    .pipe(gulp.dest(paths.distCss));
});

gulp.task("css-build", ["css-build-alignment", "css-build-quill", "fonts-copy"], function() {
  console.log("[SASS] recompiling".yellow);
  gulp.src(paths.appSass)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(rename("rise.css"))
    .pipe(gulp.dest(paths.tmpCss))
    .pipe(gulp.dest(paths.distCss))
    .pipe(minifyCSS())
    .pipe(rename("rise.min.css"))
    .pipe(gulp.dest(paths.tmpCss))
    .pipe(gulp.dest(paths.distCss))
  console.log("[CSS] minifying".yellow);

  gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.tmpFonts))
    .pipe(gulp.dest(paths.distFonts));
});

gulp.task("css-watch", ["css-build"], function() {
  // Watch Less files for changes
  gulp.watch(paths.sass, ["css-build"]);
  console.log("[SASS] Watching for changes in SASS files".yellow);
});

module.exports = cssBuild;
