var gulp = require('gulp')
var uglify = require('gulp-uglify')
var removeCode = require('gulp-remove-code');

gulp.task('js', function() {
  gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('css', function() {
  gulp.src('style.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
})

gulp.task('html', function() {
gulp.src('index.html')
  .pipe(removeCode({ production: true }))
  .pipe(gulp.dest('dist'))
})

gulp.task('default', ['js', 'css', 'html'])
