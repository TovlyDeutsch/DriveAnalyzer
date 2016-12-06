var gulp = require('gulp')
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css');
var htmlReplace = require('gulp-html-replace');
var concat = require('gulp-concat');
var gutil = require('gulp-util');

// minify javascript
gulp.task('js', function() {
  gulp.src('js/*.js').pipe(uglify().on('error', gutil.log))
    .pipe(uglify())
    .pipe(concat('concat.min.js'))
    .pipe(gulp.dest('dist'))
});

// minify css
gulp.task('css', function() {
  gulp.src('style.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
})

// remove browserify script from html and replace script tag src
gulp.task('html', function() {
gulp.src('index.html')
  .pipe(htmlReplace({
    'dist': '<script src="concat.min.js"></script>',
    'remove': ''
  }))
  .pipe(gulp.dest('dist'))
})

// watches css and js files and minifies on change
gulp.task('watch', function() {
  gulp.watch('js/*.js', ['js'])
  gulp.watch('style.css', ['css'])
})

gulp.task('default', ['js', 'css', 'html', 'watch'])
