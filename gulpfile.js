// Built from article: https://wpbeaches.com/getting-browsersync-running-with-gulp-4-and-valet/
// Code here: https://github.com/DanBuda11/gulp-framework/blob/master/gulpfile.js

// ************************* Imports *************************

const gulp = require("gulp");
const { src, dest, series, parallel, watch } = require('gulp');
// BrowserSync for dev server and hot reloading
const bs = require('browser-sync').create();
//const sass = require('gulp-sass');
// Minimize HTML
//const htmlmin = require('gulp-htmlmin');
// Minimize & optimize CSS
const cleanCSS = require('gulp-clean-css');
// Remove unused/dead CSS
//const purifyCSS = require('gulp-purifycss');
// PostCSS with autoprefixer
const postcss = require('gulp-postcss');
// Babel for Gulp
//const babel = require('gulp-babel');
// Minimize JS
//const uglify = require('gulp-uglify');
// Minify images
const imagemin = require('gulp-imagemin');
// Show sizes of files in the terminal
//const size = require('gulp-size');
// Remove comments from files for production
//const strip = require('gulp-strip-comments');
// Used to wipe contents of dist when running build task
const del = require('del');
//css
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
//gh pages
const ghPages = require('gh-pages');

// ************************* Folder Paths *************************

const paths = {
  input: 'src',
  output: 'dist',
  devHTML: 'src/*.html',
  devCSS: 'src/css/*.css',
  //devSCSS: 'src/scss/*.scss',
  devJS: 'src/js/*.js',
  devImages: 'src/img/*.{png,gif,jpg,jpeg,svg}',
  //devFavicons: 'src/*.{ico,png,xml,svg,webmanifest}',
  prodCSS: 'dist/css',
  prodJS: 'dist/js',
  prodImages: 'dist/img',
  //normalize: 'src/css/normalize.css',
};

// ************************* Development Tasks *************************

// Task to run the BrowserSync server
function browserSync() {
  // Run serveSass when starting the dev server to make sure the SCSS & dev CSS are the same
  css();

  bs.init({
    // Dev server will run at localhost:8080
    port: 3000,
    server: {
      baseDir: paths.input,
    },
  });

  watch(paths.devHTML).on('change', bs.reload);
  watch(paths.devCSS, css).on('change', bs.reload);
  watch(paths.devJS).on('change', bs.reload);
}

// ************************* Production Tasks *************************

// Wipe contents of dist folder
function clean() {
  return del([`${paths.output}/**`, `!${paths.output}`]);
}

// Minimize HTML files
function buildHTML() {
  return src(paths.devHTML)
    //.pipe(strip())
    //.pipe(htmlmin({ collapseWhitespace: true, minifyJS: true }))
    //.pipe(size({ showFiles: true }))
    .pipe(dest(paths.output));
}

// Move any files in font foler to dist folder for deploy
function fonts (cb) {
    return gulp.src("src/fonts/*")
        .pipe(gulp.dest("dist/fonts"))

    cb();
}

// Compiles CSS
function css () {
    // Inital sass file to grab for compile
    return src([
    // we will use concat to package these files together
    'src/css/*.css'
    ])
        .pipe(sourcemaps.init())
        .pipe( 
            postcss([ 
                require('autoprefixer'), 
                require('postcss-preset-env')({
                    stage:1,
                    // PostCSS Preset Env supports any standard browserslist configuration
                    browsers: ["IE 11, last 2 versions"]
                }) 
            ]) 
        )
        .pipe(concat("app.css"))
        // Creates minifed CSS file with ie8 compatible syntax
        .pipe(
            cleanCSS({
                compatibility: 'ie8'
            })
        )
        // Writes sourcemap to properly debug minified CSS and identify line location of any errors
        .pipe(sourcemaps.write())

        // Saves compiled CSS to chosen folder
        .pipe(gulp.dest("dist/css"))

        // Reload live server to reflect new code
        .pipe(bs.stream())
}

// Move normalize.css from src/css to dist/css
/* function buildNormalize() {
  return src(paths.normalize)
    .pipe(cleanCSS())
    .pipe(size({ showFiles: true }))
    .pipe(dest(paths.prodCSS));
} */

// Minimize JavaScript files
function buildJS() {
    return src(paths.devJS)
    .pipe(gulp.dest("dist/js"))
}

// Move any files in image folder to dist folder for deploy
function buildImages() {
  return src(paths.devImages)
    // Minimize images
    .pipe(imagemin())
    //.pipe(size({ showFiles: true }))
    .pipe(gulp.dest("dist/img"))
}

// ************************* Exported Tasks *************************
// netlify originally made our site from gh as a static site
// but now, we've added gulp script to build things
// in settings > build & deploy > change publist directory to 'dist' folder
exports.deploy = function(cb) {
    ghPages.publish('dist');

    cb();
}
// Run gulp serve in the terminal to start development mode
exports.serve = browserSync;
// Run gulp clean to empty dist folder
exports.clean = clean;
// Run gulp build to run production build
exports.build = series(
  clean,
  parallel(
    buildHTML,
    css,
    fonts,
    //buildFavicon,
    //buildCSS,
    //buildNormalize,
    buildJS,
    buildImages,
  ),
);


