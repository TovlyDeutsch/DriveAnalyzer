var gulp = require('gulp')
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css');
var htmlReplace = require('gulp-html-replace');
var concat = require('gulp-concat');

gulp.task('js', function() {
  gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(concat('concat.min.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('css', function() {
  gulp.src('style.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
})

gulp.task('html', function() {
gulp.src('index.html')
  .pipe(htmlReplace({
    'dist': '<script src="concat.min.js"></script>',
    'remove': ''
  }))
  .pipe(gulp.dest('dist'))
})

gulp.task('default', ['js', 'css', 'html'])
