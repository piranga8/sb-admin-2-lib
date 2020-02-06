"use strict";

// Load plugins
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const uglify = require("gulp-uglify");

// Set the banner content
const banner = ['/*!\n',
  ' * Start Bootstrap - SB Admin 2 v4.1.0 (https://startbootstrap.com/template-overviews/sb-admin-2)\n',
  ' * Copyright 2013-2020 Start Bootstrap\n',
  ' * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-sb-admin-2/blob/master/LICENSE)\n',
  ' */\n'
].join('');

//clean minified versions
function clean(){
    return del([
        "./dist/*"
    ]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  var bootstrapSCSS = gulp.src('./node_modules/bootstrap/scss/**/*')
    .pipe(gulp.dest('./vendor/bootstrap/scss'));
  return bootstrapSCSS;
}

// CSS task
function css() {
  return gulp
    .src("./scss/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(header(banner))
    .pipe(gulp.dest("dist/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/css"));
}

// JS task
function js() {
  return gulp
    .src('./js/sb-admin-2.js')
    .pipe(header(banner))
    .pipe(gulp.dest("dist/js"))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/js'));
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, gulp.parallel(css, js));

// Export tasks
exports.clean = clean;
exports.build = build;
exports.default = build;
