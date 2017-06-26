var less = require('gulp-less');
var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('scripts', function() {
  gulp.src([
  		'./node_modules/jquery/dist/jquery.min.js',
  		'./node_modules/jquery-validation/dist/jquery.validate.min.js',
  		'../js/base.js'
  	])
    .pipe(concat('base.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../js/live/'))
});
 
gulp.task('less', function () {
  	gulp.src('../styles/base.less')
  	.pipe(less())
  	.pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('../styles/'));
});

gulp.task('watch-less', function () {
    gulp.watch('../styles/**/*.less' , ['less']);
});

gulp.task('browser-reload', function () {
 
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "../"
        }
    }); 
    gulp.watch("../styles/**/*.less").on("change", reload);
    gulp.watch("../templates/*.html").on("change", reload);
    gulp.watch("../js/*.js").on("change", reload);
});
 
/* Task when running `gulp` from terminal */
gulp.task('compiler', ['watch-less', 'browser-reload']);

gulp.task('deploy', ['scripts', 'less']);