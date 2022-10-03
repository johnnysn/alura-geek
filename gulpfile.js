const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const { src, series, parallel, dest, watch } = require('gulp');

const htmlPath = 'src/*.html';
const jsPath = 'src/assets/js/**/*.js';
const cssPath = 'src/assets/css/**/*.css';
const sassPath = 'src/assets/scss/**/*.scss';
const imgPath = 'src/assets/img/**/*';
const destination = 'dist'

function copyHtml() {
  return src(htmlPath).pipe(dest(destination));
}

function imgTask() {
  return src(imgPath).pipe(imagemin()).pipe(dest(destination + '/assets/img'));
}

function cssTask() {
  return src(cssPath)
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(destination + '/assets/css'));
}

function jsTask() {
  return src(jsPath)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest(destination + '/assets/js'));
}

function sassTask() {
  return src('src/assets/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('src/assets/css'));
}

function watchTask() {
  watch(
    [jsPath, sassPath, htmlPath, imgPath], { interval: 1000 }, 
      parallel(copyHtml, series(sassTask, cssTask), jsTask, imgTask)
    );
}

function watchScssTask() {
  watch([sassPath], { interval: 1000 }, parallel(sassTask));
}

exports.cssTask = cssTask;
exports.jsTask = jsTask;
exports.imgTask = imgTask;
exports.copyHtml = copyHtml;
exports.sassTask = sassTask;
exports.watchScssTask = watchScssTask;
exports.watch = watchTask;
exports.default = series(
  parallel(copyHtml, imgTask, jsTask, series(sassTask, cssTask)),
  watchTask
);