/* const gulp = require('gulp')

// css
const cleanCss = require('gulp-clean-css')
const postcss    = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')


// images
const imagemin = require('gulp-imagemin')

// github pages
const { watch, series } = require('gulp')

// browser refresh
const browserSync = require('browser-sync').create()

function Sync(cb) {
    browserSync.init({
        server: {
            baseDir: ('dist')
        }
    })
    
    cb();
}

// Compiles CSS
function css (cb) {
    // Inital sass file to grab for compile
    return gulp.src([
        // we will use concat to package these files together
        'src/css/reset.css',
        'src/css/typography.css',
        'src/css/app.css'
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

// netlify originally made our site from gh as a static site
// but now, we've added gulp script to build things
// in settings > build & deploy > change publist directory to 'dist' folder
exports.deploy = function(cb) {
    ghpages.publish('dist')

    cb();
}

exports.default = function() {
    // You can use a single task
    watch('src/css/*.css', series(Sync, css, html, js, fonts, images)).on('change', browserSync.reload);
    // Or a composed task
    watch('src/*.html', series(Sync, css, html, js, fonts, images)).on('change', browserSync.reload);
  }; */


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

// Compile Sass to CSS in development
/* function serveSass() {
  return src(paths.devSCSS)
    .pipe(sass())
    .pipe(dest(paths.devCSS))
    .pipe(bs.stream());
} */

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

// Move favicon files from src to dist if they exist
/* function buildFavicon() {
  return src(paths.devFavicons).pipe(dest(paths.output));
} */

// Minimize CSS files and add prefixes if needed
/* function buildCSS() {
  return src(paths.devSCSS)
    //.pipe(sass())
    .on('error', sass.logError)
    //.pipe(purifyCSS([paths.devHTML, paths.devJS]))
    .pipe(cleanCSS())
    .pipe(postCSS())
    //.pipe(size({ showFiles: true }))
    .pipe(dest(paths.prodCSS));
} */

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

// Minimize images
function buildImages() {
  return src(paths.devImages)
    .pipe(imagemin())
    //.pipe(size({ showFiles: true }))
    .pipe(gulp.dest("dist/img"))
}

// ************************* Exported Tasks *************************

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