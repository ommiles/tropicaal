const gulp = require('gulp')
const sass = require('gulp-sass')
const cleanCss = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require('gulp-imagemin')
const { watch, series } = require('gulp')
var ghpages = require('gh-pages')
const ghPages = require('gulp-gh-pages')
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
            baseDir: ('dist')
        }
    })
    
    cb();
}

// netlify originally made our site from gh as a static site
// but now, we've added gulp script to build things
// in settings > build & deploy > change publist directory to 'dist' folder
exports.deploy = function(cb) {
    ghpages.publish('dist')

    cb();
}

exports.default = function() {
    // You can use a single task
    watch('src/css/app.scss', css);
    // Or a composed task
    watch('src/*.html', series(Sync, css, html, js, fonts, images)).on('change', browserSync.reload);
  };