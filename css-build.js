"use strict"
/* global require */

var gulp = require("gulp");
var sass = require("gulp-sass");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var colors = require("colors");

var paths = {
  sass: ["./src/scss/**/*.scss", "./src/scss/*.scss"],
  appSass: "./src/scss/rise.scss",
  alignmentSass: "./src/scss/ui-components/alignment.scss",
  tmpFonts: "./src/tmp/fonts",
  tmpCss: "./src/tmp/css",
  distFonts: "./dist/fonts",
  distCss: "./dist/css",
  fonts: ["./src/bower_components/font-awesome/fonts/*.*","./src/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*.*"]
};

var cssBuild = {};

gulp.task("fonts-copy", function () {
  console.log("[COPY] copying over fonts".yellow);

  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.tmpFonts))
    .pipe(gulp.dest(paths.distFonts));
});

gulp.task("css-build-alignment", function () {
  return gulp.src(paths.alignmentSass)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(cleanCSS({ format: 'keep-breaks' }))
    .pipe(rename("alignment.min.css"))
    .pipe(gulp.dest(paths.tmpCss))
    .pipe(gulp.dest(paths.distCss));
});

gulp.task("css-compile", function() {
  console.log("[SASS] recompiling & minifying".yellow);
  return gulp.src(paths.appSass)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(rename("rise.css"))
    .pipe(gulp.dest(paths.tmpCss))
    .pipe(gulp.dest(paths.distCss))
    .pipe(cleanCSS())
    .pipe(rename("rise.min.css"))
    .pipe(gulp.dest(paths.tmpCss))
    .pipe(gulp.dest(paths.distCss));
});

gulp.task("css-build", gulp.series(gulp.parallel("css-build-alignment", "fonts-copy"), "css-compile"));

gulp.task("css-watch", gulp.series("css-build", function(done) {
  // Watch Less files for changes
  gulp.watch(paths.sass, gulp.series("css-build"));
  console.log("[SASS] Watching for changes in SASS files".yellow);

  done();
}));

module.exports = cssBuild;
