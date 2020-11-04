/* 

var gulp = require('gulp')
var sass = require('gulp-sass')
var cleanCSS = require('gulp-clean-css')
var sourcemaps = require('gulp-sourcemaps')
var browserSync = require('browser-sync').create()
var imagemin = require('gulp-imagemin')

sass.compiler = require('node-sass')

// with 4.0+ we cannot declare a task like this anymore
// we need to name the task and then register that task

gulp.task("sass", function () {
    return gulp.src("src/css/app.scss")
        // here, we execute whatever script we want
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(
            cleanCSS({
                compatibility: 'ie8'
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.stream())
})

gulp.task("html", function () {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
})

gulp.task("fonts", function () {
    return gulp.src("src/fonts/*")
        .pipe(gulp.dest("dist/fonts"))
})

gulp.task("images", function () {
    return gulp.src("src/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"))
})

function watch () {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "dist"
        }
    })

    gulp.watch("src/*.html",["html"]).on("change", browserSync.reload)
    gulp.watch("src/css/app.scss",["sass"])
    gulp.watch("src/fonts/*",["fonts"])
    gulp.watch("src/img/*",["images"])
})

gulp.task('default', ["html", "sass", "fonts", "images", "watch"])
 */

// in version 4, every function needs a callback that is going to be automatically called when the task is completed
// knowing when the task is completed is necessary in order for series and parallel to be used
// cb stands for call back, but you can also just write 'callback'
// done sends a signal that the task is done
 
// gulp
// gulp-sass
// cleanCSS
// sourcemaps
// browserSync
// imagemin
// gh pages
// auto-prefixer
// concat
// changed
// optional line-ending-corrector
// uglify

// start of "good" code

/* var gulp = require("gulp");
var sass = require("gulp-sass")
// const ghPages = require("gulp-gh-pages");

sass.compiler = require('node-sass');

var runSass = function () {
  // we want to run "sass css/app/scss app.css --watch"
  return gulp.src("src/css/app.scss")
      .pipe(sass())
      .pipe(gulp.dest("."));
}

function defaultTask(cb) {
    runSass();
    cb();
}

// in gulp 4, we use CommonJs exports instead of gulp.task in order to expose tasts to the CLI
exports.default = defaultTask */

// end of "good" code

/* const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin')
//const ghpages = require("gh-pages")
const { watch, parallel } = require('gulp');

sass.compiler = require('node-sass')

function runSass(cb) {
    // we want to run "sass css/app/scss app.css --watch"
    gulp.src('src/css/app.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(cleanCss({compatibility: 'ie8'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream())
      cb();
}

function HTML(cb) {
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))

    cb();
}

function images(cb){
    gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))

    cb();
}

function fonts(cb){
    gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'))

    cb();
} 

function Sync(cb){
    browserSync.init({
        server: {
            baseDir: ('dist')
        }
    })

    cb();
}

/* exports.deploy = function (cb) {
    ghpages.publish('dist') 

    cb();
} */

/* exports.default = function () {
    watch('src/css/app.scss', runSass);
    watch('src/*.html', parallel(HTML, fonts, images, Sync)).on('change', browserSync.reload); 
};  */

































const gulp = require('gulp')
const sass = require('gulp-sass')
const cleanCss = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require('gulp-imagemin')
const { watch, series } = require('gulp');
const browserSync = require('browser-sync').create()

sass.compiler = require('node-sass')

// Compiles CSS
function css (cb) {
    // Inital sass file to grab for compile
    return gulp.src("src/css/app.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        // Creates minifed CSS file with ie8 compatible syntax
        .pipe(
            cleanCss({
                compatibility: 'ie8'
            })
        )
        // Writes sourcemap to properly debug minified CSS and identify line location of any errors
        .pipe(sourcemaps.write())

        // Saves compiled CSS to chosen folder
        .pipe(gulp.dest("dist/css"))

        // Reload live server to reflect new code
        .pipe(browserSync.stream())
    
    cb();
}
// Move any html files to dist folder for deploy
function html (cb) {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))

    cb();
}
// Move any files in js foler to dist folder for deploy
function js (cb) {
    return gulp.src("src/js/*.js")
        .pipe(gulp.dest("dist/js"))

    cb();
}
// Move any files in font foler to dist folder for deploy
function fonts (cb) {
    return gulp.src("src/fonts/*")
        .pipe(gulp.dest("dist/fonts"))

    cb();
}
// Move any files in image folder to dist folder for deploy
function images (cb) {
    return gulp.src("src/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"))

    cb();
}

function Sync(cb) {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
    
    cb();
}

exports.default = function() {
    // You can use a single task
    watch('src/css/app.scss', css);
    // Or a composed task
    watch('src/*.html', series(Sync, css, html, js, fonts, images)).on('change', browserSync.reload);
  };