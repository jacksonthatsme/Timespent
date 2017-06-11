// Define variables
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Register Tasks
gulp.task('sass', function() {
  return gulp.src('./assets/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('js:vendor', function(){
  return gulp.src(['./assets/javascripts/vendor/jquery.min.js', './assets/javascripts/vendor/jquery-ui.min.js'])
  .pipe(concat('vendor.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./assets/js/'));
});

gulp.task('js:custom', function() {
  return gulp.src('./assets/javascripts/*.js')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('js', ['js:vendor', 'js:custom']);

gulp.task('build', ['sass','js']);

gulp.task('default', ['build']);
