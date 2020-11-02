// dependencies
const gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    cleanCSS = require ("gulp-clean-css"),
    autoprefixer = require("autoprefixer"),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano = require("cssnano"),
    browserSync = require('browser-sync').create(),
    imagemin = require ("gulp-imagemin");

// SASS TASK

gulp.task("sass", function () {
    return gulp.src("src/css/app.scss")
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

// HTML TASK

function HTML() {
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
}

// FONTS TASK

function fonts() {
    gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
}

// IMAGES TASK

function images() {
    return gulp.src("src/img/*")
        .pipe(gulp.dest("dist"));
}

// WATCH TASK

function watch () {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "dist"
        }
    })

    gulp.watch("src/*.html").on("change", browserSync.reload);
    gulp.watch("src/css/app.scss", gulp.series("sass"));
    gulp.watch("src/fonts/*", gulp.series("fonts"));
    gulp.watch("src/img/*", gulp.series("images"));
};

// DEFAULT TASK

var build = gulp.parallel(HTML, fonts, images, watch);

gulp.task(build);
gulp.task('default', build);

// exports.default = ;